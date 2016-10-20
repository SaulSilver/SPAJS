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
