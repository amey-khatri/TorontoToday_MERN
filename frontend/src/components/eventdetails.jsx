import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  useTheme,
  List,
  ListItem,
} from "@mui/material";
import {
  Close,
  LocationPin,
  AccessTimeFilled,
  Paid,
  Label,
  OpenInNew,
  Groups,
  PermContactCalendar,
} from "@mui/icons-material";
import EventCard from "./sidebar";

const DRAWER_WIDTH = 400;
const IMAGE_HEIGHT = 180; // Fixed height in pixels for the image section

function CloseButton({ onClose }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1200,
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "50%",
          width: 30,
          height: 30,
          boxShadow: 2,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            boxShadow: 3,
          },
        }}
      >
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
}

function EventImage({ event }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: IMAGE_HEIGHT,
        minHeight: IMAGE_HEIGHT,
        flexShrink: 0,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${event?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px)",
          opacity: 0.8,
          transform: "scale(1.1)",
          zIndex: 0,
        }}
      />
      <img
        src={event?.image}
        alt={event?.name}
        style={{
          maxWidth: "93%",
          maxHeight: "93%",
          objectFit: "contain",
          borderRadius: theme.shape.borderRadius,
          position: "relative",
          zIndex: 1,
        }}
      />
    </Box>
  );
}

function EventDetailsContent({ event }) {
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

  // Compute venue display text safely
  const venueName = !!event?.venueName ? event?.venueName : "Virtual";
  const address = event?.address ?? "";

  const streetLine = (address.split(",")[0] || "").trim();
  const addressParts = streetLine
    .split(/\s+/) // split by whitespace
    .map((p) => p.trim())
    .filter(Boolean);

  const hasOverlap =
    venueName &&
    addressParts.some((part) =>
      venueName.toLowerCase().includes(part.toLowerCase())
    );

  const venueDisplay = hasOverlap
    ? venueName + ", Toronto, ON"
    : [venueName, streetLine].filter(Boolean).join(" - ");

  // Only show if non-empty ("" is falsy)
  const hasFormat = !!event?.format;
  const hasOrganizer = !!event?.organizer;

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 2,
      }}
    >
      {/* Event details content goes here */}

      <Typography variant="h5" component={"div"} marginBottom={1}>
        {event?.name}
      </Typography>

      <hr mar />

      <Typography variant="body1" color="text.secondary" marginTop={1}>
        {event?.description}
      </Typography>

      <Box sx={{ flex: 1, alignContent: "center" }}>
        <List>
          <ListItem alignItems="center">
            <LocationPin fontSize="medium" />
            <Typography variant="body1" marginLeft={"10px"}>
              {venueDisplay}
            </Typography>
          </ListItem>
          <ListItem>
            <AccessTimeFilled fontSize="medium" />
            <Typography variant="body1" marginLeft={"10px"}>
              {formatDateTime(event?.startTime)} -{" "}
              {formatDateTime(event?.endTime).split(",")[1]}
            </Typography>
          </ListItem>
          <ListItem>
            <Label fontSize="medium" />
            <Typography variant="body1" marginLeft={"10px"}>
              {event?.category || "General"}
            </Typography>
          </ListItem>

          {hasFormat && (
            <ListItem>
              <Groups fontSize="medium" />
              <Typography variant="body1" marginLeft={"10px"}>
                {event.format}
              </Typography>
            </ListItem>
          )}

          {hasOrganizer && (
            <ListItem>
              <PermContactCalendar fontSize="medium" />
              <Typography variant="body1" marginLeft={"10px"}>
                {event.organizer}
              </Typography>
            </ListItem>
          )}

          <ListItem>
            <Paid fontSize="medium" />
            <Typography variant="body1" marginLeft={"10px"}>
              {event?.price != "0.00" ? `${event.price}` : "Free"}
            </Typography>
          </ListItem>
          <ListItem>
            <OpenInNew fontSize="medium" />
            <Typography variant="body1" marginLeft={"10px"}>
              <a
                href={event?.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: theme.palette.info.main,
                  fontFamily: "Alegreya Sans",
                }}
              >
                {event?.url ? "View Event" : "No URL Available"}
              </a>
            </Typography>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default function EventDetailsComponent({ event, open, onClose }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        height: "100%",
        position: "relative",
      }}
    >
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : 0,
            position: "relative",
            height: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            transition: theme.transitions.create(["width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            borderLeft: `1px solid ${theme.palette.divider}`,
            backgroundColor: open
              ? theme.palette.background.paper
              : "transparent",
          },
        }}
      >
        {open && event && (
          <Box
            sx={{
              position: "relative",
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CloseButton onClose={onClose} />
            <EventImage event={event} />
            <EventDetailsContent event={event} />
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
