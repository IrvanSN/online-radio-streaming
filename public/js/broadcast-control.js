let isBroadcasting = false;
const broadcastCtrlBtn = document.getElementById("broadcast-control");
let isAudioMonitorMuted = false;
const audioMonitorCtrlBtn = document.getElementById("audio-monitor-control");

// Source Control
let musicVolume = 50;
const musicVolumeInput = document.getElementById("music-volume-range");
let isMusicMuted = false;
const musicCtrlBtn = document.getElementById("music-mute-control");

let micVolume = 50;
const micVolumeInput = document.getElementById("mic-volume-range");
let isMicMuted = false;
const micCtrlBtn = document.getElementById("mic-mute-control");

broadcastCtrlBtn.addEventListener("click", () => {
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
        isAudioMonitorMuted = true;
        audioMonitorCtrlBtn.innerHTML = "Unmute";
    }

    console.log("isAudioMonitorMuted", isAudioMonitorMuted);
});

musicVolumeInput.addEventListener(
    "input",
    () => (musicVolume = musicVolumeInput.value),
);

musicCtrlBtn.addEventListener("click", () => {
    if (isMusicMuted) {
        musicCtrlBtn.classList.replace(
            "bg-picton-blue-500",
            "bg-radical-red-500",
        );
        musicCtrlBtn.classList.replace(
            "hover:bg-picton-blue-600",
            "hover:bg-radical-red-600",
        );
        musicCtrlBtn.classList.replace(
            "focus:ring-picton-blue-400",
            "focus:ring-radical-red-400",
        );
        isMusicMuted = false;
        musicCtrlBtn.innerHTML = "Mute";
    } else {
        musicCtrlBtn.classList.replace(
            "bg-radical-red-500",
            "bg-picton-blue-500",
        );
        musicCtrlBtn.classList.replace(
            "hover:bg-radical-red-600",
            "hover:bg-picton-blue-600",
        );
        musicCtrlBtn.classList.replace(
            "focus:ring-radical-red-400",
            "focus:ring-picton-blue-400",
        );
        isMusicMuted = true;
        musicCtrlBtn.innerHTML = "Unmute";
    }

    console.log("isMusicMuted", isMusicMuted);
});

micVolumeInput.addEventListener(
    "input",
    () => (micVolume = micVolumeInput.value),
);

micCtrlBtn.addEventListener("click", () => {
    if (isMicMuted) {
        micCtrlBtn.classList.replace(
            "bg-picton-blue-500",
            "bg-radical-red-500",
        );
        micCtrlBtn.classList.replace(
            "hover:bg-picton-blue-600",
            "hover:bg-radical-red-600",
        );
        micCtrlBtn.classList.replace(
            "focus:ring-picton-blue-400",
            "focus:ring-radical-red-400",
        );
        isMicMuted = false;
        micCtrlBtn.innerHTML = "Mute";
    } else {
        micCtrlBtn.classList.replace(
            "bg-radical-red-500",
            "bg-picton-blue-500",
        );
        micCtrlBtn.classList.replace(
            "hover:bg-radical-red-600",
            "hover:bg-picton-blue-600",
        );
        micCtrlBtn.classList.replace(
            "focus:ring-radical-red-400",
            "focus:ring-picton-blue-400",
        );
        isMicMuted = true;
        micCtrlBtn.innerHTML = "Unmute";
    }

    console.log("isMicMuted", isMicMuted);
});
