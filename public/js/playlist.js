const emptyPlaylistNotification = document.getElementById("music-empty");
const playlistUploadInput = document.getElementById("upload-playlist");
const musicPlayingTitle = document.getElementById("music-playing-title");

const audioCtx = new AudioContext();

const playlistAudioBuffers = [];

const deleteIcon = `
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                              </svg>
                          `;
const createDeleteElement = (trackId, currentRowLength) => {
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.innerHTML = deleteIcon;
  deleteBtn.addEventListener("click", () => {
    playlistAudioBuffers.splice(currentRowLength, 1);

    if (playlistAudioBuffers.length === 0) {
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
const pauseIcon = `
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                          </svg>
                          `;
const createPlayElement = (index) => {
  const playBtn = document.createElement("button");
  playBtn.classList.add("btn-music-control");
  playBtn.type = "button";
  playBtn.innerHTML = playIcon;
  playBtn.addEventListener("click", () => {
    handleMusicChanges(index);
  });

  return playBtn;
};

playlistUploadInput.addEventListener("change", () => {
  const { files } = playlistUploadInput;

  if (files.length > 0) {
    const tempFiles = Array.from(files);
    playlistUploadInput.value = "";
    emptyPlaylistNotification.hidden = true;

    tempFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        audioCtx
          .decodeAudioData(readEvent.target.result)
          .then((buffer) => {
            const currentRowLength = playlistAudioBuffers.length;
            playlistAudioBuffers.push(buffer);
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
            titleList.classList.add("music-title");
            titleList.innerHTML = file.name;

            const listRow = document.createElement("div");
            listRow.classList.add("flex", "flex-row", "gap-3");

            wrapperContainer.appendChild(titleList);
            wrapperContainer.appendChild(listRow);

            const deleteBtnElement = createDeleteElement(id, currentRowLength);
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
