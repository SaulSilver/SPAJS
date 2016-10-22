var createWindow = require('./window');


var memory = document.getElementById('memory_button').addEventListener('click', function (event) {
  createWindow('games', 'memory_temp');
});

var chat = document.getElementById('chat_button').addEventListener('click', function (event) {
  createWindow('chat', 'Chat');
});

var todo = document.getElementById('todo_button').addEventListener('click', function (event) {
  createWindow('todo', 'todo');
});

