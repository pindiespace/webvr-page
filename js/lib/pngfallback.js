FeatureDetector.load([
  [
    {name: 'html5', path: 'js/lib/html5shiv.min.js', poly: true}
  ]], function () {
    console.log("added HTML5 Shiv");
    // Replace canvas tags with images.
    var c = document.getElementsByTagName('canvas');
    console.log('c.length:' + c.length)
    // Replace each canvas with a default image.
    for(var i = 0; i < c.length; i++) {
      //TODO: change so both canvas tags are replaced.
      console.log('replacing canvas tag id:' + c[i].id);
      var img = document.createElement('img');
      img.src = 'img/fallback.png';
      img.style.display = 'block';
      var parentNode = c[i].parentNode;
      parentNode.insertBefore(img, c[i]);
    }
  },
  function (percent) {
    console.log('progress function, ' + percent + '%');
    var prog = document.getElementById('webvr-page-load-progress');
    if(prog) {
      // ie8 won't write to innerHTML here.
      prog.parentNode.innerHTML = '<progress value=' + percent + '>' + percent + '%</progress>'
    }
  },
  function (err) {
    console.log('error function')
  }
);
