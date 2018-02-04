var app = angular.module('Player', ['ngRoute','Player.player']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .otherwise({redirectTo: '/player'});
}])
