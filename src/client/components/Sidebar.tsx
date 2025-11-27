import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotesIcon from '@mui/icons-material/Notes';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { APP_NAME } from 'client/contants';
import Logo from 'client/components/Logo';
import useAuthStore from 'client/store/authStore';
import { useProfileQuery } from 'client/hooks/queries/useProfileQuery';

const mainNavItems = [
  { text: 'Today', icon: <CheckCircleOutlineIcon />, to: '/today' },
  { text: 'Calendar', icon: <CalendarTodayIcon />, to: '/calendar' },
  { text: 'Memo', icon: <NotesIcon />, to: '/memo' },
];

const secondaryNavItems = [
  { text: 'Settings', icon: <SettingsIcon />, to: '/settings' },
];

const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 80;

function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: profile } = useProfileQuery(session?.user?.id);
  const displayName = profile?.display_name || '';

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    setAnchorEl(null);
    navigate('/login');
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const sidebarWidth = collapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH_EXPANDED;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        bgcolor: 'primary.light',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflowY: 'auto',
      }}
    >
      {/* Header - Logo & Collapse Button */}
      <Box
        onClick={handleLogoClick}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': { opacity: 0.8 },
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
              flex: 1,
            }}
          >
            <Logo size={24} bgColor="primary.main" clickable={false} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'text.primary',
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>
        )}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            sx={{ color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, px: collapsed ? 1 : 1, color: 'text.primary' }}>
        {mainNavItems.map((item) => (
          <Tooltip
            key={item.text}
            title={collapsed ? item.text : ''}
            placement="right"
          >
            <ListItem disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 44,
                  px: 1,
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '&.active': {
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 'auto' : '32px',
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Settings & Profile Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', px: 1, pb: 0.5 }}>
        {/* Settings Menu */}
        <List sx={{ color: 'text.primary' }}>
          {secondaryNavItems.map((item) => (
            <Tooltip
              key={item.text}
              title={collapsed ? item.text : ''}
              placement="right"
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  sx={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    minHeight: 44,
                    px: 1,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '&.active': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : '32px',
                      justifyContent: 'center',
                      color: 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>

        {/* Divider with elevation */}
        <Divider
          sx={{
            my: 0.5,
          }}
        />

        {/* Profile Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: 1,
            mt: 0.5,
          }}
        >
          <Tooltip
            title={collapsed ? displayName || 'Profile' : ''}
            placement="right"
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                color: theme.palette.primary.contrastText,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={handleProfileMenuOpen}
              onMouseEnter={handleProfileMenuOpen}
            >
              {displayName
                ? displayName.charAt(0).toUpperCase()
                : session?.user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>

          {!collapsed && (
            <Tooltip title="Logout">
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{ color: 'primary.contrastText' }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Profile Dropdown Menu (for collapsed state) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onMouseLeave={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem
          disabled
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          <Typography variant="body2">{`${displayName}`}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {`(${session?.user?.email || ''})`}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Sidebar;
