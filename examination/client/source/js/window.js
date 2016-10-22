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
