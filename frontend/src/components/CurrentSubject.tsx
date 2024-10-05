import React from "react";
import { Typography, Box } from "@mui/material";
import { Subject } from "./Dashboard";
import SubjectInfoButton from "./SubjectInfoButton";

interface CurrentSubjectProps {
  subject?: Subject;
}

const CurrentSubject: React.FC<CurrentSubjectProps> = ({ subject }) => {
  return (
    <Box textAlign="center" px={2} pb={7}>
      <Typography
        variant="subtitle1"
        color={!subject || subject?.closed ? "error" : "primary"}
      >
        {!subject || subject?.closed ? "Round Closed" : "Round Open"}
      </Typography>

      <Typography variant="h5" display="inline">
        {subject ? subject.name : "No active subject"}

        {subject && <SubjectInfoButton subjectId={subject.id} />}
      </Typography>
    </Box>
  );
};

export default CurrentSubject;
