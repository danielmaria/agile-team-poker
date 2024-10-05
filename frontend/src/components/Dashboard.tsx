import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import PlayerEvents, { EventData } from "./PlayerEvents";
import CurrentSubject from "./CurrentSubject";
import PlayerInfo from "./PlayerInfo";
import ShareIcon from "@mui/icons-material/Share";
import RoundsControl from "./RoundsControl";
import Deck from "./Deck";
import MoreSpeedDial from "./MoreSpeedDial";
import { ApiService } from "../services/ApiService";
import { SubjectsService } from "../services/SubjectsService";
import Timer from "./Timer";
import logo from "../assets/logo.png";

interface DashboardProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
  area?: string;
  imageUrl?: string;
  closed?: boolean;
  timestamp?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsAuthenticated }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [currentSubject, setCurrentSubject] = useState<Subject>();
  const [timerStart, setTimerStart] = useState<number | undefined>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [subjects, setSubjects] = useState<Subject[] | undefined>(undefined);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await SubjectsService.fetchSubjects();
        const subjectsData = Object.entries(response).map(([id, subject]) => ({
          id: Number(id),
          name: subject.name as string,
          area: subject.area as string,
        }));
        setSubjects(subjectsData);
      } catch (err) {
        showSnackbar("Failed to fetch subjects.", "error");
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleShareRoom = () => {
    const roomUrl = `${window.location.origin}?roomHash=${user.roomHash}`;

    navigator.clipboard.writeText(roomUrl).then(
      () => {
        showSnackbar("Link copied successfully.", "success");
      },
      () => {
        showSnackbar("Fail to copy the room link.", "error");
      }
    );
  };

  useEffect(() => {
    const handleRoundEvents = (eventData: any) => {
      const history: any[] = eventData.history;
      setEvents(history);
      const lastEvent = history
        .slice()
        .reverse()
        .find((element: any) => element.type.includes("round"));
      if (lastEvent?.type?.includes("round") && !loadingSubjects) {
        const currentSubject = subjects?.find(
          (sub) => sub.id === lastEvent.round.subjectId
        );
        if (currentSubject) {
          if (currentSubject.closed) {
            setTimerStart(undefined);
          } else {
            setTimerStart(lastEvent.timestamp);
          }
          currentSubject.closed = lastEvent.round.closed;
          setCurrentSubject(currentSubject);
        }
      }
    };

    const unsubscribe = ApiService.listenToRoomEvents(
      user.roomHash,
      handleRoundEvents,
      (error) => console.error("Firestore listener error:", error)
    );

    return () => {
      unsubscribe();
    };
  }, [
    user.roomHash,
    user.organizerName,
    user.playerName,
    subjects,
    loadingSubjects,
  ]);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Box
            component="img"
            sx={{
              width: "1.5em",
              marginInline: "auto",
              marginRight: 1,
              fontSize: "1.25rem",
              marginBottom: "5px",
            }}
            src={logo}
          />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: {
                xs: "0.8rem",
                sm: "1.25rem",
              },
            }}
          >
            Agile team poker - Share room code
            <Tooltip title="Share room">
              <IconButton onClick={handleShareRoom} color="primary">
                <ShareIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </Typography>
          <PlayerInfo user={user} setIsAuthenticated={setIsAuthenticated} />
        </Toolbar>
      </AppBar>

      <Box p={3} textAlign="center">
        <Timer timerStart={timerStart} />
        <CurrentSubject subject={currentSubject} />
        <Box>
          <PlayerEvents events={events} currentSubject={currentSubject} />
        </Box>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          width: "100%",
          padding: "0 16px",
        }}
      >
        {user.isOrganizer && (
          <RoundsControl
            user={user}
            subjects={subjects}
            currentSubject={currentSubject}
            events={events}
            showSnackbar={showSnackbar}
          />
        )}
        <Deck
          user={user}
          currentSubject={currentSubject}
          showSnackbar={showSnackbar}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", mt: 7 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <MoreSpeedDial user={{ user }} subjects={{ subjects }} events={events} />
    </Box>
  );
};

export default Dashboard;
