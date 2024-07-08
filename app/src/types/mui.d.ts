import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customInfoIconColor: {
      main: string;
    };
  }

  interface PaletteOptions {
    customInfoIconColor?: {
      main: string;
    };
  }
}
