import CoffeeIcon from "@mui/icons-material/Coffee";
import InfoIcon from "@mui/icons-material/Info";
import PrintIcon from "@mui/icons-material/Print";
import ReportGenerator from "./ReportGenerator";
import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useTheme,
} from "@mui/material";
import { EventData } from "./PlayerEvents";
import step1Image from "../assets/help/step1.png";
import step2Image from "../assets/help/step2.png";
import step3Image from "../assets/help/step3.png";
import step4Image from "../assets/help/step4.png";
import step6Image from "../assets/help/step6.png";

const actions = [
  { icon: <CoffeeIcon />, name: "Buy me a coffee", key: "coffee" },
  { icon: <PrintIcon />, name: "Print report", key: "report" },
  { icon: <InfoIcon />, name: "Info", key: "info" },
];

interface MoreSpeedDialProps {
  user?: any;
  subjects?: any;
  roomHash?: any;
  events?: EventData[];
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MoreSpeedDial: React.FC<MoreSpeedDialProps> = ({
  user,
  subjects,
  roomHash,
  events,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openCoffee, setOpenCoffee] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [infoPage, setInfoPage] = useState(0);
  const [reportData, setReportData] = useState<JSX.Element | null>(null);

  const handleOpenSpeedDial = () => setOpenSpeedDial(true);
  const handleCloseSpeedDial = () => setOpenSpeedDial(false);

  const handleActionClick = (key: string) => {
    handleCloseSpeedDial();

    if (key === "report") {
      setReportData(
        <ReportGenerator
          roomHash={user.user.roomHash}
          subjects={subjects}
          events={events}
          onClose={() => setReportData(null)}
        />
      );
    } else if (key === "coffee") {
      setOpenCoffee(true);
    } else if (key === "info") {
      setOpenInfo(true);
      setInfoPage(0);
    }
  };

  const handleCloseCoffee = () => setOpenCoffee(false);
  const handleCloseInfo = () => {
    setOpenInfo(false);
    setInfoPage(0);
  };

  const theme = useTheme();
  const isMobile = windowWidth < 900;

  const infoPages = [
    {
      title: "Step 1: Creating a Room",
      text: [
        "If you want to create a room, you must start as 'Organizer', so click Create Room.",
        "Set a password for the room, as you'll need it if you leave and want to rejoin later.",
        "Once the room is created, you will be redirected to it. Clicking the share icon will copy the room link containing a unique room hash. Share this link with players so they can join.",
      ],
      image: step1Image,
    },
    {
      title: "Step 2: Joining a Room",
      text: [
        "Players can join the room using the link provided by the organizer.",
        "Enter your name when prompted. Make sure to remember it, as you’ll need the same name to rejoin if you leave the room.",
        "No password is required for players.",
      ],
      image: step2Image,
    },
    {
      title: "Step 3: Playing the Game",
      text: [
        "The Organizer will start the game by opening a session for a subject.",
        "Each round contains a topic. The organizer will ask for a topic for the cards to be played by the players.",
        "The play consists of two cards. One containing the current mood, that is, how the player thinks that topic is being addressed currently, in this past sprint, and another representing the vision that the player has for the future. How he thinks that topic is being addressed in the long term.",
        "After selecting one card from each, the player then clicks 'play'.",
        "Once the Organizer closes the session, all players' cards will be revealed to everyone.",
        "A discussion should then be started, just like in planning poker, to discuss the low and high points and try to understand what the real situation is regarding that subject.",
        "If necessary, the organizer can open the question again for a second round with the same topic.",
      ],
      image: step3Image,
    },
    {
      title: "Step 4: Reopening a Session",
      text: [
        "The Organizer can reopen the same question as many times as needed.",
        "Players will submit new cards for the reopened session, if they want, following the same process as before.",
        "Only the last move of each player will be taken into account.",
      ],
      image: step4Image,
    },
    {
      title: "Step 5: Leaving and Rejoining the Room",
      text: [
        "Organizers: If you leave, you can rejoin the room by entering the room's password and using the same room link and player name.",
        "Players: If you leave, simply use the same name to rejoin the room.",
      ],
    },
    {
      title: "Step 6: End of Game",
      text: [
        "The game has a maximum of 20 topics to be discussed, but the session can end earlier.",
        "Any member of the room can generate a report to see the general situation of the team.",
        "Taking into account the averages, it is possible to verify which pontos should be given mais attention and which are good at the moment.",
        "Issues that players have a negative outlook on receive a warning icon in the report.",
      ],
      image: step6Image,
    },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Backdrop
          open={openSpeedDial}
          sx={{
            zIndex: (theme) => theme.zIndex.speedDial + 1,
          }}
        />
        <SpeedDial
          ariaLabel="SpeedDial tooltip"
          sx={{
            position: "absolute",
            top: {
              xs: 65,
              md: "auto",
            },
            left: {
              xs: 10,
              md: "auto",
            },
            bottom: {
              md: 50,
            },
            right: {
              md: 30,
            },
            zIndex: (theme) => theme.zIndex.appBar + 1, // Definindo o zIndex para aparecer acima de outros componentes
            "& .MuiSpeedDial-actions": {
              zIndex: 10,
            },
          }}
          icon={<SpeedDialIcon />}
          onClose={handleCloseSpeedDial}
          onOpen={handleOpenSpeedDial}
          open={openSpeedDial}
          direction={isMobile ? "down" : "up"}
        >
          {actions.map((action) => {
            if (
              action.key === "report" &&
              (!user || !events?.find((e) => e.type === "movement"))
            ) {
              return null;
            }

            return (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                sx={{
                  whiteSpace: "nowrap",
                  maxWidth: "none",
                  zIndex: 15,
                }}
                tooltipOpen
                onClick={() => handleActionClick(action.key)}
              />
            );
          })}
        </SpeedDial>
      </Box>

      <Dialog
        open={openCoffee}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseCoffee}
      >
        <DialogContent>
          <iframe
            id="kofiframe"
            src="https://ko-fi.com/danielmariadasilva/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{
              border: "none",
              width: "100%",
              padding: "4px",
              background: "#f9f9f9",
            }}
            height="580"
            title="danielmariadasilva"
          ></iframe>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCoffee}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInfo}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseInfo}
        PaperProps={{
          sx: {
            minWidth: { xs: "15em", sm: "50em" },
            width: { xs: "90%", sm: "50em" },
          },
        }}
      >
        <DialogTitle>{infoPages[infoPage].title}</DialogTitle>
        <DialogContent>
          {infoPages[infoPage].image && (
            <Box
              component="img"
              sx={{
                width: "50%",
                marginBottom: 2,
                marginInline: "auto",
                display: "block",
              }}
              alt={infoPages[infoPage].title}
              src={infoPages[infoPage].image}
            />
          )}
          <DialogContentText>
            {infoPages[infoPage].text.map((paragraph, index) => (
              <li key={index}>{paragraph}</li>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {infoPage > 0 && (
            <Button onClick={() => setInfoPage(infoPage - 1)}>Back</Button>
          )}
          {infoPage < infoPages.length - 1 && (
            <Button onClick={() => setInfoPage(infoPage + 1)}>Next</Button>
          )}
          <Button onClick={handleCloseInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      {reportData}
    </>
  );
};

export default MoreSpeedDial;
