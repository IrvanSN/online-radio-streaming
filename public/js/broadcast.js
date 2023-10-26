const radioId = document.getElementById('radioId').value
const radioName = document.getElementById('radioName').value
console.log('radioId', radioId)
const btnStartBroadcast = document.getElementById('broadcast-btn')
const fileInput = document.getElementById('audio-input')
const status = document.getElementById('status')
const audioStream = document.getElementById('audio-stream')

// Monitoring Audio for Broadcasting
const audioMonitor = document.getElementById('audio-monitor')
const muteAudioMonitor = document.getElementById('mute-audio-monitor')
const unmuteAudioMonitor = document.getElementById('unmute-audio-monitor')

// variables
let user;
let rtcPeerConnections = {};
const context = new AudioContext();

// constants
const iceServers = {
//  TODO
    
};

let socket = io();

btnStartBroadcast.addEventListener('click', () => {
  // let audioTrack;
  const file = fileInput.files[0]
  user = {
    room: radioId,
    name: radioName
  }

  if (!file) {
    return alert("Please insert audio file!")
  }

  console.log('file', file)

  const reader = new FileReader()
  console.log('reader', reader)

  reader.onload = ((readEvent) => {
    console.log('read', readEvent)
    setStatus("Processing audio file...")
    context.decodeAudioData(readEvent.target.result)
        .then((buffer) => {
          const source = context.createBufferSource();
          source.buffer = buffer
          const destination = context.createMediaStreamDestination();
          source.start(0);
          const audioConnect = source.connect(destination)
          const audioTrack = audioConnect.stream.getAudioTracks()[0]

          const localStream = new MediaStream()
          localStream.addTrack(audioTrack)
          audioStream.srcObject = localStream
          audioMonitor.srcObject = localStream
          audioMonitor.play()
          setStatus("Ready to broadcast...")
          socket.emit("register as broadcaster", user.room);
        })
        .catch(e => setStatus(`Failed processing audio file. ${e}`))
  })

  reader.readAsArrayBuffer(file);
})

// handler
const setStatus = (message) => {
  status.innerHTML = `Status: ${message}`
}

muteAudioMonitor.addEventListener('click', () => {
  audioMonitor.muted = true
})

unmuteAudioMonitor.addEventListener('click', () => {
  audioMonitor.muted = false
})

// socket message handlers
socket.on("new viewer", function (viewer) {
  console.log("a", viewer.id);
  console.log("a", rtcPeerConnections);
  rtcPeerConnections[viewer.id] = new RTCPeerConnection(iceServers);

  const stream = audioStream.srcObject;
  stream
      .getTracks()
      .forEach((track) => rtcPeerConnections[viewer.id].addTrack(track, stream))

  rtcPeerConnections[viewer.id].onicecandidate = (event) => {
    if (event.candidate) {
      console.log("sending ice candidate");
      socket.emit("candidate", viewer.id, {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    }
  };

  rtcPeerConnections[viewer.id]
      .createOffer()
      .then((sessionDescription) => {
        rtcPeerConnections[viewer.id].setLocalDescription(sessionDescription);
        socket.emit("offer", viewer.id, {
          type: "offer",
          sdp: sessionDescription,
          broadcaster: user,
        });
      })
      .catch((error) => {
        console.log(error);
      });
})

socket.on("candidate", function (id, event) {
  console.log("b", id);
  console.log("b", rtcPeerConnections);
  let candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });
  console.log(candidate)
  rtcPeerConnections[id].addIceCandidate(candidate);
});

socket.on("answer", function (viewerId, event) {
  console.log("d", viewerId);
  console.log("d", rtcPeerConnections);
  rtcPeerConnections[viewerId].setRemoteDescription(
      new RTCSessionDescription(event)
  );
});
