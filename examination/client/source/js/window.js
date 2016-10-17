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

