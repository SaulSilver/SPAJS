(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var createWindow = require('./window');

var memory = document.getElementById('memory_button').addEventListener('click', function (event) {

    createWindow('games', 'memory_temp');
  }
);

var chat = document.getElementById('chat_button').addEventListener('click', function (event) {
    createWindow('chat', 'El-Chat');
  }
);


},{"./window":3}],2:[function(require,module,exports){
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
  tiles = getPictureArray();
  var container = windowDiv.getElementsByClassName('window_container')[0];
  var templateDiv = document.getElementById('memory_temp').content.firstElementChild;

  var div = document.importNode(templateDiv.firstElementChild, false);
  var textDiv = document.importNode(document.getElementById('memory_temp').content.lastElementChild, false);
  textDiv.innerText = 'Number of tries: ' + tries;

  tiles.forEach(function (tile, index) {

    a = document.importNode(templateDiv.firstElementChild, true);
    a.firstElementChild.setAttribute('data-bricknumber', index);
    div.appendChild(a);


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

},{}],3:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-17.
 */
var counter = 0;    //Counts the number of windows
var currentDiv;     //The current selected window
module.exports = function(iconName, title) {
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

  function startMemoryGame() {
    var createMemory = require('./memory');
    //TODO:Ask the player for the number of tiles
    new createMemory(2, 2, windowDiv);
  }


  function startChat() {
    var socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
  }
};

},{"./memory":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOS4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY3JlYXRlV2luZG93ID0gcmVxdWlyZSgnLi93aW5kb3cnKTtcblxudmFyIG1lbW9yeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW1vcnlfYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgIGNyZWF0ZVdpbmRvdygnZ2FtZXMnLCAnbWVtb3J5X3RlbXAnKTtcbiAgfVxuKTtcblxudmFyIGNoYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhdF9idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNyZWF0ZVdpbmRvdygnY2hhdCcsICdFbC1DaGF0Jyk7XG4gIH1cbik7XG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTE5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3dzLCBjb2xzLCB3aW5kb3dEaXYpIHtcbiAgdmFyIGk7XG4gIHZhciBhO1xuICB2YXIgdHVybjE7XG4gIHZhciB0dXJuMjtcbiAgdmFyIGxhc3RUaWxlO1xuICB2YXIgcGFpcnMgPSAwO1xuICB2YXIgdHJpZXMgPSAwO1xuXG4gIHZhciB0aWxlcyA9IFtdO1xuICB0aWxlcyA9IGdldFBpY3R1cmVBcnJheSgpO1xuICB2YXIgY29udGFpbmVyID0gd2luZG93RGl2LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3dpbmRvd19jb250YWluZXInKVswXTtcbiAgdmFyIHRlbXBsYXRlRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbW9yeV90ZW1wJykuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICB2YXIgZGl2ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZURpdi5maXJzdEVsZW1lbnRDaGlsZCwgZmFsc2UpO1xuICB2YXIgdGV4dERpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbW9yeV90ZW1wJykuY29udGVudC5sYXN0RWxlbWVudENoaWxkLCBmYWxzZSk7XG4gIHRleHREaXYuaW5uZXJUZXh0ID0gJ051bWJlciBvZiB0cmllczogJyArIHRyaWVzO1xuXG4gIHRpbGVzLmZvckVhY2goZnVuY3Rpb24gKHRpbGUsIGluZGV4KSB7XG5cbiAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZURpdi5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgYS5maXJzdEVsZW1lbnRDaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYnJpY2tudW1iZXInLCBpbmRleCk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGEpO1xuXG5cbiAgICBpZiAoKGluZGV4ICsgMSkgJSBjb2xzID09PSAwKVxuICAgICAgZGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICB9KTtcblxuICBkaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBpbWcgPSBldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdJTUcnID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBpbmRleCA9IHBhcnNlSW50KGltZy5nZXRBdHRyaWJ1dGUoJ2RhdGEtYnJpY2tudW1iZXInKSk7XG4gICAgdHVybkJyaWNrKHRpbGVzW2luZGV4XSwgaW5kZXgsIGltZyk7XG4gIH0pO1xuXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGV4dERpdik7XG5cbiAgZnVuY3Rpb24gdHVybkJyaWNrKHRpbGUsIGluZGV4LCBpbWcpIHtcbiAgICBpZiAodHVybjIpXG4gICAgICByZXR1cm47XG5cbiAgICBpbWcuc3JjID0gJ2ltYWdlLycgKyB0aWxlICsgJy5qcGcnO1xuXG4gICAgaWYgKCF0dXJuMSkge1xuICAgICAgdHVybjEgPSBpbWc7XG4gICAgICBsYXN0VGlsZSA9IHRpbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vU2Vjb25kIGJyaWNrIGlzIGNsaWNrZWRcbiAgICAgIGlmIChpbWcgPT09IHR1cm4xKVxuICAgICAgICByZXR1cm47XG4gICAgICB0cmllcysrO1xuICAgICAgdGV4dERpdi5pbm5lclRleHQgPSAnTnVtYmVyIG9mIHRyaWVzOiAnICsgdHJpZXM7XG4gICAgICB0dXJuMiA9IGltZztcbiAgICAgIGlmICh0aWxlID09PSBsYXN0VGlsZSkge1xuICAgICAgICAvL0ZvdW5kIGEgcGFpclxuICAgICAgICBwYWlycysrO1xuXG4gICAgICAgIGlmIChwYWlycyA9PT0gKGNvbHMgKiByb3dzKSAvIDIpIHtcbiAgICAgICAgICB0ZXh0RGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2xpZ2h0LWJsdWUnKTtcbiAgICAgICAgICB0ZXh0RGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2xpZ2h0ZW4tNCcpO1xuICAgICAgICAgIHRleHREaXYuaW5uZXJUZXh0ID0gJ1lvdSBXb24hICcgKyAnd2l0aCAnKyB0cmllcyArICcgdHJpZXMhJztcbiAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHVybjEucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdyZW1vdmVkJyk7XG4gICAgICAgICAgdHVybjIucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdyZW1vdmVkJyk7XG5cbiAgICAgICAgICB0dXJuMSA9IG51bGw7XG4gICAgICAgICAgdHVybjIgPSBudWxsO1xuICAgICAgICB9LCAxMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHR1cm4xLnNyYyA9ICdpbWFnZS8wLmpwZyc7XG4gICAgICAgICAgdHVybjIuc3JjID0gJ2ltYWdlLzAuanBnJztcblxuICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQaWN0dXJlQXJyYXkoKSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIGFyciA9IFtdO1xuXG4gICAgZm9yIChpID0gMTsgaSA8PSAocm93cyAqIGNvbHMpIC8gMjsgaSsrKSB7XG4gICAgICBhcnIucHVzaChpKTtcbiAgICAgIGFyci5wdXNoKGkpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IGFyci5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgdmFyIHRlbXAgPSBhcnJbaV07XG4gICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICBhcnJbal0gPSB0ZW1wO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG59O1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhhdGVtIG9uIDIwMTYtMTAtMTcuXG4gKi9cbnZhciBjb3VudGVyID0gMDsgICAgLy9Db3VudHMgdGhlIG51bWJlciBvZiB3aW5kb3dzXG52YXIgY3VycmVudERpdjsgICAgIC8vVGhlIGN1cnJlbnQgc2VsZWN0ZWQgd2luZG93XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGljb25OYW1lLCB0aXRsZSkge1xuICBjb3VudGVyKys7XG4gIGNvbnNvbGUubG9nKGNvdW50ZXIgKyBcIndpbmRvdyBjcmVhdGVkXCIpO1xuXG4gIC8vQWRkaW5nIHRoZSB0ZW1wbGF0ZVxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2luZG93X3RlbXAnKTtcbiAgdmFyIHdpbmRvd0RpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIC8vVE9ETzogU2V0IHdpbmRvdyB0aXRsZVxuICB3aW5kb3dEaXYudGl0bGUgPSB0aXRsZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0uYXBwZW5kQ2hpbGQod2luZG93RGl2KTtcblxuICAvL1NldCB0aGUgd2luZG93IGljb25cbiAgdmFyIGljb24gPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93X2ljb24nKVswXTtcbiAgaWNvbi5pbm5lclRleHQgPSBpY29uTmFtZTtcblxuICAvL1dpbmRvdyBwb3NpdGlvbiB1cG9uIGNyZWF0aW9uXG4gIGRpdk1vdmUoKTtcblxuICAvL0FkZGluZyBjbGljayBsaXN0ZW5lciB0byB0aGUgd2luZG93XG4gIHdpbmRvd0Rpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChjdXJyZW50RGl2ICE9IHVuZGVmaW5lZClcbiAgICAgIGN1cnJlbnREaXYuc3R5bGUuekluZGV4ID0gMTtcbiAgICB3aW5kb3dEaXYuc3R5bGUuekluZGV4ID0gMzsgICAgIC8vQnJpbmcgdGhlIHNlbGVjdGVkIHdpbmRvdyBvbiB0b3Agb2YgZXZlcnl0aGluZ1xuICAgIGN1cnJlbnREaXYgPSB3aW5kb3dEaXY7XG4gIH0pO1xuXG4gIC8vQWRkaW5nIHRoZSBEcmFnIGxpc3RlbmVyc1xuICB3aW5kb3dEaXYuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duLCBmYWxzZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCwgZmFsc2UpO1xuXG4gIC8vQWRkaW5nIHRoZSBDbG9zZSBsaXN0ZW5lclxuICB2YXIgY2xvc2UgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2VfYScpWzBdO1xuICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgd2luZG93RGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2luZG93RGl2KTtcbiAgfSk7XG5cbiAgaWYgKHRpdGxlLmluY2x1ZGVzKCdtZW1vcnknKSlcbiAgICBzdGFydE1lbW9yeUdhbWUoKTtcbiAgZWxzZSBpZiAodGl0bGUuaW5jbHVkZXMoJ0NoYXQnKSlcbiAgICBzdGFydENoYXQoKTtcblxuICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuICAgIHdpbmRvd0Rpdi5zdHlsZS5vcGFjaXR5ID0gMTsgICAgLy9EZWZvY3VzIHRoZSB3aW5kb3cgYWZ0ZXIgZHJhZ2dpbmcgaXMgZG9uZVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihlKSB7XG4gICAgd2luZG93RGl2LnN0eWxlLm9wYWNpdHkgPSAwLjc7ICAgICAgLy9Gb2N1c2luZyB0aGUgd2luZG93IHdoaWxlIGRyYWdnaW5nXG4gICAgeFBvcyA9IGUuY2xpZW50WCAtIHdpbmRvd0Rpdi5vZmZzZXRMZWZ0O1xuICAgIHlQb3MgPSBlLmNsaWVudFkgLSB3aW5kb3dEaXYub2Zmc2V0VG9wO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpdk1vdmUoZSkge1xuICAgIGlmKGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUudG9wID0gKGUuY2xpZW50WSAtIHlQb3MpICsgJ3B4JztcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS5sZWZ0ID0gKGUuY2xpZW50WCAtIHhQb3MpICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UT0RPOiBzdGlsbCBuZWVkIHRvIGNoZWNrIHRoZSBib3VuZGFyaWVzIG9mIHRoZSB3aW5kb3cgY3JlYXRpb25cbiAgICAgIHZhciByZWN0ID0gd2luZG93RGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgaWYoKHJlY3QueSArIHJlY3QuaGVpZ2h0KSA8IDApXG4gICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgd2luZG93RGl2LnN0eWxlLnRvcCA9IGNvdW50ZXIgKiAyMCArICdweCc7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUubGVmdCA9ICBjb3VudGVyICogMjAgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0TWVtb3J5R2FtZSgpIHtcbiAgICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnknKTtcbiAgICAvL1RPRE86QXNrIHRoZSBwbGF5ZXIgZm9yIHRoZSBudW1iZXIgb2YgdGlsZXNcbiAgICBuZXcgY3JlYXRlTWVtb3J5KDIsIDIsIHdpbmRvd0Rpdik7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHN0YXJ0Q2hhdCgpIHtcbiAgICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC8nKTtcbiAgfVxufTtcbiJdfQ==
