const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const { fetchAllEvents } = require("../services/eventbrite");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json({
      count: events.length,
      events: events,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one event
router.get("/:id", getEvent, (req, res) => {
  res.json(req.event);
});

// Delete one event
router.delete("/:id", getEvent, async (req, res) => {
  try {
    await req.event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all events
router.delete("/", async (req, res) => {
  try {
    const result = await Event.deleteMany({});
    res.json({ message: `${result.deletedCount} events deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getEvent(req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: "Cannot find event" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  req.event = event;
  next();
}

// Fetch all events at given venues
router.post("/fetch-events/", (req, res) => {
  lastFetch = {
    startedAt: new Date(),
    finishedAt: null,
    ok: null,
    result: null,
    error: null,
  };
  res.status(202).json({
    ok: true,
    message: "Fetch started",
    startedAt: lastFetch.startedAt,
  });

  // Run in background
  setImmediate(async () => {
    try {
      const result = await fetchAllEvents(10);
      const payload = {
        upsertedCount: result?.upsertedCount ?? 0,
        modifiedCount: result?.modifiedCount ?? 0,
        processedEvents: result?.processedEvents ?? 0,
        rateLimit: !!result?.error,
      };
      lastFetch = {
        ...lastFetch,
        finishedAt: new Date(),
        ok: true,
        result: payload,
        error: null,
      };
      console.log("Fetch finished:", payload);
    } catch (err) {
      lastFetch = {
        ...lastFetch,
        finishedAt: new Date(),
        ok: false,
        result: null,
        error: err.message || String(err),
      };
      console.error("fetch-events failed:", err);
    }
  });
});

module.exports = router;
