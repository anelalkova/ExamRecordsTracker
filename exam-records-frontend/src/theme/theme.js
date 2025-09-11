import { createTheme } from '@mui/material/styles';

export const modernTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8fa7f7',
      dark: '#3f4d9d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#a378d4',
      dark: '#4a2a6c',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f56565',
      light: '#feb2b2',
      dark: '#c53030',
    },
    warning: {
      main: '#ed8936',
      light: '#fbb86f',
      dark: '#c05621',
    },
    info: {
      main: '#4299e1',
      light: '#90cdf4',
      dark: '#2b6cb0',
    },
    success: {
      main: '#48bb78',
      light: '#9ae6b4',
      dark: '#2f855a',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#2d3748',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: '#2d3748',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#2d3748',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#2d3748',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#2d3748',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
      color: '#2d3748',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#4a5568',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#718096',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#f7fafc',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#667eea',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#667eea',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

