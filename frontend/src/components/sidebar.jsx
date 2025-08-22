import React from "react";
import {
  Drawer,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  ListItem,
  List,
  IconButton,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

function EventCard({ event, onEventClick }) {
  const theme = useTheme();

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const priceColor = (event) => {
    if (event.price === "0.00") {
      return theme.palette.success.main;
    } else if (event.price === "Sold Out") {
      return theme.palette.error.main;
    } else {
      return theme.palette.secondary.secondary;
    }
  };

  return (
    <ListItem sx={{ paddingRight: 0, paddingY: 0.5 }}>
      <Card
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius + "px",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          flexGrow: 1,
          transition: `all ${theme.transitions.duration.shortest}ms ${theme.transitions.easing.easeOut}`,
          overflow: "hidden",
          "&:hover": {
            boxShadow: theme.shadows[1],
            transform: "scale(1.01)",
            borderColor: `rgba(${theme.palette.primary.main.replace(
              "#",
              ""
            )}, 0.08)`,
          },
        }}
      >
        <CardActionArea onClick={() => onEventClick(event)}>
          <CardMedia
            component="img"
            height="140"
            src={event.image}
            alt={event.name}
            sx={{
              objectFit: "cover",
              borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
            }}
          />
          <CardContent sx={{ padding: "12px 16px" }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: 1.3,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "8px",
              }}
            >
              {event.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                marginBottom: "8px",
              }}
            >
              <AccessTimeFilledIcon
                sx={{
                  fontSize: "14px",
                  color: theme.palette.text.secondary,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                  lineHeight: 1.3,
                }}
              >
                {formatDateTime(event.startTime)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {event.venueName && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.primary,
                    borderRadius: "16px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {event.venueName}
                </Box>
              )}
              <Box
                sx={{
                  backgroundColor: priceColor(event),
                  color: theme.palette.common.white,
                  borderRadius: "16px",
                  padding: "2px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {event.price === "0.00" ? "Free" : event.price}
              </Box>
              {event.category && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.primary,
                    borderRadius: "16px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {event.category}
                </Box>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </ListItem>
  );
}

const DRAWER_WIDTH = 410;
const COLLAPSED_WIDTH = 0;

export default function SidebarComponent({
  events,
  open = true,
  onToggle,
  onEventClick,
}) {
  const theme = useTheme();

  if (!events || events.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          position: "relative",
        }}
      >
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            alignContent: "center",
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius + "px",
            margin: 2,
          }}
          height="100%"
          width="100%"
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            No Events Found
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        height: "100%",
        position: "relative",
      }}
    >
      {/* <CustomScrollbarStyles /> */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            position: "relative",
            height: "100%",
            boxSizing: "border-box",
            overflowY: open ? "auto" : "hidden",
            overflowX: "hidden",
            transition: theme.transitions.create(["width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            backgroundColor: theme.palette.background.default,
            border: "none",
            borderRight: open ? `1px solid ${theme.palette.divider}` : "none",
          },
        }}
      >
        <ScrollableEventList
          events={events}
          open={open}
          drawerWidth={DRAWER_WIDTH}
          onEventClick={onEventClick}
        />
      </Drawer>
      <ToggleSidebarButton
        open={open}
        onToggle={onToggle}
        DRAWER_WIDTH={DRAWER_WIDTH}
      />
    </Box>
  );
}

function ScrollableEventList({ events, open, drawerWidth, onEventClick }) {
  const scrollRef = React.useRef(null);

  const list = React.useMemo(
    () => (Array.isArray(events) ? events : Object.values(events ?? {})),
    [events]
  );

  const [visibleCount, setVisibleCount] = React.useState(30);

  // Reset visible items when the list changes
  React.useEffect(() => {
    setVisibleCount(30);
  }, [list]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom) {
      setVisibleCount((c) => Math.min(c + 30, list.length));
    }
  };

  const visible = list.slice(0, visibleCount);

  return (
    <Box
      ref={scrollRef}
      onScroll={handleScroll}
      sx={{
        height: "100%",
        width: "100%",
        position: open ? "relative" : "absolute",
        left: 0,
        overflowY: "auto",
        overflowX: "hidden", // prevent horizontal scrollbar
        visibility: open ? "visible" : "hidden",
      }}
    >
      <List sx={{ p: 1, m: 0 }}>
        {visible.map((event, idx) => (
          <EventCard
            key={event.eventbriteId ?? event.id ?? idx}
            event={event}
            onEventClick={onEventClick}
          />
        ))}
      </List>
    </Box>
  );
}

function ToggleSidebarButton({ open, onToggle, DRAWER_WIDTH }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: open ? DRAWER_WIDTH - 2 : -5,
        transform: "translateY(-50%)",
        zIndex: 800,
        transition: theme.transitions.create(["left"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <IconButton
        onClick={onToggle}
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "12px",
          width: 32,
          height: 48,
          boxShadow: theme.shadows[1],
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            boxShadow: theme.shadows[2],
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        {open ? (
          <ChevronLeftIcon fontSize="medium" />
        ) : (
          <ChevronRightIcon fontSize="medium" />
        )}
      </IconButton>
    </Box>
  );
}
