function doIncrement(increment) {
  var w = parseInt(document.getElementById('progressBar').style.width);
  document.getElementById('progressBar').style.width= (w + increment) +'%';
}

var speed = 10;
var increment = (speed/100);
for(var x = 0; x<speed; x++) {
  setTimeout(doIncrement(increment),1000);
}