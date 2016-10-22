(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./window":4}],2:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-21.
 */
module.exports = function (username, windowDiv) {
  var socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');

  var chat_temp = document.importNode(document.getElementById('chat_temp').content.firstElementChild, true);
  windowDiv.appendChild(chat_temp);

  var socketStatus = chat_temp.firstElementChild;
  var messagesList = chat_temp.getElementsByClassName('messages')[0];
  var textField = chat_temp.getElementsByClassName('text_msg')[0];
  var send_button = chat_temp.getElementsByClassName('send_button')[0];
  var username_button = chat_temp.getElementsByClassName('username_button')[0];
  var msgsDiv = chat_temp.getElementsByClassName('msgs_div')[0];

  //Adding the Close listener
  var close = windowDiv.getElementsByClassName('close_a')[0];
  close.addEventListener('click', function (e) {
    socket.close();
  });

  // Show a connected message when the WebSocket is opened
  socket.onopen = function(event) {

  };

  // Handle any errors that occur
  socket.onerror = function(error) {
    socketStatus('WebSocket Error: ' + error);
  };

  // Send a message when the button is clicked
  send_button.addEventListener('click', function (event) {
    var message = {
      type: "message",
      data: textField.value,
      username: username,
      channel: "my, not so secret, channel",
      key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
    };
    socket.send(JSON.stringify(message));

    textField.value = '';     //Reset the text field
  });

  // Change username
  username_button.addEventListener('click', function (event) {
    var newUsername = prompt('Your new username: ');

    if (newUsername != null) {
      username = newUsername;
      localStorage.setItem('username', newUsername);
    }
  });

  socket.onmessage = function (event) {
    //Always show the last message sent/received
    msgsDiv.scrollTop = msgsDiv.scrollHeight;

    var parsedJSON = JSON.parse(event.data);

    if (!parsedJSON['type'].includes('heartbeat')) {    //Ignore heartbeat msgs
      if (parsedJSON['type'].includes('notification'))
        socketStatus.innerText = parsedJSON['data'];

      if (parsedJSON['type'].includes('message')) {
        var liElement = document.importNode(messagesList.firstElementChild, true);
        liElement.innerText = '"' + parsedJSON['username'] + '" sent: ' + parsedJSON['data'];
        messagesList.appendChild(liElement);
      }
    }
  };
};

},{}],3:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-19.
 */
module.exports = function (rows, cols, windowDiv) {
  var i;
  var a;
  var turn1;
  var turn2;
  var lastTile;
  var pairs = 0;
  var tries = 0;

  var tiles = [];
  tiles = getPictureArray();    //Shuffle the array
  var container = windowDiv.getElementsByClassName('window_container')[0];
  var templateDiv = document.getElementById('memory_temp').content.firstElementChild;

  var div = document.importNode(templateDiv.firstElementChild, false);
  var textDiv = document.importNode(document.getElementById('memory_temp').content.lastElementChild, false);
  textDiv.innerText = 'Number of tries: ' + tries;

  tiles.forEach(function (tile, index) {

    a = document.importNode(templateDiv.firstElementChild, true);
    a.firstElementChild.setAttribute('data-bricknumber', index);
    div.appendChild(a);

    //New line
    if ((index + 1) % cols === 0)
      div.appendChild(document.createElement('br'));
  });

  div.addEventListener('click', function (event) {
    event.preventDefault();
    var img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild;
    var index = parseInt(img.getAttribute('data-bricknumber'));
    turnBrick(tiles[index], index, img);
  });

  container.appendChild(div);
  container.appendChild(textDiv);

  function turnBrick(tile, index, img) {
    if (turn2)
      return;

    img.src = 'image/' + tile + '.jpg';

    if (!turn1) {
      turn1 = img;
      lastTile = tile;
    } else {
      //Second brick is clicked
      if (img === turn1)
        return;
      tries++;
      textDiv.innerText = 'Number of tries: ' + tries;
      turn2 = img;
      if (tile === lastTile) {
        //Found a pair
        pairs++;

        if (pairs === (cols * rows) / 2) {
          textDiv.classList.remove('light-blue');
          textDiv.classList.remove('lighten-4');
          textDiv.innerText = 'You Won! ' + 'with '+ tries + ' tries!';
      }
        //Turn back the bricks
        window.setTimeout(function () {
          turn1.parentNode.classList.add('removed');
          turn2.parentNode.classList.add('removed');

          turn1 = null;
          turn2 = null;
        }, 100);
      } else {
        window.setTimeout(function () {
          turn1.src = 'image/0.jpg';
          turn2.src = 'image/0.jpg';

          turn1 = null;
          turn2 = null;
        }, 500)
      }
    }
  }

  /**
   * Shuffle the tiles
   * @returns {Array}: the shuffled array of tiles
   */
  function getPictureArray() {
    var i;
    var arr = [];

    for (i = 1; i <= (rows * cols) / 2; i++) {
      arr.push(i);
      arr.push(i);
    }

    for (i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
};


},{}],4:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-17.
 */
var counter = 0;    //Counts the number of windows
var currentDiv;     //The current selected window
module.exports = function(iconName, title, socket) {
  counter++;
  console.log(counter + "window created");

  //Adding the template
  var template = document.getElementById('window_temp');
  var windowDiv = document.importNode(template.content.firstElementChild, true);
  var windowToolbar = windowDiv.getElementsByClassName('toolbar')[0];
  document.getElementsByTagName('ul')[0].appendChild(windowDiv);

  //Set the window icon
  var icon = windowDiv.getElementsByClassName('window_icon')[0];
  icon.innerText = iconName;

  //Window position upon creation
  divMove();

  //Adding click listener to the window
  windowDiv.addEventListener('mousedown', function (e) {
    if (currentDiv != undefined)
      currentDiv.style.zIndex = 1;
    windowDiv.style.zIndex = 3;     //Bring the selected window on top of everything
    currentDiv = windowDiv;
  });

  //Adding the Drag listeners
  windowDiv.firstElementChild.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);

  //Adding the Close listener
  var close = windowDiv.getElementsByClassName('close_a')[0];
  close.addEventListener('click', function (e) {
    windowDiv.parentNode.removeChild(windowDiv);
  });

  //Setting the window title and deciding which app should launch
  var windowTitle;
  if (title.includes('memory')) {
    windowTitle = document.createTextNode('Memory');
    windowToolbar.appendChild(windowTitle);
    startMemoryGame();
  } else if (title.includes('Chat')) {
    windowTitle = document.createTextNode('Chat');
    windowToolbar.appendChild(windowTitle);
    startChat();
  } else if (title.includes('todo')) {
    windowTitle = document.createTextNode('ToDo');
    windowToolbar.appendChild(windowTitle);
    startToDo();
  }

  function mouseUp() {
    windowDiv.style.opacity = 1;    //Defocus the window after dragging is done
    window.removeEventListener('mousemove', divMove, true);
  }

  function mouseDown(e) {
    windowDiv.style.opacity = 0.7;      //Focusing the window while dragging
    xPos = e.clientX - windowDiv.offsetLeft;
    yPos = e.clientY - windowDiv.offsetTop;
    window.addEventListener('mousemove', divMove, true);
  }

  function divMove(e) {
    if(e != undefined) {
      windowDiv.style.top = (e.clientY - yPos) + 'px';
      windowDiv.style.left = (e.clientX - xPos) + 'px';
    } else {
      //TODO: still need to check the boundaries of the window creation
      windowDiv.style.top = counter * 20 + 'px';
      windowDiv.style.left =  counter * 20 + 'px';

      //Check the bottom boundaries and reset if the new window is offscreen
      var windowBottom = counter * 20 + windowDiv.clientHeight;
      if (windowBottom > window.innerHeight)
        counter = 0;
    }
  }

  /**
   * Start the Memory game
   */
  function startMemoryGame() {
    var startGameFlag = false;
    var rows;
    var cols;
    var answer;
    var createMemory = require('./memory');

    //Ask the player for the number of tiles
    var tilesNumberDiv = document.importNode(document.getElementById('tiles_temp').content.firstElementChild, true);
    windowDiv.appendChild(tilesNumberDiv);

    //To check which option is chosen
    var selectionDiv = tilesNumberDiv.lastElementChild;
    selectionDiv.addEventListener('click', function (event) {
      event.preventDefault();
      answer = event.target.classList;

      if (answer.contains('1')) {
        rows = 4;
        cols = 4;
      } else if (answer.contains('2')) {
        rows = 2;
        cols = 2;
      } else if (answer.contains('3')) {
        rows = 2;
        cols = 4
      }
      event.stopPropagation();
      windowDiv.removeChild(tilesNumberDiv);
      new createMemory(rows, cols, windowDiv);    //Start the game
    });

  }

  /**
   * Start the Chat
   */
  function startChat() {
    var startChat = require('./chat');
    var userName;
    var windowsList = document.getElementsByClassName('window');

    if (localStorage.length === 0) {
      var userName_temp = document.importNode(document.getElementById('username_chat_temp').content.firstElementChild, true);
      windowDiv.appendChild(userName_temp);

      var submitAns = document.getElementById('submit_button');
      submitAns.addEventListener('click', function (event) {
        userName = document.getElementById('user_answer').value;
        localStorage.setItem('username', userName);
        windowDiv.removeChild(userName_temp);
      });
    } else
      userName = localStorage.getItem('username');
    new startChat(userName, windowDiv);
  }

  /**
   * Start the to Do app
   */
  function startToDo() {
    var todo_div = document.importNode(document.getElementById('todo_temp').content.firstElementChild, true);
    todo_div.getElementsByClassName('add')[0].addEventListener('click', add);
    var todoList = todo_div.getElementsByClassName('todos').content.firstElementChild;
    show();

    function add() {
      var task = todo_div.getElementsByClassName('task').value;

      var todos = get_todos();
      todos.push(task);
      localStorage.setItem('todo', JSON.stringify(todos));

      show();

      return false;
    }

    function get_todos() {
      var todos = new Array;
      var todosStr = localStorage.getItem('todo');
      if (todosStr != null)
        todos = JSON.parse(todosStr);
      return todos;
    }

    function show() {
      var todos = get_todos();

      for (var i = 0; i < todos.length; i++){
        var todoLiItem = document.importNode(todoList.firstElementChild, true);
        todoLiItem.innerText = todos[i];
      }

      var buttons = todoList.getElementsByClassName('remove');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function (event) {
            //TODO: remove the li item from the array
        });
      }
    }
  }
};

},{"./chat":2,"./memory":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOS4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjcmVhdGVXaW5kb3cgPSByZXF1aXJlKCcuL3dpbmRvdycpO1xuXG5cbnZhciBtZW1vcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X2J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNyZWF0ZVdpbmRvdygnZ2FtZXMnLCAnbWVtb3J5X3RlbXAnKTtcbn0pO1xuXG52YXIgY2hhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X2J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNyZWF0ZVdpbmRvdygnY2hhdCcsICdDaGF0Jyk7XG59KTtcblxudmFyIHRvZG8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9kb19idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICBjcmVhdGVXaW5kb3coJ3RvZG8nLCAndG9kbycpO1xufSk7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTIxLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1c2VybmFtZSwgd2luZG93RGl2KSB7XG4gIHZhciBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuXG4gIHZhciBjaGF0X3RlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgd2luZG93RGl2LmFwcGVuZENoaWxkKGNoYXRfdGVtcCk7XG5cbiAgdmFyIHNvY2tldFN0YXR1cyA9IGNoYXRfdGVtcC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgdmFyIG1lc3NhZ2VzTGlzdCA9IGNoYXRfdGVtcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZXNzYWdlcycpWzBdO1xuICB2YXIgdGV4dEZpZWxkID0gY2hhdF90ZW1wLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RleHRfbXNnJylbMF07XG4gIHZhciBzZW5kX2J1dHRvbiA9IGNoYXRfdGVtcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZW5kX2J1dHRvbicpWzBdO1xuICB2YXIgdXNlcm5hbWVfYnV0dG9uID0gY2hhdF90ZW1wLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3VzZXJuYW1lX2J1dHRvbicpWzBdO1xuICB2YXIgbXNnc0RpdiA9IGNoYXRfdGVtcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtc2dzX2RpdicpWzBdO1xuXG4gIC8vQWRkaW5nIHRoZSBDbG9zZSBsaXN0ZW5lclxuICB2YXIgY2xvc2UgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2VfYScpWzBdO1xuICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgc29ja2V0LmNsb3NlKCk7XG4gIH0pO1xuXG4gIC8vIFNob3cgYSBjb25uZWN0ZWQgbWVzc2FnZSB3aGVuIHRoZSBXZWJTb2NrZXQgaXMgb3BlbmVkXG4gIHNvY2tldC5vbm9wZW4gPSBmdW5jdGlvbihldmVudCkge1xuXG4gIH07XG5cbiAgLy8gSGFuZGxlIGFueSBlcnJvcnMgdGhhdCBvY2N1clxuICBzb2NrZXQub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgc29ja2V0U3RhdHVzKCdXZWJTb2NrZXQgRXJyb3I6ICcgKyBlcnJvcik7XG4gIH07XG5cbiAgLy8gU2VuZCBhIG1lc3NhZ2Ugd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWRcbiAgc2VuZF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgZGF0YTogdGV4dEZpZWxkLnZhbHVlLFxuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgY2hhbm5lbDogXCJteSwgbm90IHNvIHNlY3JldCwgY2hhbm5lbFwiLFxuICAgICAga2V5OiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcbiAgICB9O1xuICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2UpKTtcblxuICAgIHRleHRGaWVsZC52YWx1ZSA9ICcnOyAgICAgLy9SZXNldCB0aGUgdGV4dCBmaWVsZFxuICB9KTtcblxuICAvLyBDaGFuZ2UgdXNlcm5hbWVcbiAgdXNlcm5hbWVfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIG5ld1VzZXJuYW1lID0gcHJvbXB0KCdZb3VyIG5ldyB1c2VybmFtZTogJyk7XG5cbiAgICBpZiAobmV3VXNlcm5hbWUgIT0gbnVsbCkge1xuICAgICAgdXNlcm5hbWUgPSBuZXdVc2VybmFtZTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VybmFtZScsIG5ld1VzZXJuYW1lKTtcbiAgICB9XG4gIH0pO1xuXG4gIHNvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAvL0Fsd2F5cyBzaG93IHRoZSBsYXN0IG1lc3NhZ2Ugc2VudC9yZWNlaXZlZFxuICAgIG1zZ3NEaXYuc2Nyb2xsVG9wID0gbXNnc0Rpdi5zY3JvbGxIZWlnaHQ7XG5cbiAgICB2YXIgcGFyc2VkSlNPTiA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG5cbiAgICBpZiAoIXBhcnNlZEpTT05bJ3R5cGUnXS5pbmNsdWRlcygnaGVhcnRiZWF0JykpIHsgICAgLy9JZ25vcmUgaGVhcnRiZWF0IG1zZ3NcbiAgICAgIGlmIChwYXJzZWRKU09OWyd0eXBlJ10uaW5jbHVkZXMoJ25vdGlmaWNhdGlvbicpKVxuICAgICAgICBzb2NrZXRTdGF0dXMuaW5uZXJUZXh0ID0gcGFyc2VkSlNPTlsnZGF0YSddO1xuXG4gICAgICBpZiAocGFyc2VkSlNPTlsndHlwZSddLmluY2x1ZGVzKCdtZXNzYWdlJykpIHtcbiAgICAgICAgdmFyIGxpRWxlbWVudCA9IGRvY3VtZW50LmltcG9ydE5vZGUobWVzc2FnZXNMaXN0LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgICAgbGlFbGVtZW50LmlubmVyVGV4dCA9ICdcIicgKyBwYXJzZWRKU09OWyd1c2VybmFtZSddICsgJ1wiIHNlbnQ6ICcgKyBwYXJzZWRKU09OWydkYXRhJ107XG4gICAgICAgIG1lc3NhZ2VzTGlzdC5hcHBlbmRDaGlsZChsaUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgaGF0ZW0gb24gMjAxNi0xMC0xOS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm93cywgY29scywgd2luZG93RGl2KSB7XG4gIHZhciBpO1xuICB2YXIgYTtcbiAgdmFyIHR1cm4xO1xuICB2YXIgdHVybjI7XG4gIHZhciBsYXN0VGlsZTtcbiAgdmFyIHBhaXJzID0gMDtcbiAgdmFyIHRyaWVzID0gMDtcblxuICB2YXIgdGlsZXMgPSBbXTtcbiAgdGlsZXMgPSBnZXRQaWN0dXJlQXJyYXkoKTsgICAgLy9TaHVmZmxlIHRoZSBhcnJheVxuICB2YXIgY29udGFpbmVyID0gd2luZG93RGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvd19jb250YWluZXInKVswXTtcbiAgdmFyIHRlbXBsYXRlRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbW9yeV90ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICB2YXIgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZURpdi5maXJzdEVsZW1lbnRDaGlsZCwgZmFsc2UpO1xuICB2YXIgdGV4dERpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbW9yeV90ZW1wJykuY29udGVudC5sYXN0RWxlbWVudENoaWxkLCBmYWxzZSk7XG4gIHRleHREaXYuaW5uZXJUZXh0ID0gJ051bWJlciBvZiB0cmllczogJyArIHRyaWVzO1xuXG4gIHRpbGVzLmZvckVhY2goZnVuY3Rpb24gKHRpbGUsIGluZGV4KSB7XG5cbiAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZURpdi5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgYS5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnJpY2tudW1iZXInLCBpbmRleCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGEpO1xuXG4gICAgLy9OZXcgbGluZVxuICAgIGlmICgoaW5kZXggKyAxKSAlIGNvbHMgPT09IDApXG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gIH0pO1xuXG4gIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoaW1nLmdldEF0dHJpYnV0ZSgnZGF0YS1icmlja251bWJlcicpKTtcbiAgICB0dXJuQnJpY2sodGlsZXNbaW5kZXhdLCBpbmRleCwgaW1nKTtcbiAgfSk7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0RGl2KTtcblxuICBmdW5jdGlvbiB0dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZykge1xuICAgIGlmICh0dXJuMilcbiAgICAgIHJldHVybjtcblxuICAgIGltZy5zcmMgPSAnaW1hZ2UvJyArIHRpbGUgKyAnLmpwZyc7XG5cbiAgICBpZiAoIXR1cm4xKSB7XG4gICAgICB0dXJuMSA9IGltZztcbiAgICAgIGxhc3RUaWxlID0gdGlsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9TZWNvbmQgYnJpY2sgaXMgY2xpY2tlZFxuICAgICAgaWYgKGltZyA9PT0gdHVybjEpXG4gICAgICAgIHJldHVybjtcbiAgICAgIHRyaWVzKys7XG4gICAgICB0ZXh0RGl2LmlubmVyVGV4dCA9ICdOdW1iZXIgb2YgdHJpZXM6ICcgKyB0cmllcztcbiAgICAgIHR1cm4yID0gaW1nO1xuICAgICAgaWYgKHRpbGUgPT09IGxhc3RUaWxlKSB7XG4gICAgICAgIC8vRm91bmQgYSBwYWlyXG4gICAgICAgIHBhaXJzKys7XG5cbiAgICAgICAgaWYgKHBhaXJzID09PSAoY29scyAqIHJvd3MpIC8gMikge1xuICAgICAgICAgIHRleHREaXYuY2xhc3NMaXN0LnJlbW92ZSgnbGlnaHQtYmx1ZScpO1xuICAgICAgICAgIHRleHREaXYuY2xhc3NMaXN0LnJlbW92ZSgnbGlnaHRlbi00Jyk7XG4gICAgICAgICAgdGV4dERpdi5pbm5lclRleHQgPSAnWW91IFdvbiEgJyArICd3aXRoICcrIHRyaWVzICsgJyB0cmllcyEnO1xuICAgICAgfVxuICAgICAgICAvL1R1cm4gYmFjayB0aGUgYnJpY2tzXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICB0dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcblxuICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHVybjEuc3JjID0gJ2ltYWdlLzAuanBnJztcbiAgICAgICAgICB0dXJuMi5zcmMgPSAnaW1hZ2UvMC5qcGcnO1xuXG4gICAgICAgICAgdHVybjEgPSBudWxsO1xuICAgICAgICAgIHR1cm4yID0gbnVsbDtcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaHVmZmxlIHRoZSB0aWxlc1xuICAgKiBAcmV0dXJucyB7QXJyYXl9OiB0aGUgc2h1ZmZsZWQgYXJyYXkgb2YgdGlsZXNcbiAgICovXG4gIGZ1bmN0aW9uIGdldFBpY3R1cmVBcnJheSgpIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYXJyID0gW107XG5cbiAgICBmb3IgKGkgPSAxOyBpIDw9IChyb3dzICogY29scykgLyAyOyBpKyspIHtcbiAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgYXJyLnB1c2goaSk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gYXJyLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgIHZhciBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICB2YXIgdGVtcCA9IGFycltpXTtcbiAgICAgIGFycltpXSA9IGFycltqXTtcbiAgICAgIGFycltqXSA9IHRlbXA7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbn07XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTE3LlxuICovXG52YXIgY291bnRlciA9IDA7ICAgIC8vQ291bnRzIHRoZSBudW1iZXIgb2Ygd2luZG93c1xudmFyIGN1cnJlbnREaXY7ICAgICAvL1RoZSBjdXJyZW50IHNlbGVjdGVkIHdpbmRvd1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpY29uTmFtZSwgdGl0bGUsIHNvY2tldCkge1xuICBjb3VudGVyKys7XG4gIGNvbnNvbGUubG9nKGNvdW50ZXIgKyBcIndpbmRvdyBjcmVhdGVkXCIpO1xuXG4gIC8vQWRkaW5nIHRoZSB0ZW1wbGF0ZVxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2luZG93X3RlbXAnKTtcbiAgdmFyIHdpbmRvd0RpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIHZhciB3aW5kb3dUb29sYmFyID0gd2luZG93RGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2xiYXInKVswXTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0uYXBwZW5kQ2hpbGQod2luZG93RGl2KTtcblxuICAvL1NldCB0aGUgd2luZG93IGljb25cbiAgdmFyIGljb24gPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93X2ljb24nKVswXTtcbiAgaWNvbi5pbm5lclRleHQgPSBpY29uTmFtZTtcblxuICAvL1dpbmRvdyBwb3NpdGlvbiB1cG9uIGNyZWF0aW9uXG4gIGRpdk1vdmUoKTtcblxuICAvL0FkZGluZyBjbGljayBsaXN0ZW5lciB0byB0aGUgd2luZG93XG4gIHdpbmRvd0Rpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChjdXJyZW50RGl2ICE9IHVuZGVmaW5lZClcbiAgICAgIGN1cnJlbnREaXYuc3R5bGUuekluZGV4ID0gMTtcbiAgICB3aW5kb3dEaXYuc3R5bGUuekluZGV4ID0gMzsgICAgIC8vQnJpbmcgdGhlIHNlbGVjdGVkIHdpbmRvdyBvbiB0b3Agb2YgZXZlcnl0aGluZ1xuICAgIGN1cnJlbnREaXYgPSB3aW5kb3dEaXY7XG4gIH0pO1xuXG4gIC8vQWRkaW5nIHRoZSBEcmFnIGxpc3RlbmVyc1xuICB3aW5kb3dEaXYuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duLCBmYWxzZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCwgZmFsc2UpO1xuXG4gIC8vQWRkaW5nIHRoZSBDbG9zZSBsaXN0ZW5lclxuICB2YXIgY2xvc2UgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2VfYScpWzBdO1xuICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgd2luZG93RGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2luZG93RGl2KTtcbiAgfSk7XG5cbiAgLy9TZXR0aW5nIHRoZSB3aW5kb3cgdGl0bGUgYW5kIGRlY2lkaW5nIHdoaWNoIGFwcCBzaG91bGQgbGF1bmNoXG4gIHZhciB3aW5kb3dUaXRsZTtcbiAgaWYgKHRpdGxlLmluY2x1ZGVzKCdtZW1vcnknKSkge1xuICAgIHdpbmRvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ01lbW9yeScpO1xuICAgIHdpbmRvd1Rvb2xiYXIuYXBwZW5kQ2hpbGQod2luZG93VGl0bGUpO1xuICAgIHN0YXJ0TWVtb3J5R2FtZSgpO1xuICB9IGVsc2UgaWYgKHRpdGxlLmluY2x1ZGVzKCdDaGF0JykpIHtcbiAgICB3aW5kb3dUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDaGF0Jyk7XG4gICAgd2luZG93VG9vbGJhci5hcHBlbmRDaGlsZCh3aW5kb3dUaXRsZSk7XG4gICAgc3RhcnRDaGF0KCk7XG4gIH0gZWxzZSBpZiAodGl0bGUuaW5jbHVkZXMoJ3RvZG8nKSkge1xuICAgIHdpbmRvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1RvRG8nKTtcbiAgICB3aW5kb3dUb29sYmFyLmFwcGVuZENoaWxkKHdpbmRvd1RpdGxlKTtcbiAgICBzdGFydFRvRG8oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG4gICAgd2luZG93RGl2LnN0eWxlLm9wYWNpdHkgPSAxOyAgICAvL0RlZm9jdXMgdGhlIHdpbmRvdyBhZnRlciBkcmFnZ2luZyBpcyBkb25lXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VEb3duKGUpIHtcbiAgICB3aW5kb3dEaXYuc3R5bGUub3BhY2l0eSA9IDAuNzsgICAgICAvL0ZvY3VzaW5nIHRoZSB3aW5kb3cgd2hpbGUgZHJhZ2dpbmdcbiAgICB4UG9zID0gZS5jbGllbnRYIC0gd2luZG93RGl2Lm9mZnNldExlZnQ7XG4gICAgeVBvcyA9IGUuY2xpZW50WSAtIHdpbmRvd0Rpdi5vZmZzZXRUb3A7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGl2TW92ZShlKSB7XG4gICAgaWYoZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS50b3AgPSAoZS5jbGllbnRZIC0geVBvcykgKyAncHgnO1xuICAgICAgd2luZG93RGl2LnN0eWxlLmxlZnQgPSAoZS5jbGllbnRYIC0geFBvcykgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1RPRE86IHN0aWxsIG5lZWQgdG8gY2hlY2sgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHdpbmRvdyBjcmVhdGlvblxuICAgICAgd2luZG93RGl2LnN0eWxlLnRvcCA9IGNvdW50ZXIgKiAyMCArICdweCc7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUubGVmdCA9ICBjb3VudGVyICogMjAgKyAncHgnO1xuXG4gICAgICAvL0NoZWNrIHRoZSBib3R0b20gYm91bmRhcmllcyBhbmQgcmVzZXQgaWYgdGhlIG5ldyB3aW5kb3cgaXMgb2Zmc2NyZWVuXG4gICAgICB2YXIgd2luZG93Qm90dG9tID0gY291bnRlciAqIDIwICsgd2luZG93RGl2LmNsaWVudEhlaWdodDtcbiAgICAgIGlmICh3aW5kb3dCb3R0b20gPiB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICAgIGNvdW50ZXIgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgTWVtb3J5IGdhbWVcbiAgICovXG4gIGZ1bmN0aW9uIHN0YXJ0TWVtb3J5R2FtZSgpIHtcbiAgICB2YXIgc3RhcnRHYW1lRmxhZyA9IGZhbHNlO1xuICAgIHZhciByb3dzO1xuICAgIHZhciBjb2xzO1xuICAgIHZhciBhbnN3ZXI7XG4gICAgdmFyIGNyZWF0ZU1lbW9yeSA9IHJlcXVpcmUoJy4vbWVtb3J5Jyk7XG5cbiAgICAvL0FzayB0aGUgcGxheWVyIGZvciB0aGUgbnVtYmVyIG9mIHRpbGVzXG4gICAgdmFyIHRpbGVzTnVtYmVyRGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGlsZXNfdGVtcCcpLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHdpbmRvd0Rpdi5hcHBlbmRDaGlsZCh0aWxlc051bWJlckRpdik7XG5cbiAgICAvL1RvIGNoZWNrIHdoaWNoIG9wdGlvbiBpcyBjaG9zZW5cbiAgICB2YXIgc2VsZWN0aW9uRGl2ID0gdGlsZXNOdW1iZXJEaXYubGFzdEVsZW1lbnRDaGlsZDtcbiAgICBzZWxlY3Rpb25EaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBhbnN3ZXIgPSBldmVudC50YXJnZXQuY2xhc3NMaXN0O1xuXG4gICAgICBpZiAoYW5zd2VyLmNvbnRhaW5zKCcxJykpIHtcbiAgICAgICAgcm93cyA9IDQ7XG4gICAgICAgIGNvbHMgPSA0O1xuICAgICAgfSBlbHNlIGlmIChhbnN3ZXIuY29udGFpbnMoJzInKSkge1xuICAgICAgICByb3dzID0gMjtcbiAgICAgICAgY29scyA9IDI7XG4gICAgICB9IGVsc2UgaWYgKGFuc3dlci5jb250YWlucygnMycpKSB7XG4gICAgICAgIHJvd3MgPSAyO1xuICAgICAgICBjb2xzID0gNFxuICAgICAgfVxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB3aW5kb3dEaXYucmVtb3ZlQ2hpbGQodGlsZXNOdW1iZXJEaXYpO1xuICAgICAgbmV3IGNyZWF0ZU1lbW9yeShyb3dzLCBjb2xzLCB3aW5kb3dEaXYpOyAgICAvL1N0YXJ0IHRoZSBnYW1lXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgQ2hhdFxuICAgKi9cbiAgZnVuY3Rpb24gc3RhcnRDaGF0KCkge1xuICAgIHZhciBzdGFydENoYXQgPSByZXF1aXJlKCcuL2NoYXQnKTtcbiAgICB2YXIgdXNlck5hbWU7XG4gICAgdmFyIHdpbmRvd3NMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIHVzZXJOYW1lX3RlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZV9jaGF0X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgIHdpbmRvd0Rpdi5hcHBlbmRDaGlsZCh1c2VyTmFtZV90ZW1wKTtcblxuICAgICAgdmFyIHN1Ym1pdEFucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXRfYnV0dG9uJyk7XG4gICAgICBzdWJtaXRBbnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdXNlck5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcl9hbnN3ZXInKS52YWx1ZTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgdXNlck5hbWUpO1xuICAgICAgICB3aW5kb3dEaXYucmVtb3ZlQ2hpbGQodXNlck5hbWVfdGVtcCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2VcbiAgICAgIHVzZXJOYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJuYW1lJyk7XG4gICAgbmV3IHN0YXJ0Q2hhdCh1c2VyTmFtZSwgd2luZG93RGl2KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgdG8gRG8gYXBwXG4gICAqL1xuICBmdW5jdGlvbiBzdGFydFRvRG8oKSB7XG4gICAgdmFyIHRvZG9fZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9kb190ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgdG9kb19kaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWRkJylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGQpO1xuICAgIHZhciB0b2RvTGlzdCA9IHRvZG9fZGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RvZG9zJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICBzaG93KCk7XG5cbiAgICBmdW5jdGlvbiBhZGQoKSB7XG4gICAgICB2YXIgdGFzayA9IHRvZG9fZGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rhc2snKS52YWx1ZTtcblxuICAgICAgdmFyIHRvZG9zID0gZ2V0X3RvZG9zKCk7XG4gICAgICB0b2Rvcy5wdXNoKHRhc2spO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RvZG8nLCBKU09OLnN0cmluZ2lmeSh0b2RvcykpO1xuXG4gICAgICBzaG93KCk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRfdG9kb3MoKSB7XG4gICAgICB2YXIgdG9kb3MgPSBuZXcgQXJyYXk7XG4gICAgICB2YXIgdG9kb3NTdHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9kbycpO1xuICAgICAgaWYgKHRvZG9zU3RyICE9IG51bGwpXG4gICAgICAgIHRvZG9zID0gSlNPTi5wYXJzZSh0b2Rvc1N0cik7XG4gICAgICByZXR1cm4gdG9kb3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvdygpIHtcbiAgICAgIHZhciB0b2RvcyA9IGdldF90b2RvcygpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIHRvZG9MaUl0ZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKHRvZG9MaXN0LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgICAgdG9kb0xpSXRlbS5pbm5lclRleHQgPSB0b2Rvc1tpXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGJ1dHRvbnMgPSB0b2RvTGlzdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyZW1vdmUnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBidXR0b25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvL1RPRE86IHJlbW92ZSB0aGUgbGkgaXRlbSBmcm9tIHRoZSBhcnJheVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iXX0=
