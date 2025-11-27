import { createTheme } from '@mui/material/styles';
import { lightenColor, darkenColor, getContrastTextColor, getSidebarBackgroundColor } from 'client/utils/colors';

// Function to get comprehensive color palette based on the main color
const getDerivedColors = (mainColor: string) => {
  return {
    // Very light background (barely visible) - for Sidebar
    light: getSidebarBackgroundColor(mainColor),
    // Light hover (15% lighter) - for Tab, Category filter selection
    lighter: lightenColor(mainColor, 0.15),
    // Extra light (20% lighter) - for TaskItem hover
    lightest: lightenColor(mainColor, 0.20),
    // Border color (10% darker than main)
    border: darkenColor(mainColor, 0.10),
    // Dark color (30% darker)
    dark: darkenColor(mainColor, 0.3),
    // Contrast text color
    text: getContrastTextColor(mainColor),
  };
};

const getTheme = (primaryColor: string) => {
  const derivedColors = getDerivedColors(primaryColor);

  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: derivedColors.light,
        lighter: derivedColors.lighter as any,
        lightest: derivedColors.lightest as any,
        border: derivedColors.border as any,
        dark: derivedColors.dark,
        contrastText: derivedColors.text,
      },
      secondary: {
        main: '#64748B',
      },
      background: {
        default: '#F8FAFC',
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
          disableGutters: true,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
          contained: {
            color: derivedColors.text,
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
              color: derivedColors.text,
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
};

export default getTheme;
