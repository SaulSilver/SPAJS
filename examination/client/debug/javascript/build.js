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

  var tiles = getPictureArray(rows, cols);
  var container = windowDiv.getElementsByClassName('window_container')[0];
  var template = document.getElementById('memory_temp').content.firstElementChild;

  tiles.forEach(function (tile, index) {

    a = document.importNode(template, true);
    container.appendChild(a);

    a.addEventListener('click', function (event) {
      var img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild;
      turnBrick(tile, index, img)
    });

    if ((index + 1) % cols === 0)
      container.appendChild(document.createElement('br'));
  });

  function turnBrick(tile, index, img) {
    img.src = 'image/' + tile + '.jpg';

    if (!turn1) {
      turn1 = img;
      lastTile = tile;
    } else {
      if (img === turn1) {return;}

      turn2 = img;
      if (tile === lastTile) {
        console.log('pair!');

        window.setTimeout(function () {
          turn1.parentNode.classList.add('removed');
          turn2.parentNode.classList.add('removed');

          turn1 = null;
          turn2 = null;
        }, 200);
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
  function getPictureArray(rows, cols) {
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
    new createMemory(4, 4, windowDiv);
  }


  function startChat() {
    var socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
  }
};

},{"./memory":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOS4xL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvdy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNyZWF0ZVdpbmRvdyA9IHJlcXVpcmUoJy4vd2luZG93Jyk7XG5cbnZhciBtZW1vcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X2J1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICBjcmVhdGVXaW5kb3coJ2dhbWVzJywgJ21lbW9yeV90ZW1wJyk7XG4gIH1cbik7XG5cbnZhciBjaGF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXRfYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjcmVhdGVXaW5kb3coJ2NoYXQnLCAnRWwtQ2hhdCcpO1xuICB9XG4pO1xuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgaGF0ZW0gb24gMjAxNi0xMC0xOS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm93cywgY29scywgd2luZG93RGl2KSB7XG4gIHZhciBpO1xuICB2YXIgYTtcbiAgdmFyIHR1cm4xO1xuICB2YXIgdHVybjI7XG4gIHZhciBsYXN0VGlsZTtcblxuICB2YXIgdGlsZXMgPSBnZXRQaWN0dXJlQXJyYXkocm93cywgY29scyk7XG4gIHZhciBjb250YWluZXIgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93X2NvbnRhaW5lcicpWzBdO1xuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVtb3J5X3RlbXAnKS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkO1xuXG4gIHRpbGVzLmZvckVhY2goZnVuY3Rpb24gKHRpbGUsIGluZGV4KSB7XG5cbiAgICBhID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGEpO1xuXG4gICAgYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGltZyA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICB0dXJuQnJpY2sodGlsZSwgaW5kZXgsIGltZylcbiAgICB9KTtcblxuICAgIGlmICgoaW5kZXggKyAxKSAlIGNvbHMgPT09IDApXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHR1cm5Ccmljayh0aWxlLCBpbmRleCwgaW1nKSB7XG4gICAgaW1nLnNyYyA9ICdpbWFnZS8nICsgdGlsZSArICcuanBnJztcblxuICAgIGlmICghdHVybjEpIHtcbiAgICAgIHR1cm4xID0gaW1nO1xuICAgICAgbGFzdFRpbGUgPSB0aWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW1nID09PSB0dXJuMSkge3JldHVybjt9XG5cbiAgICAgIHR1cm4yID0gaW1nO1xuICAgICAgaWYgKHRpbGUgPT09IGxhc3RUaWxlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwYWlyIScpO1xuXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0dXJuMS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcbiAgICAgICAgICB0dXJuMi5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3JlbW92ZWQnKTtcblxuICAgICAgICAgIHR1cm4xID0gbnVsbDtcbiAgICAgICAgICB0dXJuMiA9IG51bGw7XG4gICAgICAgIH0sIDIwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHVybjEuc3JjID0gJ2ltYWdlLzAuanBnJztcbiAgICAgICAgICB0dXJuMi5zcmMgPSAnaW1hZ2UvMC5qcGcnO1xuXG4gICAgICAgICAgdHVybjEgPSBudWxsO1xuICAgICAgICAgIHR1cm4yID0gbnVsbDtcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRQaWN0dXJlQXJyYXkocm93cywgY29scykge1xuICAgIHZhciBpO1xuICAgIHZhciBhcnIgPSBbXTtcblxuICAgIGZvciAoaSA9IDE7IGkgPD0gKHJvd3MgKiBjb2xzKSAvIDI7IGkrKykge1xuICAgICAgYXJyLnB1c2goaSk7XG4gICAgICBhcnIucHVzaChpKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgIHZhciB0ZW1wID0gYXJyW2ldO1xuICAgICAgYXJyW2ldID0gYXJyW2pdO1xuICAgICAgYXJyW2pdID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxufTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTE3LlxuICovXG52YXIgY291bnRlciA9IDA7ICAgIC8vQ291bnRzIHRoZSBudW1iZXIgb2Ygd2luZG93c1xudmFyIGN1cnJlbnREaXY7ICAgICAvL1RoZSBjdXJyZW50IHNlbGVjdGVkIHdpbmRvd1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGljb25OYW1lLCB0aXRsZSkge1xuICBjb3VudGVyKys7XG4gIGNvbnNvbGUubG9nKGNvdW50ZXIgKyBcIndpbmRvdyBjcmVhdGVkXCIpO1xuXG4gIC8vQWRkaW5nIHRoZSB0ZW1wbGF0ZVxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2luZG93X3RlbXAnKTtcbiAgdmFyIHdpbmRvd0RpdiA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIC8vVE9ETzogU2V0IHdpbmRvdyB0aXRsZVxuICB3aW5kb3dEaXYudGl0bGUgPSB0aXRsZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0uYXBwZW5kQ2hpbGQod2luZG93RGl2KTtcblxuICAvL1NldCB0aGUgd2luZG93IGljb25cbiAgdmFyIGljb24gPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2luZG93X2ljb24nKVswXTtcbiAgaWNvbi5pbm5lclRleHQgPSBpY29uTmFtZTtcblxuICAvL1dpbmRvdyBwb3NpdGlvbiB1cG9uIGNyZWF0aW9uXG4gIGRpdk1vdmUoKTtcblxuICAvL0FkZGluZyBjbGljayBsaXN0ZW5lciB0byB0aGUgd2luZG93XG4gIHdpbmRvd0Rpdi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChjdXJyZW50RGl2ICE9IHVuZGVmaW5lZClcbiAgICAgIGN1cnJlbnREaXYuc3R5bGUuekluZGV4ID0gMTtcbiAgICB3aW5kb3dEaXYuc3R5bGUuekluZGV4ID0gMzsgICAgIC8vQnJpbmcgdGhlIHNlbGVjdGVkIHdpbmRvdyBvbiB0b3Agb2YgZXZlcnl0aGluZ1xuICAgIGN1cnJlbnREaXYgPSB3aW5kb3dEaXY7XG4gIH0pO1xuXG4gIC8vQWRkaW5nIHRoZSBEcmFnIGxpc3RlbmVyc1xuICB3aW5kb3dEaXYuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duLCBmYWxzZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCwgZmFsc2UpO1xuXG4gIC8vQWRkaW5nIHRoZSBDbG9zZSBsaXN0ZW5lclxuICB2YXIgY2xvc2UgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2VfYScpWzBdO1xuICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgd2luZG93RGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2luZG93RGl2KTtcbiAgfSk7XG5cbiAgaWYgKHRpdGxlLmluY2x1ZGVzKCdtZW1vcnknKSlcbiAgICBzdGFydE1lbW9yeUdhbWUoKTtcbiAgZWxzZSBpZiAodGl0bGUuaW5jbHVkZXMoJ0NoYXQnKSlcbiAgICBzdGFydENoYXQoKTtcblxuICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuICAgIHdpbmRvd0Rpdi5zdHlsZS5vcGFjaXR5ID0gMTsgICAgLy9EZWZvY3VzIHRoZSB3aW5kb3cgYWZ0ZXIgZHJhZ2dpbmcgaXMgZG9uZVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihlKSB7XG4gICAgd2luZG93RGl2LnN0eWxlLm9wYWNpdHkgPSAwLjc7ICAgICAgLy9Gb2N1c2luZyB0aGUgd2luZG93IHdoaWxlIGRyYWdnaW5nXG4gICAgeFBvcyA9IGUuY2xpZW50WCAtIHdpbmRvd0Rpdi5vZmZzZXRMZWZ0O1xuICAgIHlQb3MgPSBlLmNsaWVudFkgLSB3aW5kb3dEaXYub2Zmc2V0VG9wO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpdk1vdmUoZSkge1xuICAgIGlmKGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUudG9wID0gKGUuY2xpZW50WSAtIHlQb3MpICsgJ3B4JztcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS5sZWZ0ID0gKGUuY2xpZW50WCAtIHhQb3MpICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UT0RPOiBzdGlsbCBuZWVkIHRvIGNoZWNrIHRoZSBib3VuZGFyaWVzIG9mIHRoZSB3aW5kb3cgY3JlYXRpb25cbiAgICAgIHZhciByZWN0ID0gd2luZG93RGl2LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgaWYoKHJlY3QueSArIHJlY3QuaGVpZ2h0KSA8IDApXG4gICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgd2luZG93RGl2LnN0eWxlLnRvcCA9IGNvdW50ZXIgKiAyMCArICdweCc7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUubGVmdCA9ICBjb3VudGVyICogMjAgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0TWVtb3J5R2FtZSgpIHtcbiAgICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnknKTtcbiAgICBuZXcgY3JlYXRlTWVtb3J5KDQsIDQsIHdpbmRvd0Rpdik7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHN0YXJ0Q2hhdCgpIHtcbiAgICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC8nKTtcbiAgfVxufTtcbiJdfQ==
