let isBroadcasting = false;
const broadcastCtrlBtn = document.getElementById("broadcast-control");
let isAudioMonitorMuted = false;
const audioMonitorCtrlBtn = document.getElementById("audio-monitor-control");

const audioContext = new AudioContext();
const stream = audioContext.createMediaStreamDestination();

const audioMonitor = document.getElementById("audio-monitor");
audioMonitor.srcObject = stream.stream;
audioMonitor.play();

// Source Control
const musicAudioGain = audioContext.createGain();
let currentMusicMediaStreamSource;
let currentMusicAudioGain = 50;
musicAudioGain.gain.value = currentMusicAudioGain / 100;
const musicVolumeInput = document.getElementById("music-volume-range");
let isMusicMuted = false;
const musicCtrlBtn = document.getElementById("music-mute-control");

const micAudioGain = audioContext.createGain();
let currentMicAudioGain = 50;
micAudioGain.gain.value = currentMicAudioGain / 100;
const micVolumeInput = document.getElementById("mic-volume-range");
let isMicMuted = false;
const micCtrlBtn = document.getElementById("mic-mute-control");

const handleMicStream = (mediaStream) => {
  const micMediaStreamSource =
    audioContext.createMediaStreamSource(mediaStream);

  micMediaStreamSource.connect(micAudioGain);
  micAudioGain.connect(stream);
  console.log("mic ready");
};

navigator.mediaDevices
  .getUserMedia({ video: false, audio: true })
  .then((mediaStream) => {
    handleMicStream(mediaStream);
  })
  .catch((err) => {
    console.error(`got an error: ${err}`);
  });

const handleMusicChanges = (index) => {
  const mediaStream = new MediaStream();
  const buffer = playlistAudioBuffers[index];
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.start(0);
  source.addEventListener("ended", () =>
    playlistAudioBuffers.length - 1 !== index
      ? handleMusicChanges(index + 1)
      : null,
  );

  if (currentMusicMediaStreamSource) {
    // currentMusicMediaStreamSource.mediaStream
    //   .getAudioTracks()
    //   .forEach((item) =>
    //     currentMusicMediaStreamSource.mediaStream.removeTrack(item),
    //   );
    currentMusicMediaStreamSource.disconnect();
  }

  const destination = audioContext.createMediaStreamDestination();
  const musicMediaStream = source.connect(destination);

  // const audioTrack = generateAudioTracks(index);
  mediaStream.addTrack(musicMediaStream.stream.getAudioTracks()[0]);

  currentMusicMediaStreamSource =
    audioContext.createMediaStreamSource(mediaStream);

  currentMusicMediaStreamSource.connect(musicAudioGain);
  musicAudioGain.connect(stream);

  musicPlayingTitle.innerHTML =
    document.querySelectorAll(".music-title")[index].innerHTML;
};

broadcastCtrlBtn.addEventListener("click", () => {
  console.log("================================");
  console.log("================================");
  if (isBroadcasting) {
    broadcastCtrlBtn.classList.replace(
      "bg-radical-red-500",
      "bg-picton-blue-500",
    );
    broadcastCtrlBtn.classList.replace(
      "hover:bg-radical-red-600",
      "hover:bg-picton-blue-600",
    );
    broadcastCtrlBtn.classList.replace(
      "focus:ring-radical-red-400",
      "focus:ring-picton-blue-400",
    );
    isBroadcasting = false;
    broadcastCtrlBtn.innerHTML = "Start Now";
  } else {
    broadcastCtrlBtn.classList.replace(
      "bg-picton-blue-500",
      "bg-radical-red-500",
    );
    broadcastCtrlBtn.classList.replace(
      "hover:bg-picton-blue-600",
      "hover:bg-radical-red-600",
    );
    broadcastCtrlBtn.classList.replace(
      "focus:ring-picton-blue-400",
      "focus:ring-radical-red-400",
    );
    isBroadcasting = true;
    broadcastCtrlBtn.innerHTML = "Stop Now";
  }

  console.log("isBroadcasting", isBroadcasting);
});

audioMonitorCtrlBtn.addEventListener("click", () => {
  if (isAudioMonitorMuted) {
    audioMonitorCtrlBtn.classList.replace(
      "bg-picton-blue-500",
      "bg-radical-red-500",
    );
    audioMonitorCtrlBtn.classList.replace(
      "hover:bg-picton-blue-600",
      "hover:bg-radical-red-600",
    );
    audioMonitorCtrlBtn.classList.replace(
      "focus:ring-picton-blue-400",
      "focus:ring-radical-red-400",
    );

    audioMonitor.muted = false;
    isAudioMonitorMuted = false;
    audioMonitorCtrlBtn.innerHTML = "Mute";
  } else {
    audioMonitorCtrlBtn.classList.replace(
      "bg-radical-red-500",
      "bg-picton-blue-500",
    );
    audioMonitorCtrlBtn.classList.replace(
      "hover:bg-radical-red-600",
      "hover:bg-picton-blue-600",
    );
    audioMonitorCtrlBtn.classList.replace(
      "focus:ring-radical-red-400",
      "focus:ring-picton-blue-400",
    );

    audioMonitor.muted = true;
    isAudioMonitorMuted = true;
    audioMonitorCtrlBtn.innerHTML = "Unmute";
  }

  console.log("isAudioMonitorMuted", isAudioMonitorMuted);
});

musicVolumeInput.addEventListener("input", () => {
  currentMusicAudioGain = musicVolumeInput.value;
  musicAudioGain.gain.value = musicVolumeInput.value / 100;
});

musicCtrlBtn.addEventListener("click", () => {
  if (isMusicMuted) {
    musicCtrlBtn.classList.replace("bg-picton-blue-500", "bg-radical-red-500");
    musicCtrlBtn.classList.replace(
      "hover:bg-picton-blue-600",
      "hover:bg-radical-red-600",
    );
    musicCtrlBtn.classList.replace(
      "focus:ring-picton-blue-400",
      "focus:ring-radical-red-400",
    );

    musicAudioGain.gain.value = currentMusicAudioGain / 100;
    musicVolumeInput.value = currentMusicAudioGain;
    musicVolumeInput.disabled = false;
    isMusicMuted = false;
    musicCtrlBtn.innerHTML = "Mute";
  } else {
    musicCtrlBtn.classList.replace("bg-radical-red-500", "bg-picton-blue-500");
    musicCtrlBtn.classList.replace(
      "hover:bg-radical-red-600",
      "hover:bg-picton-blue-600",
    );
    musicCtrlBtn.classList.replace(
      "focus:ring-radical-red-400",
      "focus:ring-picton-blue-400",
    );

    musicAudioGain.gain.value = 0;
    musicVolumeInput.value = 0;
    musicVolumeInput.disabled = true;
    isMusicMuted = true;
    musicCtrlBtn.innerHTML = "Unmute";
  }

  console.log("isMusicMuted", isMusicMuted);
});

micVolumeInput.addEventListener("input", () => {
  currentMicAudioGain = micVolumeInput.value;
  micAudioGain.gain.value = micVolumeInput.value / 100;
});

micCtrlBtn.addEventListener("click", () => {
  if (isMicMuted) {
    micCtrlBtn.classList.replace("bg-picton-blue-500", "bg-radical-red-500");
    micCtrlBtn.classList.replace(
      "hover:bg-picton-blue-600",
      "hover:bg-radical-red-600",
    );
    micCtrlBtn.classList.replace(
      "focus:ring-picton-blue-400",
      "focus:ring-radical-red-400",
    );

    micAudioGain.gain.value = currentMicAudioGain / 100;
    micVolumeInput.value = currentMicAudioGain;
    micVolumeInput.disabled = false;
    isMicMuted = false;
    micCtrlBtn.innerHTML = "Mute";
  } else {
    micCtrlBtn.classList.replace("bg-radical-red-500", "bg-picton-blue-500");
    micCtrlBtn.classList.replace(
      "hover:bg-radical-red-600",
      "hover:bg-picton-blue-600",
    );
    micCtrlBtn.classList.replace(
      "focus:ring-radical-red-400",
      "focus:ring-picton-blue-400",
    );

    micAudioGain.gain.value = 0;
    micVolumeInput.value = 0;
    micVolumeInput.disabled = true;
    isMicMuted = true;
    micCtrlBtn.innerHTML = "Unmute";
  }

  console.log("isMicMuted", isMicMuted);
});
