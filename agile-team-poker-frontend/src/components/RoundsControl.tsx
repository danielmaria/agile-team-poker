import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Subject } from "./Dashboard";
import { ApiService } from "../services/ApiService";

interface RoundsControlProps {
  user: any;
  subjects?: Subject[];
  currentSubject: any;
  events: any[];
  showSnackbar: any;
}

const RoundsControl: React.FC<RoundsControlProps> = ({
  user,
  subjects,
  currentSubject,
  events,
  showSnackbar,
}) => {
  const [isRoundExpanded, setIsRoundExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roundsClosed, setRoundsClosed] = useState<number[]>([]);

  useEffect(() => {
    if (events) {
      const rounds = events
        .filter((event) => event.type === "round-closed")
        .map((event) => event.round.subjectId);
      setRoundsClosed(rounds);
    }
  }, [events]);

  const handleToggleRoundExpand = () => {
    setIsRoundExpanded(!isRoundExpanded);
  };

  const handleStartRound = async (subjectId: number) => {
    try {
      setIsLoading(true);

      if (currentSubject?.id === subjectId && !currentSubject?.closed) {
        await ApiService.closeRound(
          user.roomHash,
          subjectId,
          user.playerName,
          user.password
        );
        showSnackbar(`Round ${subjectId} closed successfully.`);
      } else {
        await ApiService.startRound(
          user.roomHash,
          user.playerName,
          subjectId,
          user.password
        );
        showSnackbar(`Round ${subjectId} started successfully.`);
        setIsRoundExpanded(false);
      }
    } catch (error) {
      showSnackbar("Failed to start or close round.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          bottom: 0,
          width: {
            xs: "50%",
            xl: "23%",
          },
          textAlign: "center",
          transition: "bottom 0.3s",
        }}
      >
        <Button
          variant="contained"
          onClick={handleToggleRoundExpand}
          sx={{
            width: "100%",
            borderRadius: "20px 20px 0 0",
          }}
        >
          Rounds
        </Button>

        <Collapse in={isRoundExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              backgroundColor: "white",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              p: 2,
              maxHeight: {
                xs: "66vh",
                xl: "46vh",
              },
              overflowY: "auto",
            }}
          >
            {subjects ? (
              subjects.map((subject) => (
                <Box
                  key={subject.id}
                  p={2}
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  flexDirection={{
                    xs: "column",
                    sm: "row",
                  }}
                >
                  <Typography
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      maxWidth: {
                        xs: "100%",
                        sm: "70%",
                      },
                      textAlign: "left",
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    {subject.id}. {subject.name}
                  </Typography>
                  <Button
                    variant={
                      currentSubject &&
                      currentSubject.id === subject.id &&
                      !currentSubject.closed
                        ? "outlined"
                        : "contained"
                    }
                    color={
                      roundsClosed.includes(subject.id)
                        ? "inherit"
                        : currentSubject &&
                          currentSubject.id === subject.id &&
                          !currentSubject.closed
                        ? "error"
                        : "primary"
                    }
                    onClick={() => handleStartRound(subject.id)}
                  >
                    {roundsClosed.includes(subject.id)
                      ? "Restart"
                      : currentSubject &&
                        currentSubject.id === subject.id &&
                        !currentSubject.closed
                      ? "Close"
                      : "Start"}
                  </Button>
                </Box>
              ))
            ) : (
              <Typography p={2}>Loading subjects...</Typography>
            )}
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default RoundsControl;
