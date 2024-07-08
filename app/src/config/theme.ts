import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  typography: {
    fontSize: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const getCustomTheme = (theme: any) =>
  createTheme({
    ...{
      ...theme,
      typography: {
        ...theme.typography,
        fontSize: 12,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@font-face': {
            fontFamily: theme.typography.fontFamily,
          },
        },
      },
    },
  });

export function getTheme(theme: any) {
  return theme.typography
    ? createTheme(defaultTheme, getCustomTheme(theme))
    : defaultTheme;
}
