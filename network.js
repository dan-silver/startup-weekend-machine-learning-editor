var app = angular.module('app', ['ui.sortable']);

var Layer = function (size, type) {
  this.size = size
  this.type = type
};



app.controller('ctrl', function ($scope) {
  $scope.phones = 45
  $scope.nn_layers = [new Layer(5), new Layer(20)]
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
