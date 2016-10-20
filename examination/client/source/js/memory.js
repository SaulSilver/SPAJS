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
