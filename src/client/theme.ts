import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#8FE3CD', // Emerald pastel tone
      light: '#B2F0E0',
      dark: '#6ACDAF',
      text: '#4A8C7B', // Darker emerald for text
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
    MuiListItem: {
      styleOverrides: {
        root: () => ({
          borderRadius: '8px',
          padding: '2px 8px',
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: () => ({
          minWidth: '32px',
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '8px',
          padding: '8px',
          height: '44px',
          '&.active': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.text,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.text,
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
