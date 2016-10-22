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
