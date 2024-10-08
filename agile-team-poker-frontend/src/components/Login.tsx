import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Avatar,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import MoreSpeedDial from "./MoreSpeedDial";
import { ApiService } from "../services/ApiService";
import { getAvatarImage } from "../helpers/avatarHelper";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const avatarOptions = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6",
  "avatar7",
  "avatar8",
];

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [roomHash, setRoomHash] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(true);
  const [isOrganizerLogin, setIsOrganizerLogin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [alignment, setAlignment] = React.useState("create-room");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get("roomHash");
    if (hash) {
      setRoomHash(hash);
      setIsOrganizer(false);
      setAlignment("join-room");
    }
  }, []);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
    setIsOrganizer(!isOrganizer);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCreateRoom = async () => {
    if (!playerName || !password || !avatar) {
      showSnackbar("All fields are required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.createRoom(
        playerName,
        avatar,
        password
      );
      const roomHash = response.roomHash;
      localStorage.setItem(
        "user",
        JSON.stringify({
          playerName,
          avatar,
          roomHash,
          password,
          isOrganizer: true,
        })
      );
      setRoomHash(roomHash);
      setIsAuthenticated(true);
      showSnackbar("Room created successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to create room", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName || !roomHash || !avatar) {
      showSnackbar("Please fill in all fields and select an avatar", "error");
      return;
    }

    setIsLoading(true);
    try {
      await ApiService.joinRoom(roomHash, playerName, avatar, password);
      localStorage.setItem(
        "user",
        JSON.stringify({
          playerName,
          avatar,
          roomHash,
          password,
          isOrganizer: isOrganizerLogin,
        })
      );
      setIsAuthenticated(true);
      showSnackbar("Joined room successfully!", "success");
      const params = new URLSearchParams(window.location.search);
      params.delete("roomHash");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${params}`
      );
    } catch (error: any) {
      showSnackbar(error?.response?.message || "Failed to join room.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectAvatar = (avatarKey: string) => setAvatar(avatarKey);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box
          width={300}
          textAlign="center"
          p={3}
          border="1px solid #ccc"
          borderRadius={4}
        >
          <ToggleButtonGroup
            color="primary"
            sx={{ mb: 4 }}
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="create-room">Create room</ToggleButton>
            <ToggleButton value="join-room">Join a room</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="h5" mb={2}>
            Game Login
          </Typography>
          {isOrganizer ? (
            <>
              <TextField
                label="Player name"
                required
                fullWidth
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                margin="normal"
              />
              <TextField
                required
                label="Room password"
                helperText="Temporary password"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
              <Typography>Select Avatar</Typography>
              <Grid container spacing={2} justifyContent="center">
                {avatarOptions.map((avatarKey, index) => (
                  <Grid item key={index}>
                    <Avatar
                      src={getAvatarImage(avatarKey)}
                      onClick={() => selectAvatar(avatarKey)}
                      sx={{
                        width: 56,
                        height: 56,
                        border: avatar === avatarKey ? "2px solid blue" : "",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateRoom}
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Create Room"}
              </Button>
            </>
          ) : (
            <>
              <TextField
                required
                label="Player name"
                fullWidth
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                margin="normal"
              />
              <TextField
                required
                label="Room Hash"
                fullWidth
                value={roomHash}
                onChange={(e) => setRoomHash(e.target.value)}
                margin="normal"
              />
              {isOrganizerLogin && (
                <TextField
                  required
                  label="Room password"
                  type="password"
                  helperText="Password used to create the room"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                />
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={isOrganizerLogin}
                    onChange={(e) => setIsOrganizerLogin(e.target.checked)}
                  />
                }
                label="I'm the room organizer"
              />

              <Typography>Select Avatar</Typography>
              <Grid container spacing={2} justifyContent="center">
                {avatarOptions.map((avatarKey, index) => (
                  <Grid item key={index}>
                    <Avatar
                      src={getAvatarImage(avatarKey)}
                      onClick={() => selectAvatar(avatarKey)}
                      sx={{
                        width: 56,
                        height: 56,
                        border: avatar === avatarKey ? "2px solid blue" : "",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                fullWidth
                onClick={handleJoinRoom}
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Join Room"}
              </Button>
            </>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
      <MoreSpeedDial />
    </>
  );
};

export default Login;
