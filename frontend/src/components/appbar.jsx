import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import FiltersButton from "./filters";
import SearchBar from "./searchbar";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

function ToolBarComponent({ events, setFilteredEvents, onMarkerClick }) {
  const theme = useTheme();

  return (
    <StyledToolbar sx={{ paddingY: 1 }}>
      <Typography
        variant="h5"
        component="div"
        sx={{
          marginLeft: 1,
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: "20px",
        }}
      >
        TorontoToday
      </Typography>
      <SearchBar events={events} onMarkerClick={onMarkerClick} />

      <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
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
