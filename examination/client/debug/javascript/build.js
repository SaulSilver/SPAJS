(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./window":2}],2:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-17.
 */
var counter = 0;    //Counts the number of windows

module.exports = function() {
  counter++;
  console.log(counter + "window created");

  //Adding the template
  var template = document.getElementById('window_temp');
  var windowDiv = document.importNode(template.content.firstElementChild, true);
  document.getElementsByTagName('ul')[0].appendChild(windowDiv);

  //Window position upon creation
  divMove();

  //Adding the Drag listeners
  windowDiv.firstElementChild.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);

  //Adding the Close listener
  var close = windowDiv.getElementsByClassName('close_a')[0];
  close.addEventListener('click', function (e) {
    windowDiv.parentNode.removeChild(windowDiv);
  });

  function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
  }

  function mouseDown(e) {
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
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOC4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY3JlYXRlV2luZG93ID0gcmVxdWlyZSgnLi93aW5kb3cnKTtcblxudmFyIG1lbW9yeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW1vcnlfYnV0dG9uJyk7XG5tZW1vcnkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgIGNyZWF0ZVdpbmRvdygpO1xuICB9XG4pO1xuXG52YXIgY2hhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGF0X2J1dHRvbicpO1xuY2hhdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHN0YXJ0Q2hhdDtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxuKTtcblxuZnVuY3Rpb24gc3RhcnRDaGF0KCkge1xuXG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgaGF0ZW0gb24gMjAxNi0xMC0xNy5cbiAqL1xudmFyIGNvdW50ZXIgPSAwOyAgICAvL0NvdW50cyB0aGUgbnVtYmVyIG9mIHdpbmRvd3NcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgY291bnRlcisrO1xuICBjb25zb2xlLmxvZyhjb3VudGVyICsgXCJ3aW5kb3cgY3JlYXRlZFwiKTtcblxuICAvL0FkZGluZyB0aGUgdGVtcGxhdGVcbiAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbmRvd190ZW1wJyk7XG4gIHZhciB3aW5kb3dEaXYgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXS5hcHBlbmRDaGlsZCh3aW5kb3dEaXYpO1xuXG4gIC8vV2luZG93IHBvc2l0aW9uIHVwb24gY3JlYXRpb25cbiAgZGl2TW92ZSgpO1xuXG4gIC8vQWRkaW5nIHRoZSBEcmFnIGxpc3RlbmVyc1xuICB3aW5kb3dEaXYuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duLCBmYWxzZSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCwgZmFsc2UpO1xuXG4gIC8vQWRkaW5nIHRoZSBDbG9zZSBsaXN0ZW5lclxuICB2YXIgY2xvc2UgPSB3aW5kb3dEaXYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2VfYScpWzBdO1xuICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgd2luZG93RGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2luZG93RGl2KTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gbW91c2VVcCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZGl2TW92ZSwgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZURvd24oZSkge1xuICAgIHhQb3MgPSBlLmNsaWVudFggLSB3aW5kb3dEaXYub2Zmc2V0TGVmdDtcbiAgICB5UG9zID0gZS5jbGllbnRZIC0gd2luZG93RGl2Lm9mZnNldFRvcDtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZGl2TW92ZSwgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBkaXZNb3ZlKGUpIHtcbiAgICBpZihlICE9IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93RGl2LnN0eWxlLnRvcCA9IChlLmNsaWVudFkgLSB5UG9zKSArICdweCc7XG4gICAgICB3aW5kb3dEaXYuc3R5bGUubGVmdCA9IChlLmNsaWVudFggLSB4UG9zKSArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vVE9ETzogc3RpbGwgbmVlZCB0byBjaGVjayB0aGUgYm91bmRhcmllcyBvZiB0aGUgd2luZG93IGNyZWF0aW9uXG4gICAgICB2YXIgcmVjdCA9IHdpbmRvd0Rpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGlmKChyZWN0LnkgKyByZWN0LmhlaWdodCkgPCAwKVxuICAgICAgICBjb3VudGVyID0gMTtcbiAgICAgIHdpbmRvd0Rpdi5zdHlsZS50b3AgPSBjb3VudGVyICogMjAgKyAncHgnO1xuICAgICAgd2luZG93RGl2LnN0eWxlLmxlZnQgPSAgY291bnRlciAqIDIwICsgJ3B4JztcbiAgICB9XG4gIH1cbn07XG4iXX0=
