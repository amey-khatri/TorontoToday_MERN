import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import FiltersButton from "./filters";
import SearchBar from "./searchbar";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const FilterButton = styled(Button)(({ theme }) => ({
  variant: "outlined",
  display: { sm: "none", md: "flex" },
  backgroundColor: theme.palette.grey[600],
  padding: "6px 12px",
  color: theme.palette.primary.contrastText,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,

  swidth: "30%",

  // at sm and up, bump it to 50%
  [theme.breakpoints.up("sm")]: {
    width: "40%",
  },
  "& .MuiInputBase-root": {
    padding: "0 10px",
    color: theme.palette.text.primary,

    "& input::placeholder": {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
}));

function ToolBarComponent({ events, setFilteredEvents, onMarkerClick }) {
  return (
    <StyledToolbar>
      <Typography variant="h5" component="div" marginLeft={1}>
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
        bgcolor: (theme) => theme.palette.background.default,
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
