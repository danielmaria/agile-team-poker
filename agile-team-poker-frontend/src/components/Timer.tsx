import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface TimerProps {
  timerStart: number | undefined;
}

const Timer: React.FC<TimerProps> = ({ timerStart }) => {
  // State to store the elapsed time in milliseconds
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout; // Variable to store the interval ID

    if (timerStart !== undefined) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - timerStart);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStart]); // Depend on timerStart to restart the effect when it changes

  // Function to format the elapsed time into hours, minutes, and seconds
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <Box textAlign="center" pt={7}>
      <Typography variant="subtitle2" color="primary">
        {formatTime(elapsedTime)}
      </Typography>
    </Box>
  );
};

export default Timer;
