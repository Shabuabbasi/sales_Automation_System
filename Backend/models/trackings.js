const Tracking = require("../models/Tracking"); // create schema if needed

events.forEach(async (event) => {
  await Tracking.create({
    email: event.email,
    event: event.event,
    timestamp: new Date(event.timestamp * 1000), // convert UNIX
  });
});
