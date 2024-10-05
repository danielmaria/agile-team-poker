import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Popover,
  Button,
} from "@mui/material";
import { useState } from "react";
import { getAvatarImage } from "../helpers/avatarHelper";

interface PlayerInfoProps {
  user: any;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  user,
  setIsAuthenticated,
}) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="User Avatar" src={getAvatarImage(user.avatar)} />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorElUser)}
        anchorEl={anchorElUser}
        onClose={handleCloseUserMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: { width: 200 },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <Avatar
            alt={user.name}
            src={getAvatarImage(user.avatar)}
            sx={{ width: 56, height: 56 }}
          />
          <Typography variant="subtitle1" mt={2}>
            {user.isOrganizer ? "Organizer" : "Player"}
          </Typography>
          <Typography variant="body2">
            Name: {user.organizerName || user.playerName}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default PlayerInfo;
