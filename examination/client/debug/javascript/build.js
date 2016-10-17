(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var windowListener = require('./window');

var memory = document.getElementById('memory_button');
memory.addEventListener('click', function (event) {
  var template = document.getElementById("window_temp");
  var temp_clone = document.importNode(template.content.firstElementChild, true);
  document.getElementsByTagName('ul')[0].appendChild(temp_clone);
  windowListener();
  }
);



},{"./window":2}],2:[function(require,module,exports){
/**
 * Created by hatem on 2016-10-17.
 */

module.exports = function(){
  console.log('I am in the addListeners');
  document.getElementById('div_container').addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);
};

function mouseUp() {
  window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  var div = document.getElementById('div_container');
  xPos = e.clientX - div.offsetLeft;
  yPos = e.clientY - div.offsetTop;
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  var div = document.getElementById('div_container');
  div.style.top = (e.clientY - yPos) + 'px';
  div.style.left = (e.clientX - xPos) + 'px';
}


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjYuOC4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgd2luZG93TGlzdGVuZXIgPSByZXF1aXJlKCcuL3dpbmRvdycpO1xuXG52YXIgbWVtb3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbW9yeV9idXR0b24nKTtcbm1lbW9yeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpbmRvd190ZW1wXCIpO1xuICB2YXIgdGVtcF9jbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdLmFwcGVuZENoaWxkKHRlbXBfY2xvbmUpO1xuICB3aW5kb3dMaXN0ZW5lcigpO1xuICB9XG4pO1xuXG5cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBoYXRlbSBvbiAyMDE2LTEwLTE3LlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgY29uc29sZS5sb2coJ0kgYW0gaW4gdGhlIGFkZExpc3RlbmVycycpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2X2NvbnRhaW5lcicpLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93biwgZmFsc2UpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXAsIGZhbHNlKTtcbn07XG5cbmZ1bmN0aW9uIG1vdXNlVXAoKSB7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gbW91c2VEb3duKGUpIHtcbiAgdmFyIGRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZfY29udGFpbmVyJyk7XG4gIHhQb3MgPSBlLmNsaWVudFggLSBkaXYub2Zmc2V0TGVmdDtcbiAgeVBvcyA9IGUuY2xpZW50WSAtIGRpdi5vZmZzZXRUb3A7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBkaXZNb3ZlLCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gZGl2TW92ZShlKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2X2NvbnRhaW5lcicpO1xuICBkaXYuc3R5bGUudG9wID0gKGUuY2xpZW50WSAtIHlQb3MpICsgJ3B4JztcbiAgZGl2LnN0eWxlLmxlZnQgPSAoZS5jbGllbnRYIC0geFBvcykgKyAncHgnO1xufVxuXG4iXX0=
