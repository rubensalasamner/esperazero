const express = require("express")
const next = require("next")
const http = require("http")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express()

    const httpServer = http.createServer(server)
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })
    io.on("connection", (socket) => {
      console.log("A user has connected", socket.id);

      socket.on("message", (msg) => {
        console.log("Message recived:" , msg);

        io.emit("message", msg)
      });

      socket.on("disconnect", () => {
        console.log("User left the queue", socket.io)
      })
    })

    server.all("*", (req, res) => handle(req, res));

    httpServer.listen(port, (err) => {
      if (err) throw err;
      console.log(`Ready on htttp://localhost${port}`)
    })
  })

