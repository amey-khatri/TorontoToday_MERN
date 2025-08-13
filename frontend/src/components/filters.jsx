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
        color="inherit"
        startIcon={<FilterListIcon />}
        onClick={handleOpen}
      >
        Filters{" "}
        {activeCount ? (
          <Chip size="small" label={activeCount} sx={{ ml: 1 }} />
        ) : null}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} keepMounted>
        <Box sx={{ p: 2, width: 320 }}>
          <Stack spacing={2}>
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
                  label="Categories"
                  placeholder="Select"
                />
              )}
            />
            <Autocomplete
              multiple
              size="small"
              options={formats}
              value={filters.formats}
              onChange={(_, value) =>
                setFilters((f) => ({ ...f, formats: value }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Formats" placeholder="Select" />
              )}
            />

            {/* Max price slider */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              />
              {filters.freeOnly ? (
                <Typography variant="caption" color="text.secondary">
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
                />
              }
              label="Free only"
            />
            <Stack direction="row" spacing={1}>
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
              />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button size="small" onClick={handleClear}>
                Clear
              </Button>
              <Button size="small" variant="contained" onClick={handleApply}>
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Menu>
    </>
  );
}
