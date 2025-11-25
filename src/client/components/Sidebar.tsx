import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { APP_NAME } from 'client/contants';
import Logo from 'client/components/Logo';
import useAuthStore from 'client/store/authStore';

const mainNavItems = [
  { text: 'Today', icon: <CheckCircleOutlineIcon />, to: '/today' },
  { text: 'Calendar', icon: <CalendarTodayIcon />, to: '/calendar' },
  { text: 'Memo', icon: <NotesIcon />, to: '/memo' },
];

const secondaryNavItems = [
  { text: 'Settings', icon: <SettingsIcon />, to: '/settings' },
];

function Sidebar() {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        onClick={handleLogoClick}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
          '&:hover': { opacity: 0.8 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logo size={24} bgColor="primary.main" clickable={false} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {APP_NAME}
          </Typography>
        </Box>
        <Box>
          {session ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Logout"
              sx={{ color: 'text.primary' }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleLogin();
              }}
              title="Login"
              sx={{ color: 'text.primary' }}
            >
              <LoginIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <List sx={{ flexGrow: 1, px: 1 }}>
        {mainNavItems.map((item) => (
          <ListItem key={item.text}>
            <ListItemButton component={NavLink} to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 1 }}>
        <List>
          {secondaryNavItems.map((item) => (
            <ListItem key={item.text}>
              <ListItemButton component={NavLink} to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar;
