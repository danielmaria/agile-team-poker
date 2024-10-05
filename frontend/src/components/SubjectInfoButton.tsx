import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  Box,
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
        "The team holds regular planning sessions to organize their deliveries. Recently, they adjusted the frequency of their planning meetings to bi-weekly, improving predictability and reducing rework caused by frequent scope changes.",
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
        "Open communication with the client helped avoid misunderstandings in feature requirements, allowing the team to quickly resolve issues and maintain progress.",
      imageUrl: subject4,
      area: "Collaboration",
    },
    5: {
      name: "The team can respond to changes whenever necessary, adapting quickly.",
      description:
        "When priorities changed, the team quickly adapted their backlog to focus on high-priority items, showing agility without disrupting workflow.",
      imageUrl: subject5,
      area: "Adaptability",
    },
    6: {
      name: "The team's activities are clear.",
      description:
        "All stakeholders can easily track progress using a well-maintained Kanban board, ensuring transparency throughout the project.",
      imageUrl: subject6,
      area: "Transparency",
    },
    7: {
      name: "The roles of team members are well defined.",
      description:
        "Clearly defined roles, such as developer, tester, and scrum master, ensure collaboration without overlaps, facilitating smooth workflows.",
      imageUrl: subject7,
      area: "Roles",
    },
    8: {
      name: "The team seeks simplicity in solutions.",
      description:
        "Instead of over-engineering, the team focuses on simple, maintainable solutions. Recently, they opted for a basic algorithm that fulfilled the project requirements, avoiding unnecessary complexity.",
      imageUrl: subject8,
      area: "Simplicity",
    },
    9: {
      name: "There is learning and knowledge exchange within the team.",
      description:
        "Regular knowledge-sharing sessions promote continuous learning. Recently, a developer introduced a new testing tool, which was adopted by the entire team.",
      imageUrl: subject9,
      area: "Learning",
    },
    10: {
      name: "The team has adequate tools and infrastructure.",
      description:
        "The team utilizes modern development tools to automate their CI/CD pipelines, speeding up deployments and minimizing downtime.",
      imageUrl: subject10,
      area: "Infrastructure",
    },
    11: {
      name: "There is excellent communication between team members.",
      description:
        "Daily stand-ups and asynchronous communication ensure team alignment. This open communication resolved a critical blocker that had been delaying progress.",
      imageUrl: subject11,
      area: "Collaboration",
    },
    12: {
      name: "The work process is continuously improving.",
      description:
        "Through regular retrospectives, the team identified bottlenecks in their testing phase and invested in automation, speeding up deliveries.",
      imageUrl: subject12,
      area: "Process Improvement",
    },
    13: {
      name: "The team has good self-organization.",
      description:
        "The team manages tasks autonomously, recently reorganizing their workflow to align better with the product roadmap.",
      imageUrl: subject13,
      area: "Autonomy",
    },
    14: {
      name: "There is good synergy between team members.",
      description:
        "Strong collaboration was evident when a developer and tester worked closely to resolve a critical issue during a sprint, highlighting the team's synergy.",
      imageUrl: subject14,
      area: "Collaboration",
    },
    15: {
      name: "The team has a sustainable work pace.",
      description:
        "After noticing signs of burnout, the team adjusted their workload, maintaining a sustainable pace to ensure long-term team health.",
      imageUrl: subject15,
      area: "Well-being",
    },
    16: {
      name: "The team has management support.",
      description:
        "Management provides the team with necessary resources. When the team requested additional training, it was approved quickly.",
      imageUrl: subject16,
      area: "Support",
    },
    17: {
      name: "The team has a safe environment to discuss ideas and make improvements.",
      description:
        "Open discussions in retrospectives help the team feel comfortable sharing suggestions. Recently, they improved their code review process based on feedback.",
      imageUrl: subject17,
      area: "Team Culture",
    },
    18: {
      name: "The team has sufficient technical knowledge to do the required work.",
      description:
        "The team's technical skills allowed them to solve complex architectural challenges, ensuring scalable solutions.",
      imageUrl: subject18,
      area: "Skills",
    },
    19: {
      name: "The team has sufficient business knowledge to do the required work.",
      description:
        "Their understanding of the business domain helped the team suggest a feature that added significant value to customers.",
      imageUrl: subject19,
      area: "Business",
    },
    20: {
      name: "Team members seek multidisciplinary skills, with each specialist learning about related areas.",
      description:
        "Cross-functional training helped developers learn testing practices, improving agility and reducing dependencies within the team.",
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectInfoButton;
