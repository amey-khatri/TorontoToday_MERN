import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Menu,
  Stack,
  TextField,
  Autocomplete,
  Slider,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTheme } from "@mui/material/styles";

export const defaultFilters = {
  categories: [],
  formats: [],
  freeOnly: false,
  dateFrom: "",
  dateTo: "",
  priceMax: 500, // 500 means "500+"
};

function applyFilters(list, filters) {
  if (!Array.isArray(list)) return [];
  return list.filter((e) => {
    if (filters.categories?.length) {
      if (!e?.category || !filters.categories.includes(e.category))
        return false;
    }
    if (filters.formats?.length) {
      if (!e?.format || !filters.formats.includes(e.format)) return false;
    }

    // Free-only overrides price slider
    if (filters.freeOnly && e?.price !== "0.00") return false;

    if (filters.dateFrom) {
      const start = new Date(e?.startTime);
      if (isFinite(start) && start < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      const start = new Date(e?.startTime);
      const endOfDay = new Date(filters.dateTo + "T23:59:59");
      if (isFinite(start) && start > endOfDay) return false;
    }

    // Single max price (0 .. 500+). 500 means "no upper cap".
    const priceMax = Number.isFinite(+filters.priceMax)
      ? +filters.priceMax
      : 500;
    if (!filters.freeOnly && priceMax < 500) {
      const p = parseFloat(e?.price);
      if (Number.isNaN(p)) return false;
      if (p > priceMax) return false;
    }

    return true;
  });
}

export default function FiltersButton({ events = [], setFilteredEvents }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Build options from the full dataset
  const categories = React.useMemo(
    () =>
      Array.from(
        new Set((events || []).map((e) => e?.category).filter(Boolean))
      ).sort(),
    [events]
  );
  const formats = React.useMemo(
    () =>
      Array.from(
        new Set((events || []).map((e) => e?.format).filter(Boolean))
      ).sort(),
    [events]
  );

  const [filters, setFilters] = React.useState(defaultFilters);

  const activeCount =
    (filters.categories?.length || 0) +
    (filters.formats?.length || 0) +
    (filters.freeOnly ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.priceMax !== 500 ? 1 : 0); // 500 = "500+" (no cap)

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClear = () => {
    setFilters({ ...defaultFilters, priceMax: 500 });
    setFilteredEvents?.(events);
    handleClose();
  };

  const handleApply = () => {
    setFilteredEvents?.(applyFilters(events, filters));
    handleClose();
  };

  const priceLabel = (v) => (v === 0 ? "Free" : v === 500 ? "500+" : `$${v}`);

  return (
    <>
      <Button
        startIcon={<FilterListIcon />}
        onClick={handleOpen}
        sx={{
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "14px",
          padding: "8px 16px",
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          transition: `all ${theme.transitions.duration.shortest}ms ${theme.transitions.easing.easeOut}`,
          "&:hover": {
            backgroundColor: theme.palette.grey[200],
            boxShadow: theme.shadows[1],
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        Filters{" "}
        {activeCount ? (
          <Chip
            size="small"
            label={activeCount}
            sx={{
              ml: 1,
              height: "20px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "& .MuiChip-label": {
                padding: "0 6px",
              },
            }}
          />
        ) : null}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
            marginTop: "8px",
          },
        }}
      >
        <Box sx={{ p: 3, width: 340 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: "14px",
                }}
              >
                Categories
              </Typography>
              <Autocomplete
                multiple
                size="small"
                options={categories}
                value={filters.categories}
                onChange={(_, value) =>
                  setFilters((f) => ({ ...f, categories: value }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select categories"
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
                          boxShadow: `0 0 0 2px ${theme.palette.primary.main}26`,
                        },
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#1f1f1f",
                        color: "#ffffff",
                        fontSize: "12px",
                        height: "24px",
                        "& .MuiChip-deleteIcon": {
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            color: "#ffffff",
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: "#1f1f1f",
                  fontSize: "14px",
                }}
              >
                Formats
              </Typography>
              <Autocomplete
                multiple
                size="small"
                options={formats}
                value={filters.formats}
                onChange={(_, value) =>
                  setFilters((f) => ({ ...f, formats: value }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select formats"
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
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#1f1f1f",
                        color: "#ffffff",
                        fontSize: "12px",
                        height: "24px",
                        "& .MuiChip-deleteIcon": {
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            color: "#ffffff",
                          },
                        },
                      }}
                    />
                  ))
                }
              />
            </Box>

            {/* Max price slider */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: "#1f1f1f",
                  fontSize: "14px",
                }}
              >
                Max price: {priceLabel(filters.priceMax ?? 500)}
              </Typography>
              <Slider
                value={
                  Number.isFinite(+filters.priceMax) ? +filters.priceMax : 500
                }
                onChange={(_, value) =>
                  setFilters((f) => ({ ...f, priceMax: Number(value) }))
                }
                valueLabelDisplay="auto"
                valueLabelFormat={priceLabel}
                min={0}
                max={500}
                step={5}
                marks={[
                  { value: 0, label: "Free" },
                  { value: 500, label: "500+" },
                ]}
                disabled={!!filters.freeOnly}
                sx={{
                  color: "#1f1f1f",
                  height: 4,
                  "& .MuiSlider-track": {
                    border: "none",
                    backgroundColor: "#1f1f1f",
                  },
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    backgroundColor: "#1f1f1f",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.24)",
                    },
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#e6e6e6",
                  },
                  "& .MuiSlider-markLabel": {
                    fontSize: "12px",
                    color: "#6e6e6e",
                  },
                }}
              />
              {filters.freeOnly ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#6e6e6e",
                    fontSize: "12px",
                    display: "block",
                    mt: 1,
                  }}
                >
                  Free only is enabled; price filter is ignored.
                </Typography>
              ) : null}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!filters.freeOnly}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, freeOnly: e.target.checked }))
                  }
                  sx={{
                    color: "#6e6e6e",
                    "&.Mui-checked": {
                      color: "#1f1f1f",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(31,31,31,0.04)",
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "14px", color: "#1f1f1f" }}>
                  Free only
                </Typography>
              }
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: "#1f1f1f",
                  fontSize: "14px",
                }}
              >
                Date Range
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, dateFrom: e.target.value }))
                  }
                  fullWidth
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
                    "& .MuiInputLabel-root": {
                      color: "#6e6e6e",
                      fontSize: "14px",
                      "&.Mui-focused": {
                        color: "#1f1f1f",
                      },
                    },
                  }}
                />
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, dateTo: e.target.value }))
                  }
                  fullWidth
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
                    "& .MuiInputLabel-root": {
                      color: "#6e6e6e",
                      fontSize: "14px",
                      "&.Mui-focused": {
                        color: "#1f1f1f",
                      },
                    },
                  }}
                />
              </Stack>
            </Box>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                size="medium"
                onClick={handleClear}
                sx={{
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "14px",
                  padding: "8px 20px",
                  color: "#6e6e6e",
                  "&:hover": {
                    backgroundColor: "rgba(110,110,110,0.04)",
                  },
                }}
              >
                Clear
              </Button>
              <Button
                size="medium"
                variant="contained"
                onClick={handleApply}
                sx={{
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "14px",
                  padding: "8px 20px",
                  backgroundColor: "#1f1f1f",
                  color: "#ffffff",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#333333",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  },
                }}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Menu>
    </>
  );
}
