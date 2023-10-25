const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Express.js with Socket.io is running!");
});

app.get("/stream", (req, res) => {
  // const tunnel = radioStream.pipe(new stream.PassThrough());
  // console.log(backpressure);

  const filePath = __dirname + "/music/hey.mp3";

  const stats = fs.statSync(filePath);
  const range = "bytes=0-";
  const fileSize = stats.size;
  const chunkSize = 1024 * 1024;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, fileSize - 1);

  const headers = {
    "Content-Type": "audio/mpeg",
    "Content-Length": end - start,
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
  };
  // const headers = {
  //   "Content-Type": "audio/mpeg3",
  //   "Transfer-Encoding": "chunked",
  // };

  res.writeHead(206, headers);

  const radioStream = ffmpeg(fs.createReadStream(filePath))
    .audioCodec("libmp3lame")
    .format("mp3")
    .outputOptions("-movflags frag_keyframe+empty_moov")
    .on("end", () => {
      console.log("Streaming finished");
    })
    .on("error", (err) => {
      console.log(err);
    });

  radioStream.pipe(res);
});

io.of("/radio").on("connection", (socket) => {
  console.log("a user connected");

  ss(socket).on("stream", (stream, data) => {
    const filePath =
      "/Users/irvansn/Documents/web-dev/nodejs_playground/online-radio-streaming/music/hey.mp3";
    const radioStream = ffmpeg(fs.createReadStream(filePath))
      .audioCodec("libmp3lame")
      .format("mp3")
      .outputOptions("-movflags frag_keyframe+empty_moov")
      .on("end", () => {
        console.log("Streaming finished");
      })
      .on("error", (err) => {
        console.log(err);
      });

    radioStream.pipe(stream);
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Express.js with Socket.io is listening on port ${port}`);
});
