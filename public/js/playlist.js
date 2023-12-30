btnStartBroadcast.addEventListener('click', () => {
  user = {
    room: radioId,
    name: radioName
  }
  const {files} = fileInput

  for (let i = 0; i < files.length; i++) {
    console.log(files[i].name)
    const reader = new FileReader()
    reader.onload = ((readEvent) => {
      context.decodeAudioData(readEvent.target.result)
          .then(buffer => {
            const source = context.createBufferSource();
            source.buffer = buffer
            const destination = context.createMediaStreamDestination();
            source.start(0);
            const audioConnect = source.connect(destination)
            const audioTrack = audioConnect.stream.getAudioTracks()[0]
            audioTrack.contentHint = 'music'

            audioTracks.push({
              title: files[i].name,
              audioTrack
            })
            // localStream.addTrack(audioTrack)
          })
    })

    reader.readAsArrayBuffer(files[i])
  }

  audioStream.srcObject = localStream
  audioMonitor.srcObject = localStream
  audioMonitor.play()
  setStatus("Ready to broadcast...")
  socket.emit("register as broadcaster", user.room);
})
