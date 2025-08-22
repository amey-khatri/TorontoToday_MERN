import React from "react";
import { Autocomplete, TextField, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";

function getId(e) {
  return e?.eventbriteId ?? e?.id ?? e?.name ?? "";
}

export default function SearchBar({
  events = [],
  onMarkerClick,
  placeholder = "Search events...",
  sx,
}) {
  const theme = useTheme();
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
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              fontSize: "14px",
              "&:hover": {
                borderColor: theme.palette.grey[400],
              },
              "&.Mui-focused": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}26`, // 26 = 15% opacity in hex
              },
              "& fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              padding: "12px 16px",
              fontSize: "14px",
              "&::placeholder": {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
                  />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={getId(option)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1,
            }}
          >
            <Box
              component="img"
              src={option?.image}
              alt={option?.name}
              sx={{
                width: 40,
                height: 28,
                objectFit: "cover",
                borderRadius: "8px",
                bgcolor: theme.palette.action.hover,
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
                color: theme.palette.text.primary,
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
