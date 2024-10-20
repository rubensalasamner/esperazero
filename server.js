const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("message", (msg) => {
      console.log("Message received: ", msg);
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  server.all("*", (req, res) => handle(req, res));

  // Update this line to listen on all interfaces
  httpServer.listen(port, "0.0.0.0", (err) => {
    if (err) throw (err, console.log(`> Ready on http://0.0.0.0:${port}`));
  });
});
