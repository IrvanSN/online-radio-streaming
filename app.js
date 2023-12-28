require('dotenv').config()
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path")
const server = require("https").createServer(
    {
      key: fs.readFileSync(
          path.join(__dirname + process.env.SSL_KEY)
      ),
      cert: fs.readFileSync(
          path.join(__dirname + process.env.SSL_CERT)
      ),
    },
    app
);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

const radioRouter = require("./router/radio")
const broadcastRouter = require('./router/broadcast')

let broadcasters = {};

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express routing
app.use(express.static("public"));

// radio endpoint
app.use('/radio', radioRouter)
app.use('/broadcast', broadcastRouter)

// signaling
io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("register as broadcaster", function (room) {
    console.log("register as broadcaster for room", room);

    broadcasters[room] = socket.id;

    socket.join(room);
  });

  socket.on("register as viewer", function (user) {
    console.log("register as viewer for room", user.room);

    socket.join(user.room);
    user.id = socket.id;

    socket.to(broadcasters[user.room]).emit("new viewer", user);
  });

  socket.on("candidate", function (id, event) {
    socket.to(id).emit("candidate", socket.id, event);
  });

  socket.on("offer", function (id, event) {
    event.broadcaster.id = socket.id;
    socket.to(id).emit("offer", event.broadcaster, event.sdp);
  });

  socket.on("answer", function (event) {
    socket.to(broadcasters[event.room]).emit("answer", socket.id, event.sdp);
  });
});

// listener
server.listen(port, function () {
  console.log(`Server listening on https://localhost:${port}`);
});
