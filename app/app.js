var app = angular.module('Player', ['ngRoute','ngAnimate','Player.player']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './views/home/home.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: './views/about/about.html',
            controller: 'AboutController'
        })
        .when('/player', {
            templateUrl: './views/player/player.html',
            controller: 'PlayerController'
        })
        .otherwise({redirectTo: '/'});
}])
