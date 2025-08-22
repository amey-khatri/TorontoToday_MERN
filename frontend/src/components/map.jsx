import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  GlobalStyles,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Supercluster from "supercluster";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material/styles";

// MUI Global Styles for seamless tooltip
const getTooltipGlobalStyles = (theme) => (
  <GlobalStyles
    styles={{
      ".leaflet-tooltip.mapPopup": {
        background: "transparent !important",
        border: "none !important",
        boxShadow: "none !important",
        padding: "0 !important",
        margin: "0 !important",
      },
      ".leaflet-tooltip.mapPopup::before": {
        borderTopColor: `${theme.palette.background.paper} !important`,
        borderLeftColor: "transparent !important",
        borderRightColor: "transparent !important",
        borderBottomColor: "transparent !important",
      },
    }}
  />
);

const scaleFactor = 1.2; // Scale factor for the larger icon

// Define custom icons for regular and selected markers
const defaultIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25 * scaleFactor, 41 * scaleFactor], // 40% larger
  iconAnchor: [12 * scaleFactor, 41 * scaleFactor], // Adjusted anchor point
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function CreateCardPopup({ event }) {
  const theme = useTheme();

  return (
    <Box>
      <Card
        sx={{
          minWidth: 200,
          maxWidth: 240,
          borderRadius: theme.shape.borderRadius + "px",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[3],
          overflow: "hidden",
          cursor: "pointer",
          transition: `all ${theme.transitions.duration.shortest}ms ${theme.transitions.easing.easeOut}`,
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="120"
            image={event.image}
            alt={event.name}
            sx={{
              objectFit: "cover",
              borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
            }}
          />
          <CardContent
            sx={{
              padding: "12px",
              margin: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              component="p"
              sx={{
                fontSize: "13px",
                lineHeight: 1.3,
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                textAlign: "center",
              }}
            >
              {event.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

// Component to handle map resize
function MapResizeHandler({ sidebarOpen }) {
  const map = useMap();

  useEffect(() => {
    // Small delay to ensure the sidebar animation is complete
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [sidebarOpen, map]);

  return null;
}

const SELECTED_EVENT_ZOOM = 15; // zoom when focusing an event

// Add this new component after MapResizeHandler
function MapEventFocusHandler({ selectedEvent }) {
  const map = useMap();
  const prevViewRef = useRef(null); // { center: [lat, lng], zoom: number }

  useEffect(() => {
    if (!map) return;

    if (selectedEvent) {
      // Save the current view only the first time we focus an event
      if (!prevViewRef.current) {
        const c = map.getCenter();
        prevViewRef.current = { center: [c.lat, c.lng], zoom: map.getZoom() };
      }

      const position = [
        selectedEvent.location.latitude,
        selectedEvent.location.longitude,
      ];

      map.setView(position, SELECTED_EVENT_ZOOM, {
        animate: true,
        duration: 0.5,
      });
    } else if (prevViewRef.current) {
      // Restore previous view when event is cleared/closed
      const { center, zoom } = prevViewRef.current;
      prevViewRef.current = null;
      map.setView(center, zoom, { animate: true, duration: 0.5 });
    }
  }, [selectedEvent, map]);

  return null;
}

// Clustered markers layer
function ClustersLayer({ events = [], onMarkerClick, selectedEvent, theme }) {
  const map = useMap();
  const [clusters, setClusters] = React.useState([]);

  const points = React.useMemo(
    () =>
      (events || []).map((e) => ({
        type: "Feature",
        properties: {
          cluster: false,
          eventId: e.eventbriteId ?? e.id,
          event: e,
        },
        geometry: {
          type: "Point",
          coordinates: [e.location.longitude, e.location.latitude],
        },
      })),
    [events]
  );

  const index = React.useMemo(() => {
    const sc = new Supercluster({
      radius: 80, // px
      maxZoom: 14, // stop clustering past this zoom
    });
    sc.load(points);
    return sc;
  }, [points]);

  const refresh = React.useCallback(() => {
    if (!map) return;
    const b = map.getBounds();
    const bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
    const zoom = Math.round(map.getZoom());
    const c = index.getClusters(bbox, zoom);
    setClusters(c);
  }, [index, map]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    if (!map) return;
    map.on("moveend zoomend", refresh);
    return () => {
      map.off("moveend zoomend", refresh);
    };
  }, [map, refresh]);

  const createClusterIcon = (count) => {
    const size = count < 10 ? 30 : count < 100 ? 36 : 44;
    return L.divIcon({
      html: `<div style="
        background:${theme.palette.marker.cluster};
        color:${theme.palette.primary.contrastText};
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        width:${size}px;
        height:${size}px;
        box-shadow:${theme.shadows[2]};
        font-weight:600;
        font-family:inherit;
      ">${count}</div>`,
      className: "event-cluster-icon",
      iconSize: [size, size],
    });
  };

  return (
    <>
      {clusters.map((c) => {
        const [lng, lat] = c.geometry.coordinates;

        if (c.properties.cluster) {
          const count = c.properties.point_count;
          const clusterId = c.properties.cluster_id;
          return (
            <Marker
              key={`cluster-${clusterId}`}
              position={[lat, lng]}
              icon={createClusterIcon(count)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    index.getClusterExpansionZoom(clusterId),
                    25
                  );
                  map.setView([lat, lng], expansionZoom, { animate: true });
                },
              }}
            />
          );
        }

        const event = c.properties.event;
        const isSelected =
          selectedEvent &&
          (selectedEvent.eventbriteId ?? selectedEvent.id) ===
            (event.eventbriteId ?? event.id);

        return (
          <ClickableMarker
            key={event.eventbriteId ?? event.id}
            event={event}
            position={[event.location.latitude, event.location.longitude]}
            onMarkerClick={onMarkerClick}
            isSelected={!!isSelected}
          />
        );
      })}
    </>
  );
}

function ClickableMarker({ event, position, onMarkerClick, isSelected }) {
  const map = useMap();

  const handleClick = () => {
    onMarkerClick(event);
  };

  return (
    <Marker
      position={position}
      eventHandlers={{
        click: handleClick,
      }}
      icon={isSelected ? selectedIcon : defaultIcon}
      zIndexOffset={isSelected ? 1000 : 0} // Ensure the selected marker is on top
    >
      <Tooltip
        className="mapPopup"
        direction="top"
        offset={isSelected ? [50, -80] : [0, -55]}
        permanent={false}
        arrow
      >
        <CreateCardPopup event={event} />
      </Tooltip>
    </Marker>
  );
}

export default function MapComponent({
  events,
  sidebarOpen,
  onMarkerClick,
  selectedEvent,
}) {
  const theme = useTheme();
  const center = [43.6532, -79.3832];
  const zoom = 12;

  const [isSelected, setIsSelected] = useState(false);

  return (
    <>
      {getTooltipGlobalStyles(theme)}
      <Box
        flex={3}
        sx={{
          display: { xs: "block" },
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius + "px",
          overflow: "hidden",
          margin: 1,
          boxShadow: theme.shadows[1],
        }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapResizeHandler sidebarOpen={sidebarOpen} />
          <MapEventFocusHandler selectedEvent={selectedEvent} />

          <ClustersLayer
            events={events}
            onMarkerClick={onMarkerClick}
            selectedEvent={selectedEvent}
            theme={theme}
          />
        </MapContainer>
      </Box>
    </>
  );
}
