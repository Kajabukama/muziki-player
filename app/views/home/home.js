var app = angular.module('Player.home', ['ngRoute']);

app.controller('HomeController', ['$scope','$location', function () {
    console.log('Home controller loaded');
}]);
