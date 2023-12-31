const emptyPlaylistNotification = document.getElementById("music-empty");
const playlistUploadInput = document.getElementById("upload-playlist");

const createMediaStreamObject = (buffer) => {
  const source = context.createBufferSource();
  source.buffer = buffer;
  const destination = context.createMediaStreamDestination();
  source.start(0);
  const audioConnect = source.connect(destination);
  const audioTrack = audioConnect.stream.getAudioTracks()[0];
  audioTrack.contentHint = "music";

  return audioTrack;
};

const createDeleteElement = (trackId, index) => {
  console.log("index (created)", index);
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.innerHTML = `
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                              </svg>
                          `;
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

const createPlayElement = () => {
  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                               stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                          </svg>
                        `;
  playBtn.addEventListener("click", () => {
    console.log(`play btn`);
  });

  return playBtn;
};

// TODO
const mediaData = document.getElementById("media-data");
mediaData.addEventListener("click", () => {
  console.log("musicMediaStreams data", musicMediaStreams);
  console.log("playlistUploadInput.files", playlistUploadInput.files);
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
            const currentRowLength = musicMediaStreams.length;
            const mediaStream = createMediaStreamObject(buffer);
            const id = mediaStream.id;

            musicMediaStreams.push({
              id,
              title: file.name,
              mediaStream,
            });

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
            listRow.classList.add("flex", "flex-row", "gap-4");

            wrapperContainer.appendChild(titleList);
            wrapperContainer.appendChild(listRow);

            const deleteBtnElement = createDeleteElement(id, currentRowLength);
            const playBtnElement = createPlayElement();

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
