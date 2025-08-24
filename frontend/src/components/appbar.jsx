import React from "react";
import { AppBar, Toolbar, Typography, Box, useMediaQuery } from "@mui/material";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledToolbar sx={{ paddingY: 1 }}>
      {/* Left side - Logo and Title */}
      <Box sx={{ display: "flex", alignItems: "center", flex: "1 1 0" }}>
        <img
          src={TTLogo}
          alt="TOToday Logo"
          style={{ height: 48, overflow: "hidden" }}
        />
        {/* Hide title on mobile to give more space to search */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            marginLeft: 0,
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: "20px",
            paddingLeft: "12px",
            display: { xs: "none", sm: "block" },
          }}
        >
          TorontoToday
        </Typography>
      </Box>

      {/* Center - Search Bar (always expanded) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flex: "1 1 0",
          px: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: "200px", sm: "300px", md: "400px" },
            maxWidth: "100%",
          }}
        >
          <SearchBar events={events} onMarkerClick={onMarkerClick} />
        </Box>
      </Box>

      {/* Right side - Filters */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: "1 1 0",
        }}
      >
        <FiltersButton
          events={events}
          setFilteredEvents={setFilteredEvents}
          iconOnly={isMobile}
        />
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
