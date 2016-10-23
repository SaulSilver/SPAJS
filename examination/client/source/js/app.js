var createWindow = require('./window');

//For the Memory game
var memory = document.getElementById('memory_button').addEventListener('click', function (event) {
  createWindow('games', 'memory_temp');
});

//For the Chat app
var chat = document.getElementById('chat_button').addEventListener('click', function (event) {
  createWindow('chat', 'Chat');
});

//For the Gallery app
var gallery = document.getElementById('gallery_button').addEventListener('click', function (event) {
  createWindow('tab', 'gallery');
});

