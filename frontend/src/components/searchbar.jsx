import React from "react";
import { Autocomplete, TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
        <TextField 
          {...params} 
          placeholder={placeholder} 
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e6e6e6",
              fontSize: "14px",
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
              fontSize: "14px",
              "&::placeholder": {
                color: "#6e6e6e",
                opacity: 1,
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6e6e6e", fontSize: 20 }} />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={getId(option)}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1.5,
            py: 1
          }}>
            <Box
              component="img"
              src={option?.image}
              alt={option?.name}
              sx={{
                width: 40,
                height: 28,
                objectFit: "cover",
                borderRadius: "8px",
                bgcolor: "#f0f0f0",
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <Box 
              component="span"
              sx={{
                fontSize: "14px",
                color: "#1f1f1f",
                fontWeight: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {option?.name}
            </Box>
          </Box>
        </li>
      )}
      blurOnSelect
      clearOnBlur={false}
      sx={{ width: { xs: 240, sm: 400 }, ...sx }}
    />
  );
}
