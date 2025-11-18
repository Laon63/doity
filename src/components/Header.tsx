import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Header() {
  const { session, logout } = useAuthStore();

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink
            to="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            DoitY
          </RouterLink>
        </Typography>

        {session && (
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Today
            </Button>
            <Button color="inherit" component={RouterLink} to="/calendar">
              Calendar
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
