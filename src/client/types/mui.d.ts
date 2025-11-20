import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    pastelCoral: Palette['primary'];
    border: Palette['primary'];
  }

  interface PaletteOptions {
    pastelCoral?: PaletteOptions['primary'];
    border?: PaletteOptions['primary'];
  }

  interface PaletteColor {
    text?: string;
  }

  interface SimplePaletteColorOptions {
    text?: string;
  }
}
