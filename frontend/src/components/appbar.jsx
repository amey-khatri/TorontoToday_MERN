import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FiltersButton from "./filters";
import SearchBar from "./searchbar";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

function ToolBarComponent({ events, setFilteredEvents, onMarkerClick }) {
  return (
    <StyledToolbar sx={{ paddingY: 1 }}>
      <Typography 
        variant="h5" 
        component="div" 
        sx={{ 
          marginLeft: 1,
          fontWeight: 600,
          color: "#1f1f1f",
          fontSize: "20px"
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
  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e6e6e6",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
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
