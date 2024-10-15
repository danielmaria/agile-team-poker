import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Box,
  DialogActions,
  Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import subject1 from "../assets/subjects/1-organization.jpg";
import subject2 from "../assets/subjects/2-good-delivers.jpg";
import subject3 from "../assets/subjects/3-good-quality.jpg";
import subject4 from "../assets/subjects/4-great-collaboration.png";
import subject5 from "../assets/subjects/5-adaptability.png";
import subject6 from "../assets/subjects/6-clear-activities.png";
import subject7 from "../assets/subjects/7-roles.png";
import subject8 from "../assets/subjects/8-simplicity.png";
import subject9 from "../assets/subjects/9-knowledge-exchange.png";
import subject10 from "../assets/subjects/10-modern-development.png";
import subject11 from "../assets/subjects/11-communication.png";
import subject12 from "../assets/subjects/12-continuously-improvin.png";
import subject13 from "../assets/subjects/13-self-organization.png";
import subject14 from "../assets/subjects/14-good-synergy.png";
import subject15 from "../assets/subjects/15-good-env.png";
import subject16 from "../assets/subjects/16-training.png";
import subject17 from "../assets/subjects/17-safe-environment.png";
import subject18 from "../assets/subjects/18-technical-skills.png";
import subject19 from "../assets/subjects/19-business-domain.png";
import subject20 from "../assets/subjects/20-multidisciplinary-skills.png";

interface Subject {
  name: string;
  description: string;
  imageUrl: string;
  area: string;
}

interface SubjectInfoButtonProps {
  subjectId: number;
}

const SubjectInfoButton: React.FC<SubjectInfoButtonProps> = ({ subjectId }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const subjects: Record<number, Subject> = {
    1: {
      name: "The team's delivery planning is organized at an ideal frequency.",
      description:
        "The team has established a good frequency for their planning meetings, ensuring a balance between preparation and adaptability. This helps maintain a steady delivery pace while minimizing last-minute changes.",
      imageUrl: subject1,
      area: "Planning",
    },
    2: {
      name: "The work done by the team delivers high business value.",
      description:
        "The team prioritized work aligned with business goals, leading to a feature release that increased customer engagement and revenue, ensuring their efforts are always focused on value.",
      imageUrl: subject2,
      area: "Business",
    },
    3: {
      name: "There is high quality in both the deliveries and the solutions developed by the team.",
      description:
        "The team follows strict quality assurance processes, including code reviews and automated testing, delivering stable solutions that meet customer needs without introducing bugs.",
      imageUrl: subject3,
      area: "Quality",
    },
    4: {
      name: "There is great collaboration and communication between the team and the customer, and vice versa.",
      description:
        "The team maintains open lines of communication with the customer, which ensures that expectations are clear and any misunderstandings are addressed promptly.",
      imageUrl: subject4,
      area: "Collaboration",
    },
    5: {
      name: "The team can respond to changes whenever necessary, adapting quickly.",
      description:
        "The team is flexible and adapts quickly to changing priorities, adjusting their focus to deliver high-value items without causing disruption.",
      imageUrl: subject5,
      area: "Adaptability",
    },
    6: {
      name: "The team's activities are clear.",
      description:
        "The team keeps their tasks visible and well-organized, using tools like Kanban boards to provide transparency on progress for all stakeholders.",
      imageUrl: subject6,
      area: "Transparency",
    },
    7: {
      name: "The roles of team members are well defined.",
      description:
        "Clear role definitions ensure that each team member knows their responsibilities, reducing overlap and fostering effective collaboration.",
      imageUrl: subject7,
      area: "Roles",
    },
    8: {
      name: "The team seeks simplicity in solutions.",
      description:
        "The team values simplicity in their approach to problem-solving, focusing on creating maintainable and effective solutions without unnecessary complexity.",
      imageUrl: subject8,
      area: "Simplicity",
    },
    9: {
      name: "There is learning and knowledge exchange within the team.",
      description:
        "The team actively engages in knowledge-sharing, fostering continuous learning and improvement through discussions, workshops, and peer reviews.",
      imageUrl: subject9,
      area: "Learning",
    },
    10: {
      name: "The team has adequate tools and infrastructure.",
      description:
        "The team uses modern and effective tools to support their workflow, ensuring efficient processes and minimizing manual overhead.",
      imageUrl: subject10,
      area: "Infrastructure",
    },
    11: {
      name: "There is excellent communication between team members.",
      description:
        "Frequent and open communication between team members ensures alignment and quick resolution of issues, contributing to smooth collaboration.",
      imageUrl: subject11,
      area: "Collaboration",
    },
    12: {
      name: "The work process is continuously improving.",
      description:
        "The team regularly reflects on their processes and makes improvements to enhance efficiency, reduce waste, and optimize workflows.",
      imageUrl: subject12,
      area: "Process Improvement",
    },
    13: {
      name: "The team has good self-organization.",
      description:
        "The team is self-organizing, managing their tasks autonomously to stay aligned with goals and timelines, demonstrating responsibility and initiative.",
      imageUrl: subject13,
      area: "Autonomy",
    },
    14: {
      name: "There is good synergy between team members.",
      description:
        "The team members collaborate effectively, leveraging each other's strengths to overcome challenges and deliver high-quality work.",
      imageUrl: subject14,
      area: "Collaboration",
    },
    15: {
      name: "The team has a sustainable work pace.",
      description:
        "The team monitors their workload and adjusts it to maintain a sustainable pace, ensuring consistent productivity without risking burnout.",
      imageUrl: subject15,
      area: "Well-being",
    },
    16: {
      name: "The team has management support.",
      description:
        "The team receives strong support from management, with resources and decisions that enable them to work effectively and meet their goals.",
      imageUrl: subject16,
      area: "Support",
    },
    17: {
      name: "The team has a safe environment to discuss ideas and make improvements.",
      description:
        "The team fosters an environment of trust, where members feel comfortable sharing feedback and suggestions to drive continuous improvement.",
      imageUrl: subject17,
      area: "Team Culture",
    },
    18: {
      name: "The team has sufficient technical knowledge to do the required work.",
      description:
        "The team's technical expertise allows them to address complex challenges and implement scalable, high-quality solutions.",
      imageUrl: subject18,
      area: "Skills",
    },
    19: {
      name: "The team has sufficient business knowledge to do the required work.",
      description:
        "The team's understanding of the business domain enables them to contribute meaningfully to business objectives, aligning their work with key goals.",
      imageUrl: subject19,
      area: "Business",
    },
    20: {
      name: "Team members seek multidisciplinary skills, with each specialist learning about related areas.",
      description:
        "The team encourages cross-disciplinary learning, allowing members to develop skills beyond their core expertise, enhancing collaboration and reducing dependencies.",
      imageUrl: subject20,
      area: "Skills",
    },
  };

  const subject = subjects[subjectId];

  return (
    <>
      <IconButton aria-label="info" onClick={handleClickOpen} size="small">
        <InfoIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          {subject.imageUrl && (
            <Box textAlign="center" mb={2}>
              <img
                src={subject.imageUrl}
                alt={`${subject.name}. Credit: freepik.com`}
                style={{ maxWidth: "20vw", height: "auto" }}
              />
              <Typography variant="subtitle1">{subject.area}</Typography>
            </Box>
          )}
          <Typography align="justify" component="div">
            <p>{subject.description}</p>
          </Typography>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectInfoButton;
