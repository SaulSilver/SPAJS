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
  tiles = getPictureArray();    //Shuffle the array
  var container = windowDiv.getElementsByClassName('window_container')[0];
  var templateDiv = document.getElementById('memory_temp').content.firstElementChild;

  var div = document.importNode(templateDiv.firstElementChild, false);
  var textDiv = document.importNode(document.getElementById('memory_temp').content.lastElementChild, false);
  textDiv.innerText = 'Number of tries: ' + tries;

  tiles.forEach(function (tile, index) {

    a = document.importNode(templateDiv.firstElementChild, true);
    a.firstElementChild.setAttribute('data-bricknumber', index);
    div.appendChild(a);

    //New line
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
        //Turn back the bricks
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

  /**
   * Shuffle the tiles
   * @returns {Array}: the shuffled array of tiles
   */
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

