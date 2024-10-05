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
            xl: "20%",
          },
          textAlign: "center",
          zIndex: 1,
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
              maxHeight: "33vh",
              overflowY: "auto",
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
                  <img
                    key={emotion}
                    src={moodIcon[emotion]}
                    alt={emotion}
                    onClick={() => setSelectedEmotion(emotion)}
                    style={{
                      cursor: "pointer",
                      width: "5em",
                      height: "auto",
                      boxShadow:
                        selectedEmotion === emotion
                          ? "0px -2px 10px rgba(0, 0, 0, 0.2)"
                          : "none",
                    }}
                  />
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
                  <img
                    key={direction}
                    src={futureIcon[direction]}
                    alt={direction}
                    onClick={() => setSelectedDirection(direction)}
                    style={{
                      cursor: "pointer",
                      width: "5em",
                      height: "auto",
                      boxShadow:
                        selectedDirection === direction
                          ? "0px -2px 10px rgba(0, 0, 0, 0.2)"
                          : "none",
                    }}
                  />
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
