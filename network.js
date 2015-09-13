var app = angular.module('app', ['ui.sortable']);

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

app.controller('ctrl', function ($scope) {
  $scope.nn_layers = [new Layer(5, 'linear'), new Layer(50, 'linear')]
  $scope.layerTypes = ['Linear', 'Gaussian', 'Softmax', 'Rectifier']

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
});


$(function() {
  Ladda.bind( 'input[type=submit], button' );
})
