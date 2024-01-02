const newChatBtn = document.getElementById("new-chat-btn");
const onSubmitChat = document.getElementById("on-submit-chat");

const addMessageToChatBox = ({ name, message }) => {
  const chatBox = document.getElementById("chat-box");
  const messageElement = `<p>${name}${message}</p>`;
  chatBox.innerHTML += messageElement;
  chatBox.scrollTop = chatBox.scrollHeight;
};

const handleNewChat = () => {
  let message = document.getElementById("new-chat").value;
  let name = document.getElementById("name-chat").value;

  message =
    userRole === "broadcaster"
      ? `<span class="text-radical-red-500">${message}</span>`
      : `<span>${message}</span>`;

  name =
    userRole === "broadcaster"
      ? `<span class="mr-4 font-semibold text-radical-red-500">Penyiar</span>`
      : `<span class="mr-4 font-semibold">${name}</span>`;

  document.getElementById("new-chat").value = "";

  socket.emit("new-message", radioId, name, message);
  addMessageToChatBox({ name, message });
};

newChatBtn.addEventListener("click", handleNewChat);
onSubmitChat.addEventListener("submit", (event) => event.preventDefault());

socket.on("receive-message", (name, message) => {
  addMessageToChatBox({ name, message });
});

socket.on("live-chat-data", ({ chats, currentListeners }) => {
  const chatBox = document.getElementById("chat-box");
  document.getElementById("current-listeners").innerHTML = currentListeners;
  chats.map((item) => {
    const messageElement = `<p>${item.name}${item.message}</p>`;
    chatBox.innerHTML += messageElement;
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("current-listeners", (count) => {
  document.getElementById("current-listeners").innerHTML = count;
});
