import React from "react";
import { Autocomplete, TextField, Box } from "@mui/material";

function getId(e) {
  return e?.eventbriteId ?? e?.id ?? e?.name ?? "";
}

export default function SearchBar({
  events = [],
  onMarkerClick,
  placeholder = "Search events...",
  sx,
}) {
  const [inputValue, setInputValue] = React.useState("");

  const options = React.useMemo(() => {
    // Ensure array and dedupe by id
    const map = new Map();
    (Array.isArray(events) ? events : Object.values(events ?? {})).forEach(
      (e) => {
        const id = getId(e);
        if (id && !map.has(id)) map.set(id, e);
      }
    );
    return Array.from(map.values());
  }, [events]);

  const filtered = React.useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return options.slice(0, 0);
    return options
      .filter((e) => (e?.name || "").toLowerCase().includes(q))
      .slice(0, 50);
  }, [options, inputValue]);

  return (
    <Autocomplete
      size="small"
      options={filtered}
      getOptionLabel={(option) => option?.name || ""}
      isOptionEqualToValue={(o, v) => getId(o) === getId(v)}
      onChange={(_, value) => value && onMarkerClick?.(value)}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      noOptionsText={inputValue ? "No matches" : "Type to search"}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} variant="outlined" />
      )}
      renderOption={(props, option) => (
        <li {...props} key={getId(option)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={option?.image}
              alt={option?.name}
              sx={{
                width: 32,
                height: 20,
                objectFit: "cover",
                borderRadius: "4px",
                bgcolor: "action.hover",
              }}
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <Box component="span">{option?.name}</Box>
          </Box>
        </li>
      )}
      blurOnSelect
      clearOnBlur={false}
      sx={{ width: { xs: 240, sm: 400 }, ...sx }}
    />
  );
}
