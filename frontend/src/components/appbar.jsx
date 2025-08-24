import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import FiltersButton from "./filters";
import SearchBar from "./searchbar";
import TTLogo from "../images/TTLogo_Pin.png";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

function ToolBarComponent({ events, setFilteredEvents, onMarkerClick }) {
  const theme = useTheme();

  return (
    <StyledToolbar sx={{ paddingY: 1, position: "relative" }}>
      {/* Left side - Logo and Title */}
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <img
          src={TTLogo}
          alt="TOToday Logo"
          style={{ height: 48, overflow: "hidden" }}
        />
        <Typography
          variant="h5"
          component="div"
          sx={{
            marginLeft: 0,
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: "20px",
            paddingLeft: "12px",
          }}
        >
          TorontoToday
        </Typography>
      </Box>

      {/* Center - Search Bar (absolutely positioned to stay centered) */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "200px", sm: "300px", md: "400px" },
          maxWidth: { xs: "50vw", sm: "40vw" },
        }}
      >
        <SearchBar events={events} onMarkerClick={onMarkerClick} />
      </Box>

      {/* Right side - Filters */}
      <Box
        sx={{ display: "flex", gap: 1, flex: 1, justifyContent: "flex-end" }}
      >
        <FiltersButton events={events} setFilteredEvents={setFilteredEvents} />
      </Box>
    </StyledToolbar>
  );
}

export default function AppBarComponent({
  events,
  setFilteredEvents,
  onMarkerClick,
}) {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        borderRadius: "0 0 16px 16px",
      }}
    >
      <ToolBarComponent
        events={events}
        setFilteredEvents={setFilteredEvents}
        onMarkerClick={onMarkerClick}
      />
    </AppBar>
  );
}
