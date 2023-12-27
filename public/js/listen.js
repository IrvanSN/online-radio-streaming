const radioId = document.getElementById('radioId').value
console.log('radioId', radioId)
const audioStream = document.getElementById('audio-stream')
const playPauseBtn = document.getElementById('play-pause-btn')
const musicContainer = document.getElementById("music-container")

let isPlay = true;
musicContainer.classList.add("play-pause-btn");
playPauseBtn.querySelector("i.fas").classList.remove("fa-play");
playPauseBtn.querySelector("i.fas").classList.add("fa-pause");
let user;
let rtcPeerConnections = {};

// constants
const iceServers = {
//   TODO
  iceServers: [
    {
      urls: ["stun:ss-turn1.xirsys.com"],
    },
    {
      username:
          "AmBgp9EwD9Yun3B0fGZUx-bpxJZC_OlKLAEB8yGtnFiH1VmkSJCO-8KRYa7MsyouAAAAAGU6jkhpcnZhbnNu",
      credential: "7b113ad4-7419-11ee-be6b-0242ac140004",
      urls: [
        "turn:ss-turn1.xirsys.com:80?transport=udp",
        // "turn:ss-turn1.xirsys.com:3478?transport=udp",
        "turn:ss-turn1.xirsys.com:80?transport=tcp",
        // "turn:ss-turn1.xirsys.com:3478?transport=tcp",
        // "turns:ss-turn1.xirsys.com:443?transport=tcp",
        // "turns:ss-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ]
};

let socket = io();

playPauseBtn.addEventListener('click', () => {
  if (isPlay) {
    isPlay = false;
    audioStream.pause()
    musicContainer.classList.remove("play-pause-btn");
    playPauseBtn.querySelector("i.fas").classList.add("fa-play");
    playPauseBtn.querySelector("i.fas").classList.remove("fa-pause");
  } else {
    isPlay = true;
    audioStream.play()
    musicContainer.classList.add("play-pause-btn");
    playPauseBtn.querySelector("i.fas").classList.remove("fa-play");
    playPauseBtn.querySelector("i.fas").classList.add("fa-pause");
  }
})

user = {
  room: radioId,
  name: 'a'
}

socket.emit("register as viewer", user);

socket.on("candidate", function (id, event) {
  console.log("b", id);
  console.log("b", rtcPeerConnections);
  let candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });
  rtcPeerConnections[id].addIceCandidate(candidate);
});

socket.on("offer", function (broadcaster, sdp) {
  console.log("c", broadcaster.id);
  console.log("c", rtcPeerConnections);
  rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(iceServers);

  rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp);

  rtcPeerConnections[broadcaster.id]
      .createAnswer()
      .then((sessionDescription) => {
        rtcPeerConnections[broadcaster.id].setLocalDescription(
            sessionDescription
        );
        socket.emit("answer", {
          type: "answer",
          sdp: sessionDescription,
          room: user.room,
        });
      });

  rtcPeerConnections[broadcaster.id].ontrack = (event) => {
    audioStream.srcObject = event.streams[0];
    audioStream.play()
  };

  rtcPeerConnections[broadcaster.id].onicecandidate = (event) => {
    if (event.candidate) {
      console.log("sending ice candidate");
      socket.emit("candidate", broadcaster.id, {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    }
  };
})
