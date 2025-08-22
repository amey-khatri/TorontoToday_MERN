// src/theme/ubereatsEventsTheme.ts
import { createTheme } from "@mui/material/styles";

const ubereatsEventsTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f1f1f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#06c167",
      contrastText: "#ffffff",
    },
    marker: {
      cluster: "#0091ffb9",
    },
    background: {
      default: "#f6f6f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f1f1f",
      secondary: "#6e6e6e",
    },
    divider: "#e6e6e6",
    error: {
      main: "#ea4335",
    },
    success: {
      main: "#06c167",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e6e6e6",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    fontSize: 14,
    h1: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    subtitle1: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.4,
      fontSize: 14,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.4,
      fontSize: 13,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.3,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0 2px 12px rgba(0,0,0,0.08)",
    "0 4px 16px rgba(0,0,0,0.10)",
    "0 8px 24px rgba(0,0,0,0.12)",
    "0 12px 32px rgba(0,0,0,0.14)",
    "0 16px 40px rgba(0,0,0,0.16)",
    "0 20px 48px rgba(0,0,0,0.18)",
    "0 24px 56px rgba(0,0,0,0.20)",
    "0 28px 64px rgba(0,0,0,0.22)",
    "0 32px 72px rgba(0,0,0,0.24)",
    "0 36px 80px rgba(0,0,0,0.26)",
    "0 40px 88px rgba(0,0,0,0.28)",
    "0 44px 96px rgba(0,0,0,0.30)",
    "0 48px 104px rgba(0,0,0,0.32)",
    "0 52px 112px rgba(0,0,0,0.34)",
    "0 56px 120px rgba(0,0,0,0.36)",
    "0 60px 128px rgba(0,0,0,0.38)",
    "0 64px 136px rgba(0,0,0,0.40)",
    "0 68px 144px rgba(0,0,0,0.42)",
    "0 72px 152px rgba(0,0,0,0.44)",
    "0 76px 160px rgba(0,0,0,0.46)",
    "0 80px 168px rgba(0,0,0,0.48)",
    "0 84px 176px rgba(0,0,0,0.50)",
    "0 88px 184px rgba(0,0,0,0.52)",
    "0 92px 192px rgba(0,0,0,0.54)",
  ],
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f6f6f6",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e6e6e6",
          boxShadow: "none",
          overflow: "hidden",
          transition: "all 150ms ease",
          "&:hover": {
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            transform: "scale(1.01)",
            borderColor: "rgba(31,31,31,0.08)",
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 32,
          fontSize: 13,
          fontWeight: 500,
          border: "none",
          transition: "all 150ms ease",
          "&.MuiChip-filled": {
            backgroundColor: "#f0f0f0",
            color: "#1f1f1f",
            "&:hover": {
              backgroundColor: "#e6e6e6",
            },
          },
          "&.MuiChip-outlined": {
            backgroundColor: "#f0f0f0",
            color: "#1f1f1f",
            border: "1px solid #e6e6e6",
            "&:hover": {
              backgroundColor: "#e6e6e6",
            },
          },
          // Selected state
          "&[aria-pressed='true'], &.Mui-selected": {
            backgroundColor: "#1f1f1f !important",
            color: "#ffffff !important",
            "&:hover": {
              backgroundColor: "#333333 !important",
            },
          },
        },
        label: {
          padding: "0 12px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 500,
          fontSize: 14,
          padding: "10px 20px",
          transition: "all 150ms ease",
          "&:focus-visible": {
            outline: "2px solid rgba(31,31,31,0.4)",
            outlineOffset: 2,
          },
        },
        contained: {
          backgroundColor: "#1f1f1f",
          color: "#ffffff",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#333333",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          },
        },
        outlined: {
          borderColor: "#e6e6e6",
          color: "#1f1f1f",
          backgroundColor: "#ffffff",
          "&:hover": {
            borderColor: "#d0d0d0",
            backgroundColor: "#fafafa",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          },
        },
        text: {
          color: "#1f1f1f",
          "&:hover": {
            backgroundColor: "rgba(31,31,31,0.04)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#ffffff",
            border: "1px solid #e6e6e6",
            "&:hover": {
              borderColor: "#d0d0d0",
            },
            "&.Mui-focused": {
              borderColor: "#1f1f1f",
              boxShadow: "0 0 0 2px rgba(31,31,31,0.1)",
            },
            "& fieldset": {
              border: "none",
            },
          },
          "& .MuiInputBase-input": {
            padding: "12px 16px",
            fontSize: 14,
            "&::placeholder": {
              color: "#6e6e6e",
              opacity: 1,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          border: "1px solid #e6e6e6",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: "1px solid #e6e6e6",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
        list: {
          padding: "8px 0",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: "8px 16px",
          minHeight: "auto",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          "&.Mui-selected": {
            backgroundColor: "#f0f0f0",
            "&:hover": {
              backgroundColor: "#e6e6e6",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 14,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 150ms ease",
          "&:focus-visible": {
            outline: "2px solid rgba(31,31,31,0.4)",
            outlineOffset: 2,
          },
          "&:hover": {
            backgroundColor: "rgba(31,31,31,0.04)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          backgroundColor: "#1f1f1f",
          height: 2,
          borderRadius: 1,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: 14,
          fontWeight: 500,
          color: "#6e6e6e",
          "&.Mui-selected": {
            color: "#1f1f1f",
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontSize: 13,
          fontWeight: 500,
          padding: "6px 16px",
          border: "1px solid #e6e6e6",
          color: "#1f1f1f",
          backgroundColor: "#f0f0f0",
          "&:hover": {
            backgroundColor: "#e6e6e6",
          },
          "&.Mui-selected": {
            backgroundColor: "#1f1f1f",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#333333",
            },
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          fontSize: 18,
        },
        icon: {
          marginRight: 2,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          padding: "4px 8px",
          minWidth: "auto",
          height: "auto",
        },
        colorSuccess: {
          backgroundColor: "#06c167",
          color: "#ffffff",
        },
        colorError: {
          backgroundColor: "#ea4335",
          color: "#ffffff",
        },
        colorPrimary: {
          backgroundColor: "#6e6e6e",
          color: "#ffffff",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#f0f0f0",
        },
        rectangular: {
          borderRadius: 16,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e6e6e6",
        },
      },
    },
  },
});

export default ubereatsEventsTheme;
