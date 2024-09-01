// server.js
const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000; // You can change the port if needed

app.prepare().then(() => {
  const server = express();

  // Create HTTP server and bind Socket.IO to it
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // Allow CORS for your frontend
      methods: ["GET", "POST"],
    },
  });

  // Setup Socket.IO connection
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Example event handler
    socket.on("message", (msg) => {
      console.log("Message received: ", msg);
      // Broadcast to all connected clients
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  // Handle Next.js requests
  server.all("*", (req, res) => handle(req, res));

  // Start server
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
