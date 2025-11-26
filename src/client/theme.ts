import { createTheme } from '@mui/material/styles';
import { COLOR_PALETTES } from 'client/store/themeStore'; // Import COLOR_PALETTES

// Function to get light, dark, and text colors based on the main color
const getDerivedColors = (mainColor: string) => {
  // Find the matching palette entry
  const paletteEntry = Object.entries(COLOR_PALETTES).find(([, color]) => color === mainColor);

  if (paletteEntry) {
    const [name] = paletteEntry;
    // Assuming COLOR_PALETTES has a structure that allows deriving light, dark, and text
    // For now, I'll hardcode some values based on the existing theme structure
    // This part might need more sophisticated color manipulation if the palette is more complex
    switch (name) {
      case 'emerald': // Assuming '#8FE3CD' is 'emerald'
        return {
          light: '#B2F0E0',
          dark: '#6ACDAF',
          text: '#4A8C7B',
        };
      case 'mint': // Placeholder for mint
        return {
          light: '#C8F7DC',
          dark: '#7AD9B2',
          text: '#3D8C6A',
        };
      case 'lavender': // Placeholder for lavender
        return {
          light: '#E0C8F7',
          dark: '#B27AD9',
          text: '#6A3D8C',
        };
      case 'coral': // Placeholder for coral
        return {
          light: '#F7D0C8',
          dark: '#D97A7A',
          text: '#8C3D3D',
        };
      default:
        return {
          light: mainColor, // Fallback
          dark: mainColor, // Fallback
          text: '#1E293B', // Fallback
        };
    }
  }

  // Default fallback if color not found in palette
  return {
    light: mainColor,
    dark: mainColor,
    text: '#1E293B',
  };
};

const getTheme = (primaryColor: string) => {
  const derivedColors = getDerivedColors(primaryColor);

  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: derivedColors.light,
        dark: derivedColors.dark,
        text: derivedColors.text,
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
