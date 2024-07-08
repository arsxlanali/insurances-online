const mandantTheme: { [key: string]: Theme } = {
  levelnine: {
    palette: {
      mode: 'light',
      primary: {
        main: '#1bac66',
        dark: '#1bac66',
        contrastText: '#fff',
      },
      secondary: {
        main: '#383637',
        dark: 'rgba(0,0,0,0.87)',
      },
      text: {
        primary: 'rgba(0,0,0,0.87)',
        dark: 'rgba(0,0,0,0.87)',
      },
    },
    typography: {
      fontFamily: 'Open Sans',
    },
  },
  hallesche: {
    palette: {
      mode: 'light',
      primary: {
        main: '#be0d3e',
        dark: '#be0d3e',
        contrastText: '#fff',
      },
      secondary: {
        main: '#004767',
        dark: 'rgba(0,0,0,0.87)',
      },
      text: {
        primary: 'rgba(0,0,0,0.87)',
        dark: 'rgba(0,0,0,0.87)',
      },
      customInfoIconColor: {
        main: 'white',
        text: '#004767',
        textPersonHeader: '#be0d3e',
      },
    },
    typography: {
      fontFamily: 'Ubuntu',
    },
  },
  sdk: {
    palette: {
      mode: 'light',
      primary: {
        main: '#00797F',
        dark: '#00797F',
        contrastText: '#fff',
      },
      secondary: {
        main: '#531F75',
        dark: '#531F75',
      },
      text: {
        primary: '#1A1A1A',
        dark: '#FFFFFF',
      },
    },
    typography: {
      fontFamily: 'Helvetica Neue',
    },
  },
  vmk: {
    palette: {
      mode: 'light',
      primary: {
        main: '#024589',
        dark: '#024589',
        contrastText: '#fff',
      },
      secondary: {
        main: '#9db81d',
        dark: '#9db81d',
      },
      text: {
        primary: 'rgba(0,0,0,0.87)',
        dark: 'rgba(0,0,0,0.87)',
      },
    },
    typography: {
      fontFamily: 'Ubuntu',
    },
  },
};

export default mandantTheme;
