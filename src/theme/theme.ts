import { createTheme } from '@mui/material';
import { viVN as pickersViVN } from '@mui/x-date-pickers/locales';
import { viVN as gridViVN } from '@mui/x-data-grid/locales';

export const theme = createTheme(
  {
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: 14,
    },
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            fontSize: '1rem',
          },
        },
      },
    },
  },
  pickersViVN,
  gridViVN
);
