const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = [
      "http://localhost:3001",
      "https://agile-team-poker.surge.sh",
      "https://dev-agile-team-poker.surge.sh",
    ];
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PATCH,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

async function broadcastToRoom(roomHash, data, userToSkip = undefined) {
  const roomRef = db.collection("rooms").doc(roomHash);
  const room = await roomRef.get();
  if (!room.exists) return;

  const roomData = room.data();
  for (const player of roomData.players) {
    if (userToSkip === player.name || player.name === "disconnected") {
      continue;
    }
    if (player?.res) {
      try {
        player.res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (err) {
        console.error(`Failed to send data to ${player.name}: ${err.message}`);
      }
    }
  }
}

async function storeEvent(roomHash, event) {
  const roomRef = db.collection("rooms").doc(roomHash);
  const room = await roomRef.get();

  if (!room.exists) return;
  const roomData = room.data();

  const history = roomData.history || [];
  history.push(event);

  await roomRef.update({ history });
}

app.post("/api/v1/rooms", async (req, res) => {
  const { organizerName, profile, password } = req.body;
  const roomHash = uuidv4();

  try {
    const player = {
      name: organizerName,
      profile,
      status: "connected",
      organizer: true,
    };

    await db
      .collection("rooms")
      .doc(roomHash)
      .set({
        organizer: { name: organizerName, profile, password },
        players: [player],
        history: [],
      });
    const joinEvent = { type: "player", player, timestamp: Date.now() };
    await storeEvent(roomHash, joinEvent);

    res.json({ roomHash });
  } catch (error) {
    console.error(`Error in room creation process: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/v1/rooms/:roomHash/players", async (req, res) => {
  const { roomHash } = req.params;
  const { playerName, profile, password } = req.body;

  const roomRef = db.collection("rooms").doc(roomHash);
  const roomSnapshot = await roomRef.get();

  if (!roomSnapshot.exists) {
    return res.status(404).json({ message: "Room not found" });
  }

  const roomData = roomSnapshot.data();
  if (
    roomData.organizer.name === playerName &&
    roomData.organizer.password !== password
  ) {
    return res.status(403).json({ message: "Organizer authentication failed" });
  }

  const player = { name: playerName, profile, status: "connected" };
  const players = roomData.players || [];
  players.push(player);
  if (!roomData.players.find((player) => player.name === playerName)) {
    await roomRef.update({ players });
  }

  const joinEvent = { type: "player", player, timestamp: Date.now() };
  await storeEvent(roomHash, joinEvent);

  res.status(200).json({ message: "Joined room successfully" });
});

app.post("/api/v1/rooms/:roomHash/rounds", async (req, res) => {
  const { roomHash } = req.params;
  const { organizerName, subjectId, password } = req.body;

  const roomRef = db.collection("rooms").doc(roomHash);
  const roomSnapshot = await roomRef.get();

  if (!roomSnapshot.exists) {
    return res.status(404).json({ message: "Room not found" });
  }

  const roomData = roomSnapshot.data();
  if (
    roomData.organizer.name !== organizerName ||
    roomData.organizer.password !== password
  ) {
    return res
      .status(403)
      .json({ message: "Organizer authentication failed." });
  }

  const rounds = roomData.rounds || [];
  if (rounds.some((r) => !r.closed)) {
    return res.status(400).json({ message: "Another round is still open." });
  }

  const newRound = { subjectId, moves: [], closed: false };
  rounds.push(newRound);

  await roomRef.update({ rounds });

  const roundEvent = {
    type: "round-started",
    round: newRound,
    timestamp: Date.now(),
  };
  await storeEvent(roomHash, roundEvent);

  res.json({ message: `Round ${subjectId} started` });
});

app.post(
  "/api/v1/rooms/:roomHash/rounds/:subjectId/moves",
  async (req, res) => {
    const { roomHash, subjectId } = req.params;
    const { playerName, future, mood } = req.body;

    const roomRef = db.collection("rooms").doc(roomHash);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomData = roomSnapshot.data();
    const round = roomData.rounds.find(
      (r) => r.subjectId === parseInt(subjectId) && !r.closed
    );

    if (!round) {
      return res
        .status(400)
        .json({ message: "Invalid round or round is closed" });
    }

    const validFutures = ["up", "neutral", "down"];
    const validMoods = ["happy", "neutral", "sad"];

    if (!validFutures.includes(future) || !validMoods.includes(mood)) {
      return res.status(400).json({ message: "Invalid move options" });
    }

    const move = { playerName, future, mood };
    round.moves.push(move);

    await roomRef.update({ rounds: roomData.rounds });

    const moveEvent = {
      type: "movement",
      subjectId,
      player: { name: playerName },
      timestamp: Date.now(),
      move,
    };

    await storeEvent(roomHash, moveEvent);

    res.json({ message: "Move recorded", move });
  }
);

app.patch("/api/v1/rooms/:roomHash/rounds/:subjectId", async (req, res) => {
  const { roomHash, subjectId } = req.params;
  const { organizerName, password } = req.body;

  const roomRef = db.collection("rooms").doc(roomHash);
  const roomSnapshot = await roomRef.get();

  if (!roomSnapshot.exists) {
    return res.status(404).json({ message: "Room not found" });
  }

  const roomData = roomSnapshot.data();
  if (
    roomData.organizer.name !== organizerName ||
    roomData.organizer.password !== password
  ) {
    return res
      .status(403)
      .json({ message: "Organizer authentication failed." });
  }

  const round = roomData.rounds.find(
    (r) => r.subjectId === parseInt(subjectId) && !r.closed
  );
  if (!round) {
    return res
      .status(400)
      .json({ message: "Invalid round or round is already closed" });
  }

  round.closed = true;

  await roomRef.update({ rounds: roomData.rounds });

  const roundEvent = { type: "round-closed", round, timestamp: Date.now() };
  await storeEvent(roomHash, roundEvent);

  res.json({ message: `Round ${subjectId} has been closed` });
});

app.get("/api/v1/rooms/:roomHash/rounds/:subjectId", async (req, res) => {
  const { roomHash, subjectId } = req.params;

  const roomRef = db.collection("rooms").doc(roomHash);
  const roomSnapshot = await roomRef.get();

  if (!roomSnapshot.exists) {
    return res.status(404).json({ message: "Room not found" });
  }

  const roomData = roomSnapshot.data();
  const round = roomData.rounds.find(
    (r) => r.subjectId === parseInt(subjectId)
  );

  if (!round) {
    return res.status(404).json({ message: "Round not found" });
  }

  res.json({ round });
});

app.get("/api/v1/subjects", (req, res) => {
  res.json(subjects);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const subjects = {
  1: "The team's delivery planning is organized at an ideal frequency.",
  2: "The work done by the team delivers high business value.",
  3: "There is high quality in both the deliveries and the solutions developed by the team.",
  4: "There is great collaboration and communication between the team and the customer, and vice versa.",
  5: "The team can respond to changes whenever necessary, adapting quickly.",
  6: "The team's activities are clear.",
  7: "The roles of team members are well defined.",
  8: "The team seeks simplicity in solutions.",
  9: "There is learning and knowledge exchange within the team.",
  10: "The team has adequate tools and infrastructure.",
  11: "There is excellent communication between team members.",
  12: "The work process is continuously improving.",
  13: "The team has good self-organization.",
  14: "There is good synergy between team members.",
  15: "The team has a sustainable work pace.",
  16: "The team has management support.",
  17: "The team has a safe environment to discuss ideas and make improvements.",
  18: "The team has sufficient technical knowledge to do the required work.",
  19: "The team has sufficient business knowledge to do the required work.",
  20: "Team members seek multidisciplinary skills, with each specialist learning about related areas.",
};
