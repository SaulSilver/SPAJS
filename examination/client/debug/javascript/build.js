(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./window":4}],2:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-21.
 */
module.exports = function (username, windowDiv, socket) {

  var chat_temp = document.importNode(document.getElementById('chat_temp').content.firstElementChild, true);
  windowDiv.appendChild(chat_temp);

  var socketStatus = document.getElementsByClassName('status')[0];
  var messagesList = document.getElementsByClassName('messages')[0];
  var textField = document.getElementsByClassName('text_msg')[0];
  var send_button = document.getElementsByClassName('send_button')[0];

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

    var liElement = document.importNode(messagesList.firstElementChild, true);
    liElement.innerText = username + ': ' + message.data;
    messagesList.appendChild(liElement);

    textField.value = '';
  });

  socket.onmessage = function (event) {
    var parsedJSON = JSON.parse(event.data);
    console.log(parsedJSON);

    if (!parsedJSON['type'].includes('heartbeat')) {
      if (parsedJSON['type'].includes('notification'))
        socketStatus.innerText = parsedJSON['data'];

      if (parsedJSON['type'].includes('message')) {
        var liElement = document.importNode(messagesList.firstElementChild, true);
        liElement.innerText = parsedJSON['username'] + ': ' + parsedJSON['data'] + '<br>';
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
  //TODO: Set window title
  windowDiv.title = title;
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

  if (title.includes('memory'))
    startMemoryGame();
  else if (title.includes('Chat'))
    startChat();

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
      var rect = windowDiv.getBoundingClientRect();
      if((rect.y + rect.height) < 0)
        counter = 1;
      windowDiv.style.top = counter * 20 + 'px';
      windowDiv.style.left =  counter * 20 + 'px';
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
    //var selectionDiv = document.importNode(tilesNumberDiv.lastElementChild, true);
    //tilesNumberDiv.appendChild(selectionDiv);
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
      new createMemory(rows, cols, windowDiv);
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
        new startChat(userName, windowDiv, socket);
      });
    } else {
      userName = localStorage.getItem('username');
      new startChat(userName, windowDiv, socket);
    }
  }
};

},{"./chat":2,"./memory":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOS4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjcmVhdGVXaW5kb3cgPSByZXF1aXJlKCcuL3dpbmRvdycpO1xudmFyIGNoYXRXaW5kb3dDb3VudGVyID0gMDtcblxudmFyIG1lbW9yeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW1vcnlfYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjcmVhdGVXaW5kb3coJ2dhbWVzJywgJ21lbW9yeV90ZW1wJyk7XG4gIH1cbik7XG5cbnZhciBjaGF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdmFyIHNvY2tldDtcbiAgaWYgKGNoYXRXaW5kb3dDb3VudGVyID09PSAwKVxuICAgICAgICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0LycpO1xuICAgIGNyZWF0ZVdpbmRvdygnY2hhdCcsICdDaGF0Jywgc29ja2V0KTtcbiAgfVxuKTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhhdGVtIG9uIDIwMTYtMTAtMjEuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVzZXJuYW1lLCB3aW5kb3dEaXYsIHNvY2tldCkge1xuXG4gIHZhciBjaGF0X3RlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgd2luZG93RGl2LmFwcGVuZENoaWxkKGNoYXRfdGVtcCk7XG5cbiAgdmFyIHNvY2tldFN0YXR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N0YXR1cycpWzBdO1xuICB2YXIgbWVzc2FnZXNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWVzc2FnZXMnKVswXTtcbiAgdmFyIHRleHRGaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RleHRfbXNnJylbMF07XG4gIHZhciBzZW5kX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbmRfYnV0dG9uJylbMF07XG5cbiAgLy9BZGRpbmcgdGhlIENsb3NlIGxpc3RlbmVyXG4gIHZhciBjbG9zZSA9IHdpbmRvd0Rpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbG9zZV9hJylbMF07XG4gIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBzb2NrZXQuY2xvc2UoKTtcbiAgfSk7XG5cbiAgLy8gU2hvdyBhIGNvbm5lY3RlZCBtZXNzYWdlIHdoZW4gdGhlIFdlYlNvY2tldCBpcyBvcGVuZWRcbiAgc29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgfTtcblxuICAvLyBIYW5kbGUgYW55IGVycm9ycyB0aGF0IG9jY3VyXG4gIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICBzb2NrZXRTdGF0dXMoJ1dlYlNvY2tldCBFcnJvcjogJyArIGVycm9yKTtcbiAgfTtcblxuICAvLyBTZW5kIGEgbWVzc2FnZSB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZFxuICBzZW5kX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICBkYXRhOiB0ZXh0RmllbGQudmFsdWUsXG4gICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICBjaGFubmVsOiBcIm15LCBub3Qgc28gc2VjcmV0LCBjaGFubmVsXCIsXG4gICAgICBrZXk6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxuICAgIH07XG5cbiAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG5cbiAgICB2YXIgbGlFbGVtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZXNzYWdlc0xpc3QuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGxpRWxlbWVudC5pbm5lclRleHQgPSB1c2VybmFtZSArICc6ICcgKyBtZXNzYWdlLmRhdGE7XG4gICAgbWVzc2FnZXNMaXN0LmFwcGVuZENoaWxkKGxpRWxlbWVudCk7XG5cbiAgICB0ZXh0RmllbGQudmFsdWUgPSAnJztcbiAgfSk7XG5cbiAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBwYXJzZWRKU09OID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBjb25zb2xlLmxvZyhwYXJzZWRKU09OKTtcblxuICAgIGlmICghcGFyc2VkSlNPTlsndHlwZSddLmluY2x1ZGVzKCdoZWFydGJlYXQnKSkge1xuICAgICAgaWYgKHBhcnNlZEpTT05bJ3R5cGUnXS5pbmNsdWRlcygnbm90aWZpY2F0aW9uJykpXG4gICAgICAgIHNvY2tldFN0YXR1cy5pbm5lclRleHQgPSBwYXJzZWRKU09OWydkYXRhJ107XG5cbiAgICAgIGlmIChwYXJzZWRKU09OWyd0eXBlJ10uaW5jbHVkZXMoJ21lc3NhZ2UnKSkge1xuICAgICAgICB2YXIgbGlFbGVtZW50ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShtZXNzYWdlc0xpc3QuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgICAgICBsaUVsZW1lbnQuaW5uZXJUZXh0ID0gcGFyc2VkSlNPTlsndXNlcm5hbWUnXSArICc6ICcgKyBwYXJzZWRKU09OWydkYXRhJ10gKyAnPGJyPic7XG4gICAgICAgIG1lc3NhZ2VzTGlzdC5hcHBlbmRDaGlsZChsaUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTE5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3dzLCBjb2xzLCB3aW5kb3dEaXYpIHtcbiAgdmFyIGk7XG4gIHZhciBhO1xuICB2YXIgdHVybjE7XG4gIHZhciB0dXJuMjtcbiAgdmFyIGxhc3RUaWxlO1xuICB2YXIgcGFpcnMgPSAwO1xuICB2YXIgdHJpZXMgPSAwO1xuXG4gIHZhciB0aWxlcyA9IFtdO1xuICB0aWxlcyA9IGdldFBpY3R1cmVBcnJheSgpOyAgICAvL1NodWZmbGUgdGhlIGFycmF5XG4gIHZhciBjb250YWluZXIgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93X2NvbnRhaW5lcicpWzBdO1xuICB2YXIgdGVtcGxhdGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gIHZhciBkaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRGl2LmZpcnN0RWxlbWVudENoaWxkLCBmYWxzZSk7XG4gIHZhciB0ZXh0RGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X3RlbXAnKS5jb250ZW50Lmxhc3RFbGVtZW50Q2hpbGQsIGZhbHNlKTtcbiAgdGV4dERpdi5pbm5lclRleHQgPSAnTnVtYmVyIG9mIHRyaWVzOiAnICsgdHJpZXM7XG5cbiAgdGlsZXMuZm9yRWFjaChmdW5jdGlvbiAodGlsZSwgaW5kZXgpIHtcblxuICAgIGEgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRGl2LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBhLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgnZGF0YS1icmlja251bWJlcicsIGluZGV4KTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoYSk7XG5cbiAgICAvL05ldyBsaW5lXG4gICAgaWYgKChpbmRleCArIDEpICUgY29scyA9PT0gMClcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgfSk7XG5cbiAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgaW1nID0gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSAnSU1HJyA/IGV2ZW50LnRhcmdldCA6IGV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2YXIgaW5kZXggPSBwYXJzZUludChpbWcuZ2V0QXR0cmlidXRlKCdkYXRhLWJyaWNrbnVtYmVyJykpO1xuICAgIHR1cm5Ccmljayh0aWxlc1tpbmRleF0sIGluZGV4LCBpbWcpO1xuICB9KTtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRleHREaXYpO1xuXG4gIGZ1bmN0aW9uIHR1cm5Ccmljayh0aWxlLCBpbmRleCwgaW1nKSB7XG4gICAgaWYgKHR1cm4yKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaW1nLnNyYyA9ICdpbWFnZS8nICsgdGlsZSArICcuanBnJztcblxuICAgIGlmICghdHVybjEpIHtcbiAgICAgIHR1cm4xID0gaW1nO1xuICAgICAgbGFzdFRpbGUgPSB0aWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1NlY29uZCBicmljayBpcyBjbGlja2VkXG4gICAgICBpZiAoaW1nID09PSB0dXJuMSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdHJpZXMrKztcbiAgICAgIHRleHREaXYuaW5uZXJUZXh0ID0gJ051bWJlciBvZiB0cmllczogJyArIHRyaWVzO1xuICAgICAgdHVybjIgPSBpbWc7XG4gICAgICBpZiAodGlsZSA9PT0gbGFzdFRpbGUpIHtcbiAgICAgICAgLy9Gb3VuZCBhIHBhaXJcbiAgICAgICAgcGFpcnMrKztcblxuICAgICAgICBpZiAocGFpcnMgPT09IChjb2xzICogcm93cykgLyAyKSB7XG4gICAgICAgICAgdGV4dERpdi5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodC1ibHVlJyk7XG4gICAgICAgICAgdGV4dERpdi5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodGVuLTQnKTtcbiAgICAgICAgICB0ZXh0RGl2LmlubmVyVGV4dCA9ICdZb3UgV29uISAnICsgJ3dpdGggJysgdHJpZXMgKyAnIHRyaWVzISc7XG4gICAgICB9XG4gICAgICAgIC8vVHVybiBiYWNrIHRoZSBicmlja3NcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHR1cm4xLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncmVtb3ZlZCcpO1xuICAgICAgICAgIHR1cm4yLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgncmVtb3ZlZCcpO1xuXG4gICAgICAgICAgdHVybjEgPSBudWxsO1xuICAgICAgICAgIHR1cm4yID0gbnVsbDtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0dXJuMS5zcmMgPSAnaW1hZ2UvMC5qcGcnO1xuICAgICAgICAgIHR1cm4yLnNyYyA9ICdpbWFnZS8wLmpwZyc7XG5cbiAgICAgICAgICB0dXJuMSA9IG51bGw7XG4gICAgICAgICAgdHVybjIgPSBudWxsO1xuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNodWZmbGUgdGhlIHRpbGVzXG4gICAqIEByZXR1cm5zIHtBcnJheX06IHRoZSBzaHVmZmxlZCBhcnJheSBvZiB0aWxlc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0UGljdHVyZUFycmF5KCkge1xuICAgIHZhciBpO1xuICAgIHZhciBhcnIgPSBbXTtcblxuICAgIGZvciAoaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKykge1xuICAgICAgYXJyLnB1c2goaSk7XG4gICAgICBhcnIucHVzaChpKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIHZhciB0ZW1wID0gYXJyW2ldO1xuICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcblxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhhdGVtIG9uIDIwMTYtMTAtMTcuXG4gKi9cbnZhciBjb3VudGVyID0gMDsgICAgLy9Db3VudHMgdGhlIG51bWJlciBvZiB3aW5kb3dzXG52YXIgY3VycmVudERpdjsgICAgIC8vVGhlIGN1cnJlbnQgc2VsZWN0ZWQgd2luZG93XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGljb25OYW1lLCB0aXRsZSwgc29ja2V0KSB7XG4gIGNvdW50ZXIrKztcbiAgY29uc29sZS5sb2coY291bnRlciArIFwid2luZG93IGNyZWF0ZWRcIik7XG5cbiAgLy9BZGRpbmcgdGhlIHRlbXBsYXRlXG4gIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5kb3dfdGVtcCcpO1xuICB2YXIgd2luZG93RGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgLy9UT0RPOiBTZXQgd2luZG93IHRpdGxlXG4gIHdpbmRvd0Rpdi50aXRsZSA9IHRpdGxlO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXS5hcHBlbmRDaGlsZCh3aW5kb3dEaXYpO1xuXG4gIC8vU2V0IHRoZSB3aW5kb3cgaWNvblxuICB2YXIgaWNvbiA9IHdpbmRvd0Rpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3aW5kb3dfaWNvbicpWzBdO1xuICBpY29uLmlubmVyVGV4dCA9IGljb25OYW1lO1xuXG4gIC8vV2luZG93IHBvc2l0aW9uIHVwb24gY3JlYXRpb25cbiAgZGl2TW92ZSgpO1xuXG4gIC8vQWRkaW5nIGNsaWNrIGxpc3RlbmVyIHRvIHRoZSB3aW5kb3dcbiAgd2luZG93RGl2LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGN1cnJlbnREaXYgIT0gdW5kZWZpbmVkKVxuICAgICAgY3VycmVudERpdi5zdHlsZS56SW5kZXggPSAxO1xuICAgIHdpbmRvd0Rpdi5zdHlsZS56SW5kZXggPSAzOyAgICAgLy9CcmluZyB0aGUgc2VsZWN0ZWQgd2luZG93IG9uIHRvcCBvZiBldmVyeXRoaW5nXG4gICAgY3VycmVudERpdiA9IHdpbmRvd0RpdjtcbiAgfSk7XG5cbiAgLy9BZGRpbmcgdGhlIERyYWcgbGlzdGVuZXJzXG4gIHdpbmRvd0Rpdi5maXJzdEVsZW1lbnRDaGlsZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd24sIGZhbHNlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwLCBmYWxzZSk7XG5cbiAgLy9BZGRpbmcgdGhlIENsb3NlIGxpc3RlbmVyXG4gIHZhciBjbG9zZSA9IHdpbmRvd0Rpdi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjbG9zZV9hJylbMF07XG4gIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB3aW5kb3dEaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh3aW5kb3dEaXYpO1xuICB9KTtcblxuICBpZiAodGl0bGUuaW5jbHVkZXMoJ21lbW9yeScpKVxuICAgIHN0YXJ0TWVtb3J5R2FtZSgpO1xuICBlbHNlIGlmICh0aXRsZS5pbmNsdWRlcygnQ2hhdCcpKVxuICAgIHN0YXJ0Q2hhdCgpO1xuXG4gIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG4gICAgd2luZG93RGl2LnN0eWxlLm9wYWNpdHkgPSAxOyAgICAvL0RlZm9jdXMgdGhlIHdpbmRvdyBhZnRlciBkcmFnZ2luZyBpcyBkb25lXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VEb3duKGUpIHtcbiAgICB3aW5kb3dEaXYuc3R5bGUub3BhY2l0eSA9IDAuNzsgICAgICAvL0ZvY3VzaW5nIHRoZSB3aW5kb3cgd2hpbGUgZHJhZ2dpbmdcbiAgICB4UG9zID0gZS5jbGllbnRYIC0gd2luZG93RGl2Lm9mZnNldExlZnQ7XG4gICAgeVBvcyA9IGUuY2xpZW50WSAtIHdpbmRvd0Rpdi5vZmZzZXRUb3A7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRpdk1vdmUsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGl2TW92ZShlKSB7XG4gICAgaWYoZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS50b3AgPSAoZS5jbGllbnRZIC0geVBvcykgKyAncHgnO1xuICAgICAgd2luZG93RGl2LnN0eWxlLmxlZnQgPSAoZS5jbGllbnRYIC0geFBvcykgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1RPRE86IHN0aWxsIG5lZWQgdG8gY2hlY2sgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHdpbmRvdyBjcmVhdGlvblxuICAgICAgdmFyIHJlY3QgPSB3aW5kb3dEaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBpZigocmVjdC55ICsgcmVjdC5oZWlnaHQpIDwgMClcbiAgICAgICAgY291bnRlciA9IDE7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUudG9wID0gY291bnRlciAqIDIwICsgJ3B4JztcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS5sZWZ0ID0gIGNvdW50ZXIgKiAyMCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBNZW1vcnkgZ2FtZVxuICAgKi9cbiAgZnVuY3Rpb24gc3RhcnRNZW1vcnlHYW1lKCkge1xuICAgIHZhciBzdGFydEdhbWVGbGFnID0gZmFsc2U7XG4gICAgdmFyIHJvd3M7XG4gICAgdmFyIGNvbHM7XG4gICAgdmFyIGFuc3dlcjtcbiAgICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnknKTtcblxuICAgIC8vQXNrIHRoZSBwbGF5ZXIgZm9yIHRoZSBudW1iZXIgb2YgdGlsZXNcbiAgICB2YXIgdGlsZXNOdW1iZXJEaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aWxlc190ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgd2luZG93RGl2LmFwcGVuZENoaWxkKHRpbGVzTnVtYmVyRGl2KTtcblxuICAgIC8vVG8gY2hlY2sgd2hpY2ggb3B0aW9uIGlzIGNob3NlblxuICAgIC8vdmFyIHNlbGVjdGlvbkRpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGlsZXNOdW1iZXJEaXYubGFzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgLy90aWxlc051bWJlckRpdi5hcHBlbmRDaGlsZChzZWxlY3Rpb25EaXYpO1xuICAgIHZhciBzZWxlY3Rpb25EaXYgPSB0aWxlc051bWJlckRpdi5sYXN0RWxlbWVudENoaWxkO1xuICAgIHNlbGVjdGlvbkRpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGFuc3dlciA9IGV2ZW50LnRhcmdldC5jbGFzc0xpc3Q7XG5cbiAgICAgIGlmIChhbnN3ZXIuY29udGFpbnMoJzEnKSkge1xuICAgICAgICByb3dzID0gNDtcbiAgICAgICAgY29scyA9IDQ7XG4gICAgICB9IGVsc2UgaWYgKGFuc3dlci5jb250YWlucygnMicpKSB7XG4gICAgICAgIHJvd3MgPSAyO1xuICAgICAgICBjb2xzID0gMjtcbiAgICAgIH0gZWxzZSBpZiAoYW5zd2VyLmNvbnRhaW5zKCczJykpIHtcbiAgICAgICAgcm93cyA9IDI7XG4gICAgICAgIGNvbHMgPSA0XG4gICAgICB9XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHdpbmRvd0Rpdi5yZW1vdmVDaGlsZCh0aWxlc051bWJlckRpdik7XG4gICAgICBuZXcgY3JlYXRlTWVtb3J5KHJvd3MsIGNvbHMsIHdpbmRvd0Rpdik7XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgQ2hhdFxuICAgKi9cbiAgZnVuY3Rpb24gc3RhcnRDaGF0KCkge1xuICAgIHZhciBzdGFydENoYXQgPSByZXF1aXJlKCcuL2NoYXQnKTtcbiAgICB2YXIgdXNlck5hbWU7XG4gICAgdmFyIHdpbmRvd3NMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93Jyk7XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIHVzZXJOYW1lX3RlbXAgPSBkb2N1bWVudC5pbXBvcnROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZV9jaGF0X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICAgIHdpbmRvd0Rpdi5hcHBlbmRDaGlsZCh1c2VyTmFtZV90ZW1wKTtcblxuICAgICAgdmFyIHN1Ym1pdEFucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXRfYnV0dG9uJyk7XG4gICAgICBzdWJtaXRBbnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdXNlck5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcl9hbnN3ZXInKS52YWx1ZTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgdXNlck5hbWUpO1xuICAgICAgICB3aW5kb3dEaXYucmVtb3ZlQ2hpbGQodXNlck5hbWVfdGVtcCk7XG4gICAgICAgIG5ldyBzdGFydENoYXQodXNlck5hbWUsIHdpbmRvd0Rpdiwgc29ja2V0KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyTmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VybmFtZScpO1xuICAgICAgbmV3IHN0YXJ0Q2hhdCh1c2VyTmFtZSwgd2luZG93RGl2LCBzb2NrZXQpO1xuICAgIH1cbiAgfVxufTtcbiJdfQ==
