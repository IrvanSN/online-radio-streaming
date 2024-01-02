require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const server = require("https").createServer(
  {
    key: fs.readFileSync(path.join(__dirname + process.env.SSL_KEY)),
    cert: fs.readFileSync(path.join(__dirname + process.env.SSL_CERT)),
  },
  app,
);

const port = process.env.PORT || 3000;

const { createClient } = require("redis");
const indexRouter = require("./router");
const radioRouter = require("./router/radio");
const broadcastRouter = require("./router/broadcast");

const io = require("socket.io")(server);

const main = (redis, iceServers) => {
  // roomId:socketId
  // { '1': 'o7Ki_hfEprmw_TxxAAAB' }
  let broadcasters = {};
  // socketId:roomId
  // { M_IffTeKM2Zqh93FAAAJ: '4', r11ch9sVVwYGQO5lAAAL: '4' }
  let listeners = {};

  // views
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  // express routing
  app.use(express.static("public"));

  app.use("/", indexRouter);
  // listener endpoint
  app.use("/radio", radioRouter);

  // broadcaster endpoint
  app.use("/broadcast", broadcastRouter);

  // signaling
  io.on("connection", (socket) => {
    console.log("a user connected, " + socket.id);

    socket.on("register as broadcaster", (room) => {
      console.log("register as broadcaster for room", room);

      broadcasters[room] = socket.id;
      console.log("broadcasters", broadcasters);
      socket.join(room);
    });

    socket.on("register as viewer", async (user) => {
      console.log("register as viewer for room", user.room);

      await redis.incr(`room:${user.room}:online_users`);

      const chatData = await redis.zRange(`room:${user.room}:chats`, 0, -1);
      const usersOnline = await redis.get(`room:${user.room}:online_users`);
      socket.emit("live-chat-data", {
        chats: chatData.map((item) => JSON.parse(item)),
        currentListeners: parseInt(usersOnline),
      });

      socket.to(user.room).emit("current-listeners", usersOnline);

      socket.join(user.room);
      user.id = socket.id;
      listeners[socket.id] = user.room;

      socket.to(broadcasters[user.room]).emit("new viewer", user, iceServers);
    });

    socket.on("candidate", (id, event) => {
      socket.to(id).emit("candidate", socket.id, event);
    });

    socket.on("offer", (id, event) => {
      event.broadcaster.id = socket.id;
      socket.to(id).emit("offer", event.broadcaster, event.sdp, iceServers);
    });

    socket.on("answer", (event) => {
      socket.to(broadcasters[event.room]).emit("answer", socket.id, event.sdp);
    });

    // live chat events
    socket.on("new-message", async (radioId, name, message) => {
      const timestamps = new Date().getTime();

      await redis
        .zAdd(`room:${radioId}:chats`, {
          score: timestamps,
          value: JSON.stringify({
            timestamps: timestamps,
            name: name,
            message: message,
          }),
        })
        .then(() => socket.to(radioId).emit("receive-message", name, message))
        .catch((e) => console.log("gagal menyimpan data! " + e.toString()));
    });

    socket.on("disconnect", async () => {
      console.log("a user has disconnected, " + socket.id);

      // check if user is listener
      const listenerRoomJoined = listeners[socket.id];
      if (listenerRoomJoined) {
        await redis.decr(`room:${listeners[socket.id]}:online_users`);

        const usersOnline = await redis.get(
          `room:${listeners[socket.id]}:online_users`,
        );
        socket.to(listeners[socket.id]).emit("current-listeners", usersOnline);

        delete listeners[socket.id];
      }
    });
  });

  // listener
  server.listen(port, () => {
    console.log(`Server listening on https://localhost:${port}`);
  });
};

const startRedis = (iceServers) => {
  createClient({
    url: process.env.REDIS_SERVER_URL,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()
    .then((redis) => main(redis, iceServers))
    .catch((e) => console.log("start redis error!", e));
};

fetch(`https://global.xirsys.net/_turn/${process.env.ICE_STUN_API_CHANNEL}`, {
  method: "PUT",
  headers: {
    Authorization:
      "Basic " +
      btoa(
        `${process.env.ICE_STUN_API_IDENT}:${process.env.ICE_STUN_API_SECRET}`,
      ),
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ format: "urls" }),
})
  .then((response) => response.json())
  .then((res) => startRedis(res.v.iceServers));
