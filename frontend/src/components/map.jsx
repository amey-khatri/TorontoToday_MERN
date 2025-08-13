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
import theme from "../theme";

// MUI Global Styles for seamless tooltip
const tooltipGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
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
    })}
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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
      }}
    >
      <Card
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderRadius: (theme) => theme.shape.borderRadius,
          boxShadow: 2,
          flexGrow: 1,
          width: 200,
          height: 150,
        }}
      >
        <CardActionArea sx={{ height: "100%" }}>
          <CardMedia
            component="img"
            height="120"
            width="200"
            src={event.image}
            alt={event.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent
            sx={{
              textAlign: "center",
              paddingX: "10px",
              paddingY: "8px",
              margin: "0px",
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="p"
              fontSize="0.8rem"
              lineHeight={1.2}
              fontWeight={theme.typography.fontWeightBold}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
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
function ClustersLayer({ events = [], onMarkerClick, selectedEvent }) {
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
        background:#2A81CBbb;
        color:#fff;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        width:${size}px;
        height:${size}px;
        box-shadow:0 2px 6px rgba(0,0,0,0.2);
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
  const center = [43.6532, -79.3832];
  const zoom = 12;

  const [isSelected, setIsSelected] = useState(false);

  return (
    <>
      {tooltipGlobalStyles}
      <Box flex={3} sx={{ display: { xs: "block" }, bgcolor: "skyblue" }}>
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
          />
        </MapContainer>
      </Box>
    </>
  );
}
