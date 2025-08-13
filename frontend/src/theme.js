// src/theme.js
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      paper: "#353535",
    },
    custom: {
      hover: "rgba(84, 84, 84, 0.65)",
    },
  },
  typography: {
    fontFamily: [
      "Alegreya Sans",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "Alegreya Sans, sans-serif",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "Alegreya Sans, sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "Alegreya Sans, sans-serif",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "Alegreya Sans, sans-serif",
      fontWeight: 400,
    },
    button: {
      fontFamily: "Alegreya Sans, sans-serif",
      fontWeight: 500,
      textTransform: "none",
    },
    caption: {
      fontFamily: "Alegreya Sans, sans-serif",
    },
    overline: {
      fontFamily: "Alegreya Sans, sans-serif",
    },
  },
});

export default darkTheme;
