const radioId = document.getElementById('radioId').value
console.log('radioId', radioId)
const audioStream = document.getElementById('audio-stream')
const playPauseBtn = document.getElementById('play-pause-btn')

let isPlay = true;
let user;
let rtcPeerConnections = {};

// constants
const iceServers = {
//   TODO
};

let socket = io();

playPauseBtn.addEventListener('click', () => {
  if (isPlay) {
    isPlay = false;
    audioStream.pause()
  } else {
    isPlay = true;
    audioStream.play()
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
