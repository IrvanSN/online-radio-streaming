const emptyPlaylistNotification = document.getElementById("music-empty");
const playlistUploadInput = document.getElementById("upload-playlist");

const playlistAudioBuffers = [];
// const audioCtx = new AudioContext();

const createAudioBuffer = (buffer) => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.start(0);
  playlistAudioBuffers.push(source);
  // const destination = audioCtx.createMediaStreamDestination();
  // const audioMediaStream = source.connect(destination);
};

const deleteIcon = `
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                              </svg>
                          `;
const createDeleteElement = (trackId) => {
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.innerHTML = deleteIcon;
  deleteBtn.addEventListener("click", () => {
    musicMediaStreams = musicMediaStreams.filter((item) => item.id !== trackId);

    if (musicMediaStreams.length === 0) {
      emptyPlaylistNotification.hidden = false;
    }

    const parentElement = document.getElementById(trackId);
    parentElement.remove();
  });

  return deleteBtn;
};

const playIcon = `
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                               stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                          </svg>
                        `;
const createPlayElement = (index) => {
  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.innerHTML = playIcon;
  playBtn.addEventListener("click", () => {
    handleMusicChanges(index);
  });

  return playBtn;
};

// TODO
const mediaData = document.getElementById("media-data");
mediaData.addEventListener("click", () => {
  console.log("musicMediaStreams data", musicMediaStreams);
  console.log("playlistUploadInput.files", playlistUploadInput.files);
  console.log("playlistAudioBuffers", playlistAudioBuffers);
});

playlistUploadInput.addEventListener("change", () => {
  const { files } = playlistUploadInput;

  if (files.length > 0) {
    const tempFiles = Array.from(files);
    playlistUploadInput.value = "";
    emptyPlaylistNotification.hidden = true;

    tempFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        context
          .decodeAudioData(readEvent.target.result)
          .then((buffer) => {
            const currentRowLength = playlistAudioBuffers.length;
            createAudioBuffer(buffer);
            const id = new Date().getTime().toString();

            const wrapperElement = document.createElement("div");
            wrapperElement.id = id;

            const wrapperContainer = document.createElement("div");
            wrapperContainer.classList.add(
              "flex",
              "flex-row",
              "justify-between",
              "py-2",
              "px-4",
            );

            const separator = document.createElement("hr");

            wrapperElement.appendChild(wrapperContainer);
            wrapperElement.appendChild(separator);

            const titleList = document.createElement("p");
            titleList.innerHTML = file.name;

            const listRow = document.createElement("div");
            listRow.classList.add("flex", "flex-row", "gap-3");

            wrapperContainer.appendChild(titleList);
            wrapperContainer.appendChild(listRow);

            const deleteBtnElement = createDeleteElement(id);
            const playBtnElement = createPlayElement(currentRowLength);

            listRow.appendChild(deleteBtnElement);
            listRow.appendChild(playBtnElement);

            const playlistBox = document.getElementById("playlist-box");
            playlistBox.appendChild(wrapperElement);
          })
          .catch((e) => console.log("error", e));
      };

      reader.readAsArrayBuffer(file);
    });
  }
});
