import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { APP_NAME } from 'client/contants';
import Logo from 'client/components/Logo';

const mainNavItems = [
  { text: 'Today', icon: <CheckCircleOutlineIcon />, to: '/today' },
  { text: 'Calendar', icon: <CalendarTodayIcon />, to: '/calendar' },
  { text: 'Memo', icon: <NotesIcon />, to: '/memo' },
];

const secondaryNavItems = [
  { text: 'Settings', icon: <SettingsIcon />, to: '/settings' },
  { text: 'Sign out', icon: <ExitToAppIcon />, to: '/logout' },
];

function Sidebar() {
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
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Logo size={24} bgColor="primary.main" />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {APP_NAME}
        </Typography>
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
