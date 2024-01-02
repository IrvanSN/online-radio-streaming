let rtcPeerConnections = {};

socket.emit("broadcaster get chat data", radioId);

// socket message handlers
socket.on("new viewer", async (viewer, iceServers) => {
  rtcPeerConnections[viewer.id] = new RTCPeerConnection({
    iceServers: [iceServers],
  });

  const stream = audioStream.srcObject;
  stream
    .getTracks()
    .forEach((track) => rtcPeerConnections[viewer.id].addTrack(track, stream));

  rtcPeerConnections[viewer.id].onicecandidate = (event) => {
    if (event.candidate) {
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
});

socket.on("candidate", (id, event) => {
  let candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });

  rtcPeerConnections[id].addIceCandidate(candidate);
});

socket.on("answer", (viewerId, event) => {
  rtcPeerConnections[viewerId].setRemoteDescription(
    new RTCSessionDescription(event),
  );
});
