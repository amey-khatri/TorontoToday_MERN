import React, { useState, useEffect } from "react";
import "./App.css";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AppBarComponent from "./components/appbar";
import SidebarComponent from "./components/sidebar";
import MapComponent from "./components/map";
import EventDetailsComponent from "./components/eventdetails";

export default function App() {
  const theme = useTheme();

  // State to hold the fetched events
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // State for sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  //State for selected event in map
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventdetailsOpen, setEventDetailsOpen] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState(true);

  function handleMarkerClick(event) {
    if (!eventdetailsOpen) setPreviousSidebarState(sidebarOpen);
    setSidebarOpen(false);
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  }

  function handleEventDetailsClose() {
    setEventDetailsOpen(false);
    setSelectedEvent(null);
    setSidebarOpen(previousSidebarState);
  }

  // Fetch events from backend
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/events`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Keep filteredEvents in sync when events refresh
  useEffect(() => {
    setFilteredEvents(events || []);
  }, [events]);

  // Show loading state
  if (loading) {
    return <div>Loading events...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error loading events: {error}</div>;
  }

  return (
    <>
      <Box
        height="100vh"
        width="100vw"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <AppBarComponent
          events={events}
          setFilteredEvents={setFilteredEvents}
          onMarkerClick={handleMarkerClick}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          p={0}
          gap={0}
          sx={{
            height: `calc(100vh - 66px)`,
            overflow: "hidden",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <SidebarComponent
            events={filteredEvents}
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onEventClick={handleMarkerClick}
          />
          <EventDetailsComponent
            event={selectedEvent}
            open={eventdetailsOpen}
            onClose={handleEventDetailsClose}
          />
          <MapComponent
            events={filteredEvents}
            sidebarOpen={sidebarOpen || eventdetailsOpen}
            onMarkerClick={handleMarkerClick}
            selectedEvent={selectedEvent}
          />
        </Stack>
      </Box>
    </>
  );
}
