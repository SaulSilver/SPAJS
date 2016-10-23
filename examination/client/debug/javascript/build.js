(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  // Handle any errors that occur
  socket.onerror = function(error) {
    socketStatus('WebSocket Error: ' + error);
  };

  // Send a message when the button is clicked
  send_button.addEventListener('click', function (event) {
    var message = {
      type: "message",
      data: textField.value,
      username: localStorage.getItem('username'),
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

  //To show the image of the chosen tile and check game updates
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
module.exports = function(iconName, title) {
  counter++;

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
  } else if (title.includes('gallery')) {
    windowTitle = document.createTextNode('Gallery');
    windowToolbar.appendChild(windowTitle);
    startGallery();
  }

  //For window dragging
  function mouseUp() {
    windowDiv.style.opacity = 1;    //Defocus the window after dragging is done
    window.removeEventListener('mousemove', divMove, true);
  }

  //For window dragging
  function mouseDown(e) {
    windowDiv.style.opacity = 0.7;      //Focusing the window while dragging
    xPos = e.clientX - windowDiv.offsetLeft;
    yPos = e.clientY - windowDiv.offsetTop;
    window.addEventListener('mousemove', divMove, true);
  }

  //For window dragging
  function divMove(e) {
    if(e != undefined) {
      windowDiv.style.top = (e.clientY - yPos) + 'px';
      windowDiv.style.left = (e.clientX - xPos) + 'px';
    } else {
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

    //Ask the user for the username if there is no username set
    if (localStorage.length === 0) {
      var userName_temp = document.importNode(document.getElementById('username_chat_temp').content.firstElementChild, true);
      windowDiv.appendChild(userName_temp);

      var submitAns = userName_temp.getElementsByClassName('submit_button')[0];
      submitAns.addEventListener('click', function (event) {
        userName = userName_temp.getElementsByClassName('user_answer')[0].value;
        localStorage.setItem('username', userName);
        windowDiv.removeChild(userName_temp);
        new startChat(userName, windowDiv);
      });
    } else {
      userName = localStorage.getItem('username');
      new startChat(userName, windowDiv);
    }
  }

  /**
   * Start the Gallery
   */
  function startGallery() {
    var galleryDiv = document.importNode(document.getElementById('gallery_temp').content.firstElementChild, true);
    windowDiv.appendChild(galleryDiv);
    galleryDiv.addEventListener('click', function (event) {
      var srcImg = event.target.getAttribute('src');
      if(srcImg != null)
        galleryDiv.lastElementChild.firstElementChild.setAttribute('src', srcImg);
    })
  }

/*
  /!**
   * Start the to Do app
   *!/
  function startToDo() {
    var todo_div = document.importNode(document.getElementById('todo_temp').content.firstElementChild, true);
    windowDiv.appendChild(todo_div);

    var task = todo_div.firstElementChild;
    var todoList = todo_div.lastElementChild;
    var addButton = task.nextElementSibling;
    addButton.addEventListener('click', add);

    show();

    function add() {
      console.log(' in the add method');
      var taskValue = task.value;
      task.value = '';
      var todos = get_todos();
      todos.push(taskValue);
      localStorage.setItem('todo', JSON.stringify(todos));

      show();

      return false;
    }

    function show() {
      var todos = get_todos();

      var html = '<ul>';
      for (var i = 0; i < todos.length; i++){
        html += '<li>' + todos[i] + '<button class="remove" id="' + i + counter + '">x</button></li>';
        // var todoLiItem = document.importNode(todoList.firstElementChild, true);
        // todoLiItem.appendChild(document.createTextNode(todos[i]));
        // todoList.appendChild(todoLiItem);
      }
      html += '</ul>';
      todoList.innerHTML = html;

      var buttons = todoList.getElementsByClassName('remove');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function (event) {
          var id = event.target.getAttribute('id');

          todos.splice(id, 1);
          localStorage.setItem('todo', JSON.stringify(todos));
        });
      }
    }

    function get_todos() {
      var todos = new Array;
      var todosStr = localStorage.getItem('todo');
      if (todosStr != null)
        todos = JSON.parse(todosStr);
      return todos;
    }
  }
*/


};

},{"./chat":2,"./memory":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOS4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY3JlYXRlV2luZG93ID0gcmVxdWlyZSgnLi93aW5kb3cnKTtcblxuLy9Gb3IgdGhlIE1lbW9yeSBnYW1lXG52YXIgbWVtb3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbW9yeV9idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICBjcmVhdGVXaW5kb3coJ2dhbWVzJywgJ21lbW9yeV90ZW1wJyk7XG59KTtcblxuLy9Gb3IgdGhlIENoYXQgYXBwXG52YXIgY2hhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X2J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNyZWF0ZVdpbmRvdygnY2hhdCcsICdDaGF0Jyk7XG59KTtcblxuLy9Gb3IgdGhlIEdhbGxlcnkgYXBwXG52YXIgZ2FsbGVyeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYWxsZXJ5X2J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGNyZWF0ZVdpbmRvdygndGFiJywgJ2dhbGxlcnknKTtcbn0pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgaGF0ZW0gb24gMjAxNi0xMC0yMS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXNlcm5hbWUsIHdpbmRvd0Rpdikge1xuICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC8nKTtcblxuICB2YXIgY2hhdF90ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdF90ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIHdpbmRvd0Rpdi5hcHBlbmRDaGlsZChjaGF0X3RlbXApO1xuXG4gIHZhciBzb2NrZXRTdGF0dXMgPSBjaGF0X3RlbXAuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIHZhciBtZXNzYWdlc0xpc3QgPSBjaGF0X3RlbXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWVzc2FnZXMnKVswXTtcbiAgdmFyIHRleHRGaWVsZCA9IGNoYXRfdGVtcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0ZXh0X21zZycpWzBdO1xuICB2YXIgc2VuZF9idXR0b24gPSBjaGF0X3RlbXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VuZF9idXR0b24nKVswXTtcbiAgdmFyIHVzZXJuYW1lX2J1dHRvbiA9IGNoYXRfdGVtcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1c2VybmFtZV9idXR0b24nKVswXTtcbiAgdmFyIG1zZ3NEaXYgPSBjaGF0X3RlbXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbXNnc19kaXYnKVswXTtcblxuICAvL0FkZGluZyB0aGUgQ2xvc2UgbGlzdGVuZXJcbiAgdmFyIGNsb3NlID0gd2luZG93RGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nsb3NlX2EnKVswXTtcbiAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHNvY2tldC5jbG9zZSgpO1xuICB9KTtcblxuICAvLyBIYW5kbGUgYW55IGVycm9ycyB0aGF0IG9jY3VyXG4gIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICBzb2NrZXRTdGF0dXMoJ1dlYlNvY2tldCBFcnJvcjogJyArIGVycm9yKTtcbiAgfTtcblxuICAvLyBTZW5kIGEgbWVzc2FnZSB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZFxuICBzZW5kX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICBkYXRhOiB0ZXh0RmllbGQudmFsdWUsXG4gICAgICB1c2VybmFtZTogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJuYW1lJyksXG4gICAgICBjaGFubmVsOiBcIm15LCBub3Qgc28gc2VjcmV0LCBjaGFubmVsXCIsXG4gICAgICBrZXk6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgIH07XG4gICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpO1xuXG4gICAgdGV4dEZpZWxkLnZhbHVlID0gJyc7ICAgICAvL1Jlc2V0IHRoZSB0ZXh0IGZpZWxkXG4gIH0pO1xuXG4gIC8vIENoYW5nZSB1c2VybmFtZVxuICB1c2VybmFtZV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgbmV3VXNlcm5hbWUgPSBwcm9tcHQoJ1lvdXIgbmV3IHVzZXJuYW1lOiAnKTtcblxuICAgIGlmIChuZXdVc2VybmFtZSAhPSBudWxsKSB7XG4gICAgICB1c2VybmFtZSA9IG5ld1VzZXJuYW1lO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgbmV3VXNlcm5hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vQWx3YXlzIHNob3cgdGhlIGxhc3QgbWVzc2FnZSBzZW50L3JlY2VpdmVkXG4gICAgbXNnc0Rpdi5zY3JvbGxUb3AgPSBtc2dzRGl2LnNjcm9sbEhlaWdodDtcblxuICAgIHZhciBwYXJzZWRKU09OID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcblxuICAgIGlmICghcGFyc2VkSlNPTlsndHlwZSddLmluY2x1ZGVzKCdoZWFydGJlYXQnKSkgeyAgICAvL0lnbm9yZSBoZWFydGJlYXQgbXNnc1xuICAgICAgaWYgKHBhcnNlZEpTT05bJ3R5cGUnXS5pbmNsdWRlcygnbm90aWZpY2F0aW9uJykpXG4gICAgICAgIHNvY2tldFN0YXR1cy5pbm5lclRleHQgPSBwYXJzZWRKU09OWydkYXRhJ107XG5cbiAgICAgIGlmIChwYXJzZWRKU09OWyd0eXBlJ10uaW5jbHVkZXMoJ21lc3NhZ2UnKSkge1xuICAgICAgICB2YXIgbGlFbGVtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZXNzYWdlc0xpc3QuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgICAgICBsaUVsZW1lbnQuaW5uZXJUZXh0ID0gJ1wiJyArIHBhcnNlZEpTT05bJ3VzZXJuYW1lJ10gKyAnXCIgc2VudDogJyArIHBhcnNlZEpTT05bJ2RhdGEnXTtcbiAgICAgICAgbWVzc2FnZXNMaXN0LmFwcGVuZENoaWxkKGxpRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTE5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3dzLCBjb2xzLCB3aW5kb3dEaXYpIHtcbiAgdmFyIGk7XG4gIHZhciBhO1xuICB2YXIgdHVybjE7XG4gIHZhciB0dXJuMjtcbiAgdmFyIGxhc3RUaWxlO1xuICB2YXIgcGFpcnMgPSAwO1xuICB2YXIgdHJpZXMgPSAwO1xuXG4gIHZhciB0aWxlcyA9IFtdO1xuICB0aWxlcyA9IGdldFBpY3R1cmVBcnJheSgpOyAgICAvL1NodWZmbGUgdGhlIGFycmF5XG4gIHZhciBjb250YWluZXIgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93X2NvbnRhaW5lcicpWzBdO1xuICB2YXIgdGVtcGxhdGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gIHZhciBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRGl2LmZpcnN0RWxlbWVudENoaWxkLCBmYWxzZSk7XG4gIHZhciB0ZXh0RGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X3RlbXAnKS5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQsIGZhbHNlKTtcbiAgdGV4dERpdi5pbm5lclRleHQgPSAnTnVtYmVyIG9mIHRyaWVzOiAnICsgdHJpZXM7XG5cbiAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbiAodGlsZSwgaW5kZXgpIHtcbiAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZURpdi5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgYS5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnJpY2tudW1iZXInLCBpbmRleCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGEpO1xuXG4gICAgLy9OZXcgbGluZVxuICAgIGlmICgoaW5kZXggKyAxKSAlIGNvbHMgPT09IDApXG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gIH0pO1xuXG4gIGRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoaW1nLmdldEF0dHJpYnV0ZSgnZGF0YS1icmlja251bWJlcicpKTtcbiAgICB0dXJuQnJpY2sodGlsZXNbaW5kZXhdLCBpbmRleCwgaW1nKTtcbiAgfSk7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0ZXh0RGl2KTtcblxuICAvL1RvIHNob3cgdGhlIGltYWdlIG9mIHRoZSBjaG9zZW4gdGlsZSBhbmQgY2hlY2sgZ2FtZSB1cGRhdGVzXG4gIGZ1bmN0aW9uIHR1cm5Ccmljayh0aWxlLCBpbmRleCwgaW1nKSB7XG4gICAgaWYgKHR1cm4yKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaW1nLnNyYyA9ICdpbWFnZS8nICsgdGlsZSArICcuanBnJztcblxuICAgIGlmICghdHVybjEpIHtcbiAgICAgIHR1cm4xID0gaW1nO1xuICAgICAgbGFzdFRpbGUgPSB0aWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1NlY29uZCBicmljayBpcyBjbGlja2VkXG4gICAgICBpZiAoaW1nID09PSB0dXJuMSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdHJpZXMrKztcbiAgICAgIHRleHREaXYuaW5uZXJUZXh0ID0gJ051bWJlciBvZiB0cmllczogJyArIHRyaWVzO1xuICAgICAgdHVybjIgPSBpbWc7XG4gICAgICBpZiAodGlsZSA9PT0gbGFzdFRpbGUpIHtcbiAgICAgICAgLy9Gb3VuZCBhIHBhaXJcbiAgICAgICAgcGFpcnMrKztcblxuICAgICAgICBpZiAocGFpcnMgPT09IChjb2xzICogcm93cykgLyAyKSB7XG4gICAgICAgICAgdGV4dERpdi5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodC1ibHVlJyk7XG4gICAgICAgICAgdGV4dERpdi5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodGVuLTQnKTtcbiAgICAgICAgICB0ZXh0RGl2LmlubmVyVGV4dCA9ICdZb3UgV29uISAnICsgJ3dpdGggJysgdHJpZXMgKyAnIHRyaWVzISc7XG4gICAgICB9XG4gICAgICAgIC8vVHVybiBiYWNrIHRoZSBicmlja3NcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncmVtb3ZlZCcpO1xuICAgICAgICAgIHR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncmVtb3ZlZCcpO1xuXG4gICAgICAgICAgdHVybjEgPSBudWxsO1xuICAgICAgICAgIHR1cm4yID0gbnVsbDtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0dXJuMS5zcmMgPSAnaW1hZ2UvMC5qcGcnO1xuICAgICAgICAgIHR1cm4yLnNyYyA9ICdpbWFnZS8wLmpwZyc7XG5cbiAgICAgICAgICB0dXJuMSA9IG51bGw7XG4gICAgICAgICAgdHVybjIgPSBudWxsO1xuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNodWZmbGUgdGhlIHRpbGVzXG4gICAqIEByZXR1cm5zIHtBcnJheX06IHRoZSBzaHVmZmxlZCBhcnJheSBvZiB0aWxlc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0UGljdHVyZUFycmF5KCkge1xuICAgIHZhciBpO1xuICAgIHZhciBhcnIgPSBbXTtcblxuICAgIGZvciAoaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKykge1xuICAgICAgYXJyLnB1c2goaSk7XG4gICAgICBhcnIucHVzaChpKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIHZhciB0ZW1wID0gYXJyW2ldO1xuICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhhdGVtIG9uIDIwMTYtMTAtMTcuXG4gKi9cbnZhciBjb3VudGVyID0gMDsgICAgLy9Db3VudHMgdGhlIG51bWJlciBvZiB3aW5kb3dzXG52YXIgY3VycmVudERpdjsgICAgIC8vVGhlIGN1cnJlbnQgc2VsZWN0ZWQgd2luZG93XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGljb25OYW1lLCB0aXRsZSkge1xuICBjb3VudGVyKys7XG5cbiAgLy9BZGRpbmcgdGhlIHRlbXBsYXRlXG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5kb3dfdGVtcCcpO1xuICB2YXIgd2luZG93RGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgdmFyIHdpbmRvd1Rvb2xiYXIgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbGJhcicpWzBdO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXS5hcHBlbmRDaGlsZCh3aW5kb3dEaXYpO1xuXG4gIC8vU2V0IHRoZSB3aW5kb3cgaWNvblxuICB2YXIgaWNvbiA9IHdpbmRvd0Rpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3dfaWNvbicpWzBdO1xuICBpY29uLmlubmVyVGV4dCA9IGljb25OYW1lO1xuXG4gIC8vV2luZG93IHBvc2l0aW9uIHVwb24gY3JlYXRpb25cbiAgZGl2TW92ZSgpO1xuXG4gIC8vQWRkaW5nIGNsaWNrIGxpc3RlbmVyIHRvIHRoZSB3aW5kb3dcbiAgd2luZG93RGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGN1cnJlbnREaXYgIT0gdW5kZWZpbmVkKVxuICAgICAgY3VycmVudERpdi5zdHlsZS56SW5kZXggPSAxO1xuICAgIHdpbmRvd0Rpdi5zdHlsZS56SW5kZXggPSAzOyAgICAgLy9CcmluZyB0aGUgc2VsZWN0ZWQgd2luZG93IG9uIHRvcCBvZiBldmVyeXRoaW5nXG4gICAgY3VycmVudERpdiA9IHdpbmRvd0RpdjtcbiAgfSk7XG5cbiAgLy9BZGRpbmcgdGhlIERyYWcgbGlzdGVuZXJzXG4gIHdpbmRvd0Rpdi5maXJzdEVsZW1lbnRDaGlsZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd24sIGZhbHNlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwLCBmYWxzZSk7XG5cbiAgLy9BZGRpbmcgdGhlIENsb3NlIGxpc3RlbmVyXG4gIHZhciBjbG9zZSA9IHdpbmRvd0Rpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbG9zZV9hJylbMF07XG4gIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB3aW5kb3dEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh3aW5kb3dEaXYpO1xuICB9KTtcblxuICAvL1NldHRpbmcgdGhlIHdpbmRvdyB0aXRsZSBhbmQgZGVjaWRpbmcgd2hpY2ggYXBwIHNob3VsZCBsYXVuY2hcbiAgdmFyIHdpbmRvd1RpdGxlO1xuICBpZiAodGl0bGUuaW5jbHVkZXMoJ21lbW9yeScpKSB7XG4gICAgd2luZG93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTWVtb3J5Jyk7XG4gICAgd2luZG93VG9vbGJhci5hcHBlbmRDaGlsZCh3aW5kb3dUaXRsZSk7XG4gICAgc3RhcnRNZW1vcnlHYW1lKCk7XG4gIH0gZWxzZSBpZiAodGl0bGUuaW5jbHVkZXMoJ0NoYXQnKSkge1xuICAgIHdpbmRvd1RpdGxlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0NoYXQnKTtcbiAgICB3aW5kb3dUb29sYmFyLmFwcGVuZENoaWxkKHdpbmRvd1RpdGxlKTtcbiAgICBzdGFydENoYXQoKTtcbiAgfSBlbHNlIGlmICh0aXRsZS5pbmNsdWRlcygnZ2FsbGVyeScpKSB7XG4gICAgd2luZG93VGl0bGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnR2FsbGVyeScpO1xuICAgIHdpbmRvd1Rvb2xiYXIuYXBwZW5kQ2hpbGQod2luZG93VGl0bGUpO1xuICAgIHN0YXJ0R2FsbGVyeSgpO1xuICB9XG5cbiAgLy9Gb3Igd2luZG93IGRyYWdnaW5nXG4gIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG4gICAgd2luZG93RGl2LnN0eWxlLm9wYWNpdHkgPSAxOyAgICAvL0RlZm9jdXMgdGhlIHdpbmRvdyBhZnRlciBkcmFnZ2luZyBpcyBkb25lXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICB9XG5cbiAgLy9Gb3Igd2luZG93IGRyYWdnaW5nXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihlKSB7XG4gICAgd2luZG93RGl2LnN0eWxlLm9wYWNpdHkgPSAwLjc7ICAgICAgLy9Gb2N1c2luZyB0aGUgd2luZG93IHdoaWxlIGRyYWdnaW5nXG4gICAgeFBvcyA9IGUuY2xpZW50WCAtIHdpbmRvd0Rpdi5vZmZzZXRMZWZ0O1xuICAgIHlQb3MgPSBlLmNsaWVudFkgLSB3aW5kb3dEaXYub2Zmc2V0VG9wO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgfVxuXG4gIC8vRm9yIHdpbmRvdyBkcmFnZ2luZ1xuICBmdW5jdGlvbiBkaXZNb3ZlKGUpIHtcbiAgICBpZihlICE9IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93RGl2LnN0eWxlLnRvcCA9IChlLmNsaWVudFkgLSB5UG9zKSArICdweCc7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUubGVmdCA9IChlLmNsaWVudFggLSB4UG9zKSArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS50b3AgPSBjb3VudGVyICogMjAgKyAncHgnO1xuICAgICAgd2luZG93RGl2LnN0eWxlLmxlZnQgPSAgY291bnRlciAqIDIwICsgJ3B4JztcblxuICAgICAgLy9DaGVjayB0aGUgYm90dG9tIGJvdW5kYXJpZXMgYW5kIHJlc2V0IGlmIHRoZSBuZXcgd2luZG93IGlzIG9mZnNjcmVlblxuICAgICAgdmFyIHdpbmRvd0JvdHRvbSA9IGNvdW50ZXIgKiAyMCArIHdpbmRvd0Rpdi5jbGllbnRIZWlnaHQ7XG4gICAgICBpZiAod2luZG93Qm90dG9tID4gd2luZG93LmlubmVySGVpZ2h0KVxuICAgICAgICBjb3VudGVyID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIE1lbW9yeSBnYW1lXG4gICAqL1xuICBmdW5jdGlvbiBzdGFydE1lbW9yeUdhbWUoKSB7XG4gICAgdmFyIHN0YXJ0R2FtZUZsYWcgPSBmYWxzZTtcbiAgICB2YXIgcm93cztcbiAgICB2YXIgY29scztcbiAgICB2YXIgYW5zd2VyO1xuICAgIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKCcuL21lbW9yeScpO1xuXG4gICAgLy9Bc2sgdGhlIHBsYXllciBmb3IgdGhlIG51bWJlciBvZiB0aWxlc1xuICAgIHZhciB0aWxlc051bWJlckRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbGVzX3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICB3aW5kb3dEaXYuYXBwZW5kQ2hpbGQodGlsZXNOdW1iZXJEaXYpO1xuXG4gICAgLy9UbyBjaGVjayB3aGljaCBvcHRpb24gaXMgY2hvc2VuXG4gICAgdmFyIHNlbGVjdGlvbkRpdiA9IHRpbGVzTnVtYmVyRGl2Lmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgc2VsZWN0aW9uRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgYW5zd2VyID0gZXZlbnQudGFyZ2V0LmNsYXNzTGlzdDtcblxuICAgICAgaWYgKGFuc3dlci5jb250YWlucygnMScpKSB7XG4gICAgICAgIHJvd3MgPSA0O1xuICAgICAgICBjb2xzID0gNDtcbiAgICAgIH0gZWxzZSBpZiAoYW5zd2VyLmNvbnRhaW5zKCcyJykpIHtcbiAgICAgICAgcm93cyA9IDI7XG4gICAgICAgIGNvbHMgPSAyO1xuICAgICAgfSBlbHNlIGlmIChhbnN3ZXIuY29udGFpbnMoJzMnKSkge1xuICAgICAgICByb3dzID0gMjtcbiAgICAgICAgY29scyA9IDRcbiAgICAgIH1cbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgd2luZG93RGl2LnJlbW92ZUNoaWxkKHRpbGVzTnVtYmVyRGl2KTtcbiAgICAgIG5ldyBjcmVhdGVNZW1vcnkocm93cywgY29scywgd2luZG93RGl2KTsgICAgLy9TdGFydCB0aGUgZ2FtZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBDaGF0XG4gICAqL1xuICBmdW5jdGlvbiBzdGFydENoYXQoKSB7XG4gICAgdmFyIHN0YXJ0Q2hhdCA9IHJlcXVpcmUoJy4vY2hhdCcpO1xuICAgIHZhciB1c2VyTmFtZTtcblxuICAgIC8vQXNrIHRoZSB1c2VyIGZvciB0aGUgdXNlcm5hbWUgaWYgdGhlcmUgaXMgbm8gdXNlcm5hbWUgc2V0XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciB1c2VyTmFtZV90ZW1wID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWVfY2hhdF90ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgICB3aW5kb3dEaXYuYXBwZW5kQ2hpbGQodXNlck5hbWVfdGVtcCk7XG5cbiAgICAgIHZhciBzdWJtaXRBbnMgPSB1c2VyTmFtZV90ZW1wLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N1Ym1pdF9idXR0b24nKVswXTtcbiAgICAgIHN1Ym1pdEFucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB1c2VyTmFtZSA9IHVzZXJOYW1lX3RlbXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndXNlcl9hbnN3ZXInKVswXS52YWx1ZTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgdXNlck5hbWUpO1xuICAgICAgICB3aW5kb3dEaXYucmVtb3ZlQ2hpbGQodXNlck5hbWVfdGVtcCk7XG4gICAgICAgIG5ldyBzdGFydENoYXQodXNlck5hbWUsIHdpbmRvd0Rpdik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlck5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcm5hbWUnKTtcbiAgICAgIG5ldyBzdGFydENoYXQodXNlck5hbWUsIHdpbmRvd0Rpdik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBHYWxsZXJ5XG4gICAqL1xuICBmdW5jdGlvbiBzdGFydEdhbGxlcnkoKSB7XG4gICAgdmFyIGdhbGxlcnlEaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYWxsZXJ5X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICB3aW5kb3dEaXYuYXBwZW5kQ2hpbGQoZ2FsbGVyeURpdik7XG4gICAgZ2FsbGVyeURpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIHNyY0ltZyA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgICAgaWYoc3JjSW1nICE9IG51bGwpXG4gICAgICAgIGdhbGxlcnlEaXYubGFzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyY0ltZyk7XG4gICAgfSlcbiAgfVxuXG4vKlxuICAvISoqXG4gICAqIFN0YXJ0IHRoZSB0byBEbyBhcHBcbiAgICohL1xuICBmdW5jdGlvbiBzdGFydFRvRG8oKSB7XG4gICAgdmFyIHRvZG9fZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9kb190ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgd2luZG93RGl2LmFwcGVuZENoaWxkKHRvZG9fZGl2KTtcblxuICAgIHZhciB0YXNrID0gdG9kb19kaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIHRvZG9MaXN0ID0gdG9kb19kaXYubGFzdEVsZW1lbnRDaGlsZDtcbiAgICB2YXIgYWRkQnV0dG9uID0gdGFzay5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgYWRkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkKTtcblxuICAgIHNob3coKTtcblxuICAgIGZ1bmN0aW9uIGFkZCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCcgaW4gdGhlIGFkZCBtZXRob2QnKTtcbiAgICAgIHZhciB0YXNrVmFsdWUgPSB0YXNrLnZhbHVlO1xuICAgICAgdGFzay52YWx1ZSA9ICcnO1xuICAgICAgdmFyIHRvZG9zID0gZ2V0X3RvZG9zKCk7XG4gICAgICB0b2Rvcy5wdXNoKHRhc2tWYWx1ZSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9kbycsIEpTT04uc3RyaW5naWZ5KHRvZG9zKSk7XG5cbiAgICAgIHNob3coKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3coKSB7XG4gICAgICB2YXIgdG9kb3MgPSBnZXRfdG9kb3MoKTtcblxuICAgICAgdmFyIGh0bWwgPSAnPHVsPic7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgaHRtbCArPSAnPGxpPicgKyB0b2Rvc1tpXSArICc8YnV0dG9uIGNsYXNzPVwicmVtb3ZlXCIgaWQ9XCInICsgaSArIGNvdW50ZXIgKyAnXCI+eDwvYnV0dG9uPjwvbGk+JztcbiAgICAgICAgLy8gdmFyIHRvZG9MaUl0ZW0gPSBkb2N1bWVudC5pbXBvcnROb2RlKHRvZG9MaXN0LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgICAgLy8gdG9kb0xpSXRlbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2Rvc1tpXSkpO1xuICAgICAgICAvLyB0b2RvTGlzdC5hcHBlbmRDaGlsZCh0b2RvTGlJdGVtKTtcbiAgICAgIH1cbiAgICAgIGh0bWwgKz0gJzwvdWw+JztcbiAgICAgIHRvZG9MaXN0LmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICAgIHZhciBidXR0b25zID0gdG9kb0xpc3QuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVtb3ZlJyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYnV0dG9uc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIHZhciBpZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgICAgICAgICB0b2Rvcy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2RvJywgSlNPTi5zdHJpbmdpZnkodG9kb3MpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3RvZG9zKCkge1xuICAgICAgdmFyIHRvZG9zID0gbmV3IEFycmF5O1xuICAgICAgdmFyIHRvZG9zU3RyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RvZG8nKTtcbiAgICAgIGlmICh0b2Rvc1N0ciAhPSBudWxsKVxuICAgICAgICB0b2RvcyA9IEpTT04ucGFyc2UodG9kb3NTdHIpO1xuICAgICAgcmV0dXJuIHRvZG9zO1xuICAgIH1cbiAgfVxuKi9cblxuXG59O1xuIl19
