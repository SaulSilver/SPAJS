var createWindow = require('./window');
var chatWindowCounter = 0;

var memory = document.getElementById('memory_button').addEventListener('click', function (event) {
    createWindow('games', 'memory_temp');
  }
);

var chat = document.getElementById('chat_button').addEventListener('click', function (event) {
  var socket;
  if (chatWindowCounter === 0)
        socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
    createWindow('chat', 'Chat', socket);
  }
);

