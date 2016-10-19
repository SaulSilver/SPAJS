var createWindow = require('./window');

var memory = document.getElementById('memory_button');
memory.addEventListener('click', function (event) {

    createWindow();
  }
);

var chat = document.getElementById('chat_button');
chat.addEventListener('click', function (event) {
    startChat;
    createWindow();
  }
);

function startChat() {

}
