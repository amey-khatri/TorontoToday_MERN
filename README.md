# TorontoToday

A MERN + Python worker app that discovers events in Toronto, stores them in MongoDB, and visualizes them on an interactive map with clustering, filters, search, and rich event details.

- Frontend: React + MUI + Leaflet ([frontend/](frontend))
- Backend: Express + Mongoose ([backend/](backend))
- Worker: Python scraper for Eventbrite listing pages ([worker/](worker))

## Motivations

In my first year living downtown I kept saying, “It’s Toronto—there’s always something going on.” But when it came to "What are we doing tonight?", I’d always come up empty. Discovery felt fragmented, slow, and biased toward big, heavily promoted events. I wanted a single, fast place to answer a simple question: what’s worth doing near me, at the time and price I care about?
TorontoToday is my attempt to fix that. It pulls public event data into one source, anchors it to a map (because distance matters), and layers in search + filters that reflect how people really decide: “tonight,” “under $25,” “free,” “food,” “concerts,” etc. Instead of endless scrolling or ad-driven feeds, it aims for a 30-second path from “what should we do?” to a short, high-quality list.

Guiding principles:

Map-first discovery. Location, time, and price front and center.
Fast and honest. No paywalls, no dark patterns, no buried details—just the facts (time, venue, price, category, organizer).
Broad coverage. Big venues and small community events alike, with sensible de-duping.
Low friction. Search-as-you-type, quick filters, and a clean details drawer instead of 10 open tabs.
Ultimately, I built this to reduce decision fatigue for students, newcomers, and locals alike. If it helps you go from FOMO to “meet you there at 7” a little faster, it’s doing its job.

## Features

- Interactive map with clustering via Supercluster and Leaflet
- Sidebar with infinite list of events
- Search-as-you-type event search
- Rich event details drawer (image, time, venue, category, price, organizer, format, URL)
- Filters (Category, Format, Free-only, Date range, Max price)
- Pipeline:
  1) Worker scrapes Eventbrite listing pages to collect event IDs into Mongo
  2) Backend fetches full event details from Eventbrite API and stores them
  3) Frontend reads events from the backend and renders the UI

Key components:
- [`MapComponent`](frontend/src/components/map.jsx)
- [`SidebarComponent`](frontend/src/components/sidebar.jsx)
- [`FiltersButton`](frontend/src/components/filters.jsx)
- [`SearchBar`](frontend/src/components/searchbar.jsx)
- [`EventDetailsComponent`](frontend/src/components/eventdetails.jsx)

Backend services and models:
- [`fetchAllEvents`](backend/services/eventbrite.js)
- [`Event` model](backend/models/event.js)
- [`Event_id` model](backend/models/event_id.js)
- REST routes: [events](backend/routes/events.js), [event_ids](backend/routes/event_ids.js)

## Monorepo layout

- [frontend/](frontend) — React app (Create React App)
- [backend/](backend) — Express API server
- [worker/](worker) — Python scraper that discovers Eventbrite event IDs

## Tech stack

- React 19, MUI, Leaflet, Supercluster
- Express 5, Mongoose 8
- Python 3 + requests + BeautifulSoup4 + lxml
- MongoDB (Atlas or local)

## Notable implementation details

- Map clustering and rendering:
  - Clustering implemented in [`MapComponent`](frontend/src/components/map.jsx) using Supercluster
  - Custom cluster icons and selected marker styling
  - Auto-resize when the sidebar toggles (`MapResizeHandler`)
  - Auto-focus and restore map view when an event is selected (`MapEventFocusHandler`)
- UI/Theme:
  - Dark theme configured in [`theme.js`](frontend/src/theme.js)
  - Search and filters via [`SearchBar`](frontend/src/components/searchbar.jsx) and [`FiltersButton`](frontend/src/components/filters.jsx)
  - Sidebar list via [`SidebarComponent`](frontend/src/components/sidebar.jsx)
  - Event details drawer via [`EventDetailsComponent`](frontend/src/components/eventdetails.jsx)
- Data pipeline:
  - Worker scrapes IDs from multiple Eventbrite listing variants (today/this-week/free/etc.) and upserts into [`event_ids`](backend/models/event_id.js)
  - Backend fetches details with [`fetchAllEvents`](backend/services/eventbrite.js), maps category/format/organizer, computes price label, and stores documents in [`events`](backend/models/event.js)
  - UI consumes GET `/events`

## 
