// api/cron.js
import { waitUntil } from "@vercel/functions";

export default async function handler(req, res) {
  // Fire-and-forget: ping your Render service in background
  waitUntil(
    fetch("https://torontotoday-worker.onrender.com/run-task", {
      method: "POST",
    }).catch(() => {})
  );

  // Respond instantly so cron job never times out
  res.status(204).end();
}
