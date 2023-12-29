const newChatBtn = document.getElementById('new-chat-btn')
const onSubmitChat = document.getElementById('on-submit-chat')

const addMessageToChatBox = ({name, message}) => {
  const chatBox = document.getElementById('chat-box')
  const messageElement = `<p><span class="mr-4 font-semibold">${name}</span><span>${message}</span></p>`
  chatBox.innerHTML += messageElement
  chatBox.scrollTop = chatBox.scrollHeight
}

const handleNewChat = () => {
  const message = document.getElementById('new-chat').value
  const name = document.getElementById('name-chat').value
  document.getElementById('new-chat').value = ''
  socket.emit('new-message', radioId, name, message)
  addMessageToChatBox({name, message})
}

newChatBtn.addEventListener('click', handleNewChat)
onSubmitChat.addEventListener('submit', (event) => event.preventDefault())

socket.on('receive-message', (name, message) => {
  addMessageToChatBox({name, message})
})

