import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#8FE3CD', // Emerald pastel tone
      light: '#B2F0E0',
      dark: '#6ACDAF',
    },
    secondary: {
      main: '#64748B', // A neutral gray
    },
    background: {
      default: '#F8FAFC', // The main content background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        disableGutters: true, // 좌우여백 제거
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '8px',
          '&.active': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.contrastText,
            },
          },
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          padding: '0 12px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
