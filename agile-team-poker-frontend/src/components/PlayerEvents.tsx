import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, Grid, Badge, Tooltip } from "@mui/material";
import { Subject } from "./Dashboard";
import happyIcon from "../assets/cards/emotion-happy.png";
import neutralIcon from "../assets/cards/emotion-neutral.png";
import sadIcon from "../assets/cards/emotion-sad.png";
import upIcon from "../assets/cards/up.png";
import downIcon from "../assets/cards/down.png";
import neutralFutureIcon from "../assets/cards/neutral.png";
import { getAvatarImage } from "../helpers/avatarHelper";

interface Player {
  name: string;
  status: string;
  avatar: string;
  moves: string[];
  subjectId: number;
}

export interface EventData {
  type: string;
  subjectId: string;
  player: {
    name: string;
    profile: string;
    status?: string;
  };
  move?: {
    future: string;
    mood: string;
  };
}

const moodIcon = {
  happy: happyIcon,
  neutral: neutralIcon,
  sad: sadIcon,
};
const futureIcon = {
  up: upIcon,
  down: downIcon,
  neutral: neutralFutureIcon,
};

interface PlayerEventsProps {
  events: EventData[];
  currentSubject?: Subject;
}

const PlayerEvents: React.FC<PlayerEventsProps> = ({
  events,
  currentSubject,
}) => {
  const [storedPlayer, setStoredPlayer] = useState<any>();
  const [players, setPlayers] = useState<{ [key: string]: Player }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setStoredPlayer(JSON.parse(storedUser));
    }
    events.forEach((event) => {
      const { type, player, move, subjectId } = event;
      if (player) {
        setPlayers((prevPlayers) => {
          const existingPlayer = prevPlayers[player.name] || {
            name: player.name,
            status: player.status || "disconnected",
            moves: [],
            subjectId: subjectId,
          };

          if (type === "movement" && move) {
            existingPlayer.moves = [move.future, move.mood];
            existingPlayer.subjectId = parseInt(subjectId);
          }
          if (type === "player-connected") {
            existingPlayer.status = "connected";
          }
          if (type === "player-disconnected") {
            existingPlayer.status = "disconnected";
          }
          if (type === "player") {
            existingPlayer.avatar = event.player.profile;
          }

          return {
            ...prevPlayers,
            [player.name]: existingPlayer,
          };
        });
      }
    });
  }, [events]);

  if (storedPlayer === undefined) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {Object.values(players).map((player, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">{player.name}</Typography>
            <Tooltip title="Already played">
              <Badge
                color="success"
                badgeContent="✓"
                overlap="circular"
                invisible={!player.moves.length}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Avatar
                  alt={`Avatar of ${player.name}`}
                  src={getAvatarImage(player.avatar)}
                  sx={{ width: 80, height: 80, margin: "0 auto" }}
                />
              </Badge>
            </Tooltip>
            <Box mt={2}>
              {player.name === storedPlayer?.playerName ||
              (currentSubject?.closed && player.moves) ? (
                <Box>
                  <Typography variant="body1">
                    {player.moves[0] &&
                    player.moves[1] &&
                    player.subjectId === currentSubject?.id ? (
                      <>
                        <img
                          src={
                            moodIcon[
                              player.moves[1] as "happy" | "sad" | "neutral"
                            ]
                          }
                          alt={player.moves[1]}
                          style={{
                            width: "4em",
                            height: "auto",
                          }}
                        />

                        <img
                          src={
                            futureIcon[
                              player.moves[0] as "up" | "down" | "neutral"
                            ]
                          }
                          alt={player.moves[0]}
                          style={{
                            width: "4em",
                            height: "auto",
                          }}
                        />
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          height: "4em",
                          alignContent: "space-around",
                        }}
                      >
                        Didn't make a move
                      </Typography>
                    )}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    height: "4em",
                    alignContent: "space-around",
                  }}
                >
                  Moves hidden until round closes
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlayerEvents;
