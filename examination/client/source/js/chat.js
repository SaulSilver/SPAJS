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
