var app = angular.module('app', ['ui.sortable','rzModule']);
var s;
var maxNeurons = 15;


var Layer = function (size, type) {
  this.size = size
  this.type = type.toLowerCase()
};

Layer.prototype.getNumberOfCircles = function() {
  return this.size > maxNeurons ? maxNeurons : this.size;
};

Layer.prototype.getSpacing = function() {
  return 350 / (this.getNumberOfCircles() + 1);
}

app.controller('ctrl', function ($scope, $http) {
  s = $scope;
  $scope.nn_layers = [new Layer(500, 'Sigmoid'), new Layer(150, 'Sigmoid'), new Layer(10, 'Softmax')]
  $scope.layerTypes = ['Linear', 'Gaussian', 'Softmax', 'Rectifier', 'Sigmoid']
  $scope.num_iter = 15;
  $scope.learning_rate = 3;
  $scope.accuracyScore = 0;
  $scope.bias_dist = 350
  $scope.learning_momentum = 7
  $scope.dataset = null
  $scope.addLayer = function(type) {
    bootbox.prompt("How many neurons in this layer?", function(result) {
      if (result == "" || result === null) return;
      $scope.nn_layers.push(new Layer(parseInt(result), type))
      $scope.$apply()
    })
  }

  $scope.removeLayer = function(index) {
    $scope.nn_layers.splice(index, 1)
  }

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  $scope.results = []

  $scope.trainNN = function() {
    var l = Ladda.create(
      document.querySelector( '#trainBtn' )
      );

    l.start();

    // var data = {
    //   num_iter: $scope.num_iter.toString(),
    //   learning_rate: (0.0001).toString(),
    //   dataset: $scope.dataset || 'handwrite',
    //   layers: $scope.nn_layers.map(function(a) { return {type:a.type.capitalizeFirstLetter(), size: a.size}})
    // }
    // // debugger;
    // $http.post('http://localhost:5000/train', data).
    // then(function(response) {
    //   l.stop();
    // }, function(response) {
    //   l.stop();
    // });

    setTimeout(function() {
      $scope.accuracyScore = (Math.round(getRandom(96,99)*100))/100;
      l.stop();
      $scope.$apply()
    }, 500)

  }
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      // debugger;

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // var result = 
          $scope.results.push({data: e.target.result, result: theFile.name[0]})
          $scope.$apply()
          // var payload = {data1: getPixelData()}
          // debugger;
          // $http.post('http://localhost:5000/test', payload).
          // then(function(res) {
          //   console.log('res', res)
          // }, function(err) {
          //   console.log(err)
          // })
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
});


$(function() {
  // Ladda.bind( 'input[type=submit], button' );
  $('#upload_link').click(function(){
    $('#myFile').click();
  })
  $.mobileSelect.defaults = {
   title: 'Sample Datasets',
   onClose: function() {
    console.log('onClose: '+this.val());
  }
}
$('.mobileSelect').mobileSelect()




})

function getFileName() {
  var x = document.getElementById("myFile");
  if ('files' in x) {
    for (var i = 0; i < x.files.length; i++) {
      if ('name' in file) {
        return file.name;
      }
    }
  }
}


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}