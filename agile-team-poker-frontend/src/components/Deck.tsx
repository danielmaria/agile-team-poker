import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ApiService } from "../services/ApiService";
import happyIcon from "../assets/cards/emotion-happy.png";
import neutralIcon from "../assets/cards/emotion-neutral.png";
import sadIcon from "../assets/cards/emotion-sad.png";
import upIcon from "../assets/cards/up.png";
import downIcon from "../assets/cards/down.png";
import neutralFutureIcon from "../assets/cards/neutral.png";

interface DeckProps {
  user: any;
  currentSubject: any;
  showSnackbar: any;
}

const Deck: React.FC<DeckProps> = ({ user, currentSubject, showSnackbar }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayDeck = async () => {
    if (selectedEmotion && selectedDirection && currentSubject) {
      setIsLoading(true);
      try {
        await ApiService.sendMove(
          user.roomHash,
          currentSubject.id,
          user.organizerName || user.playerName,
          selectedDirection,
          selectedEmotion
        );
        showSnackbar("Move sent successfully.");
        setSelectedEmotion(null);
        setSelectedDirection(null);
        setIsExpanded(false);
      } catch (err) {
        showSnackbar("Failed to send move.", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showSnackbar("Please select both an emotion and a direction.", "error");
    }
  };

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

  const emotions: Array<"happy" | "neutral" | "sad"> = [
    "happy",
    "neutral",
    "sad",
  ];
  const emotionDescriptions: Record<"happy" | "neutral" | "sad", string> = {
    happy: "I currently feel good about this topic",
    neutral:
      "Nowadays I don't have a clear opinion on this topic, I don't feel either happy or sad",
    sad: "This topic is currently a problem for me and we need to do something about it",
  };

  const directions: Array<"up" | "neutral" | "down"> = [
    "up",
    "neutral",
    "down",
  ];
  const futureVisionDescriptions: Record<"up" | "neutral" | "down", string> = {
    up: "I see the team's future as very promising, moving in the right direction.",
    neutral:
      "I don't have a clear vision of the team's future, it could go either way.",
    down: "I believe the team's future is looking bleak, and changes are needed.",
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
            md: "40%",
            xl: "30%",
          },
          textAlign: "center",
          zIndex: isExpanded ? "2000 !important" : "1 !important",
          position: "relative !important",
          transition: "bottom 0.3s",
        }}
      >
        <Button
          variant="contained"
          onClick={handleToggleExpand}
          sx={{
            width: "100%",
            borderRadius: "20px 20px 0 0",
          }}
        >
          Deck
        </Button>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
              position: "relative",
              zIndex: 2100,
            }}
          >
            <Typography mb={2}>Your current feeling</Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              {emotions.map((emotion) => (
                <Tooltip
                  key={emotion}
                  title={emotionDescriptions[emotion]}
                  placement="top"
                >
                  <Box
                    onClick={() => setSelectedEmotion(emotion)}
                    sx={{
                      cursor: "pointer",
                      width: {
                        xs: "4em",
                        xl: "5em",
                      },
                      height: {
                        xs: "6em",
                        xl: "8em",
                      },
                      margin: {
                        xs: "5px",
                        xl: "auto",
                      },
                      border: "1px solid",
                      borderColor: "#a18c8c",
                      borderRadius: "8px",
                      transition: "transform 0.3s, border-color 0.3s",
                      position: "relative",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                      transform:
                        selectedEmotion === emotion ? "scale(1.1)" : "",
                      boxShadow:
                        selectedEmotion === emotion
                          ? "0px 0px 10px rgb(24 118 210 / 95%)"
                          : "none",
                      ...(selectedEmotion === emotion && {
                        animation: "borderAnimation 2s linear infinite",
                      }),
                    }}
                  >
                    {" "}
                    <img
                      src={moodIcon[emotion]}
                      alt={emotion}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Typography mb={3}>Your future perspective</Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              {directions.map((direction) => (
                <Tooltip
                  key={direction}
                  title={futureVisionDescriptions[direction]}
                  placement="top"
                >
                  <Box
                    onClick={() => setSelectedDirection(direction)}
                    sx={{
                      cursor: "pointer",
                      width: {
                        xs: "4em",
                        xl: "5em",
                      },
                      height: {
                        xs: "6em",
                        xl: "8em",
                      },
                      margin: {
                        xs: "5px",
                        xl: "auto",
                      },
                      border: "1px solid",
                      borderColor: "#a18c8c",
                      borderRadius: "8px",
                      transition: "transform 0.3s, border-color 0.3s",
                      position: "relative",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                      transform:
                        selectedDirection === direction ? "scale(1.1)" : "",
                      boxShadow:
                        selectedDirection === direction
                          ? "0px 0px 10px rgb(24 118 210 / 95%)"
                          : "none",

                      ...(selectedDirection === direction && {
                        animation: "borderAnimation 2s ease-in-out infinite",
                      }),
                    }}
                  >
                    {" "}
                    <img
                      src={futureIcon[direction]}
                      alt={direction}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Button
              disabled={
                !currentSubject ||
                currentSubject?.closed ||
                !selectedDirection ||
                !selectedEmotion
              }
              variant="contained"
              color="primary"
              onClick={handlePlayDeck}
              sx={{ width: "100%" }}
            >
              {!currentSubject || currentSubject?.closed
                ? "Wait until the round is open to play"
                : "Play"}
            </Button>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default Deck;
