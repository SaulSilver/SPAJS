var windowListener = require('./window');

var memory = document.getElementById('memory_button');
memory.addEventListener('click', function (event) {
  var template = document.getElementById("window_temp");
  var temp_clone = document.importNode(template.content.firstElementChild, true);
  document.getElementsByTagName('ul')[0].appendChild(temp_clone);
  windowListener();
  }
);


