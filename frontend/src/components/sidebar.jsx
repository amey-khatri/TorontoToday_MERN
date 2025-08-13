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
  GlobalStyles,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";

function EventCard({ event, onEventClick }) {
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

  return (
    <ListItem sx={{ paddingRight: 0 }}>
      <Card
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderRadius: (theme) => theme.shape.borderRadius,
          boxShadow: 1,
          flexGrow: 1,
        }}
      >
        <CardActionArea onClick={() => onEventClick(event)}>
          <CardMedia
            component="img"
            height="140"
            src={event.image}
            alt={event.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="h6" fontSize={"1rem"} component="div">
              {event.name}
            </Typography>
            <Box
              component="div"
              sx={{ display: "inline-flex", alignItems: "center" }}
            >
              <Typography variant="caption" color="text.secondary">
                <AccessTimeFilledIcon
                  fontSize="inherit"
                  sx={{
                    verticalAlign: "middle",
                    marginRight: "4px",
                    fontSize: "0.875rem",
                  }}
                />
                {event.venueName} - {formatDateTime(event.startTime)}
              </Typography>
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
          sx={{ p: 2, textAlign: "center", alignContent: "center" }}
          height="100%"
          width="100%"
          bgcolor={theme.palette.background.paper}
        >
          <Typography variant="h6">No Events Found</Typography>
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
            scrollbarColor: `${theme.palette.text.secondary} ${theme.palette.background.paper}`,
            scrollbarWidth: "auto",
            scrollbarGutter: "stable",
            backgroundColor: open
              ? theme.palette.background.paper
              : "transparent",
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
      <List sx={{ p: 0, m: 0 }}>
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

function CustomScrollbarStyles() {
  const theme = useTheme();
  return (
    <GlobalStyles
      styles={{
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.text.secondary} ${theme.palette.background.paper}`,
        },
        "*::-webkit-scrollbar": { width: "8px", height: "8px" },
        "*::-webkit-scrollbar-track": {
          background: theme.palette.background.paper,
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.action.hover,
          borderRadius: "4px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    />
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
          borderRadius: "20%",
          width: 22,
          height: 50,
          boxShadow: 2,
          "&:hover": {
            backgroundColor: theme.palette.custom.hover,
            boxShadow: 3,
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
