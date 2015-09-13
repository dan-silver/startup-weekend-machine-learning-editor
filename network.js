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
  $scope.nn_layers = [new Layer(5, 'linear'), new Layer(50, 'linear')]
  $scope.layerTypes = ['Linear', 'Gaussian', 'Softmax', 'Rectifier']
  $scope.num_iter = 15;
  $scope.learning_rate = 3;
  $scope.accuracyScore = 0;
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

  $scope.trainNN = function() {
    var l = Ladda.create(
      document.querySelector( '#trainBtn' )
    );

    l.start();

    var data = {
      num_iter: $scope.num_iter.toString(),
      learning_rate: (0.005).toString(),
      dataset: getFileName() || "wine",
      layers: $scope.nn_layers.map(function(a) { return {type:a.type.capitalizeFirstLetter(), size: a.size}})
    }
    // debugger;
    $http.post('http://localhost:5000/train', data).
      then(function(response) {
        $scope.accuracyScore = Math.round(parseFloat(response.data) * 10000) / 100
        l.stop();
  }, function(response) {
        l.stop();
  });

    // $.ajax({
    //     type: "POST",
    //     url: "http://localhost:5000/train",
    //     dataType: 'json',
    //     data:JSON.stringify({
    //       "num_iter":"10",
    //       "learning_rate":"0.005",
    //       "dataset":"wine",
    //       "layers":
    //          [
    //             {"type":"Linear","size":5},
    //             {"type":"Linear","size":1}
    //         ]
    //     }),
    //     contentType: "application/json",
    //     complete: function (d) {
    //       debugger;
    //     }
    // });
  }
});


$(function() {
  // Ladda.bind( 'input[type=submit], button' );
  $('#upload_link').click(function(){
    $('#myFile').click();
  })
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
