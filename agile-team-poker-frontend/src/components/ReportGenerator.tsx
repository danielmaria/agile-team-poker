import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Collapse,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
  Button,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import happyIcon from "../assets/cards/emotion-happy.png";
import neutralIcon from "../assets/cards/emotion-neutral.png";
import sadIcon from "../assets/cards/emotion-sad.png";
import upIcon from "../assets/cards/up.png";
import downIcon from "../assets/cards/down.png";
import neutralFutureIcon from "../assets/cards/neutral.png";
import redIcon from "../assets/results/red.png";
import yellowIcon from "../assets/results/yellow.png";
import greenIcon from "../assets/results/green.png";

interface Move {
  future: "up" | "down" | "neutral";
  mood: "happy" | "sad" | "neutral";
}

interface SubjectData {
  name: string;
  moves: Record<string, Move>;
}

interface ReportGeneratorProps {
  roomHash: string;
  subjects?: any;
  events?: any;
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  roomHash,
  subjects,
  events,
  onClose,
}) => {
  const [subjectData, setSubjectData] = useState<Record<string, SubjectData>>(
    {}
  );
  const [expandedSubject, setExpandedSubject] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const processRoundsData = (data: any[]): Record<string, SubjectData> => {
      const subjectsData: Record<string, SubjectData> = {};

      data?.forEach((item) => {
        if (item.type === "round-started" || item.type === "round-closed") {
          const { subjectId, moves } = item.round;
          const subjectName =
            subjects?.subjects.find(
              (sub: any) => sub.id === parseInt(subjectId)
            )?.name || `Subject ${subjectId}`;

          if (!subjectsData[subjectId]) {
            subjectsData[subjectId] = { name: subjectName, moves: {} };
          }

          moves.forEach((move: any) => {
            if (move && move.playerName && move.future && move.mood) {
              subjectsData[subjectId].moves[move.playerName] = {
                future: move.future,
                mood: move.mood,
              };
            }
          });
        }
      });

      Object.keys(subjectsData).forEach((key) => {
        if (Object.keys(subjectsData[key].moves).length === 0) {
          delete subjectsData[key];
        }
      });

      return subjectsData;
    };

    const fetchData = async () => {
      if (events) {
        const processedData = processRoundsData(events);
        setSubjectData(processedData);
      }
    };

    fetchData();
  }, [roomHash, events, subjects]);

  const toggleSubject = (subjectId: number) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const calculateMovePercentages = (moves: Record<string, Move>) => {
    const totalMoves = Object.keys(moves).length;
    const moodCounts: Record<string, number> = { happy: 0, neutral: 0, sad: 0 };
    const futureCounts: Record<string, number> = { up: 0, down: 0, neutral: 0 };

    Object.values(moves).forEach((move) => {
      moodCounts[move.mood] += 1;
      futureCounts[move.future] += 1;
    });

    return {
      moodPercentages: {
        happy: (moodCounts.happy / totalMoves) * 100 || 0,
        neutral: (moodCounts.neutral / totalMoves) * 100 || 0,
        sad: (moodCounts.sad / totalMoves) * 100 || 0,
      },
      futurePercentages: {
        up: (futureCounts.up / totalMoves) * 100 || 0,
        down: (futureCounts.down / totalMoves) * 100 || 0,
        neutral: (futureCounts.neutral / totalMoves) * 100 || 0,
      },
      highestMood: Object.keys(moodCounts).reduce((a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b
      ),
      highestFuture: Object.keys(futureCounts).reduce((a, b) =>
        futureCounts[a] > futureCounts[b] ? a : b
      ),
    };
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

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return greenIcon;
      case "neutral":
        return yellowIcon;
      case "sad":
        return redIcon;
      default:
        return "";
    }
  };

  const getRotation = (direction: string) => {
    switch (direction) {
      case "up":
        return "rotate(-45deg)";
      case "down":
        return "rotate(45deg)";
      case "neutral":
      default:
        return "rotate(0deg)";
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Game Report</DialogTitle>
      <DialogContent>
        {Object.entries(subjectData).map(([subjectId, subject]) => {
          const { highestMood, highestFuture } = calculateMovePercentages(
            subject.moves
          );
          return (
            <Box
              key={subjectId}
              mb={3}
              p={2}
              border={1}
              borderColor="grey.300"
              borderRadius={2}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="h6"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {(highestFuture === "down" ||
                    (highestFuture === "neutral" &&
                      highestFuture === "neutral")) && (
                    <Tooltip title="This issue may be a problem in future sprints.">
                      <span style={{ marginRight: 10, cursor: "help" }}>
                        ⚠️
                      </span>
                    </Tooltip>
                  )}
                  <img
                    src={getMoodIcon(highestMood)}
                    alt={highestMood}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: 10,
                      transform: getRotation(highestFuture),
                    }}
                  />
                  {subject.name}
                </Typography>
                <IconButton onClick={() => toggleSubject(Number(subjectId))}>
                  {expandedSubject === Number(subjectId) ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse
                in={expandedSubject === Number(subjectId)}
                timeout="auto"
                unmountOnExit
              >
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box flex={1} mr={3}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Mood</TableCell>
                          <TableCell>Future</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(subject.moves).map(
                          ([playerName, move]) => (
                            <TableRow key={playerName}>
                              <TableCell>{playerName}</TableCell>
                              <TableCell>
                                <img
                                  src={moodIcon[move.mood]}
                                  alt={move.mood}
                                  style={{ width: 20, height: 20 }}
                                />
                              </TableCell>
                              <TableCell>
                                <img
                                  src={futureIcon[move.future]}
                                  alt={move.future}
                                  style={{ width: 20, height: 20 }}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Box>

                  {!isMobile && (
                    <Box
                      flex={1}
                      ml={3}
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box flex={1} mr={2}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Mood Percentages</TableCell>
                              <TableCell>Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Happy</TableCell>
                              <TableCell>
                                {calculateMovePercentages(
                                  subject.moves
                                ).moodPercentages.happy.toFixed(0)}
                                %
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Neutral</TableCell>
                              <TableCell>
                                {calculateMovePercentages(
                                  subject.moves
                                ).moodPercentages.neutral.toFixed(0)}
                                %
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Sad</TableCell>
                              <TableCell>
                                {calculateMovePercentages(
                                  subject.moves
                                ).moodPercentages.sad.toFixed(0)}
                                %
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>

                      <Box flex={1} ml={2}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Future Percentages</TableCell>
                              <TableCell>Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Up</TableCell>
                              <TableCell>
                                {calculateMovePercentages(
                                  subject.moves
                                ).futurePercentages.up.toFixed(0)}
                                %
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Down</TableCell>
                              <TableCell>
                                {calculateMovePercentages(
                                  subject.moves
                                ).futurePercentages.down.toFixed(0)}
                                %
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Neutral</TableCell>
                              <TableCell>
                                {calculateMovePercentages(
                                  subject.moves
                                ).futurePercentages.neutral.toFixed(0)}
                                %
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Box>
          );
        })}

        <Button onClick={onClose} style={{ float: "right" }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ReportGenerator;
