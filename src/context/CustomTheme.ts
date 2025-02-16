import {createTheme} from '@mui/material/styles';
import {nlNL} from "@mui/material/locale";
import {amber} from "@mui/material/colors";

// Also modify .ais-RefinementList-item--selected in
// @lior/components/handbook/SidebarLeft/SidebarHandbook.css

export const createCustomTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#C84664' : amber[300], // Main color for light and dark mode
      },
      background: {
        default: mode === 'light' ? '#FFFFFF' : '#2f323e',
        paper: mode === 'light' ? '#FFFFFF' : '#2f323e',
      },
    },
    typography: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif, "San Francisco"',
    },
  }, nlNL);
};