var app = angular.module('Player', [
    'ngRoute',
    'ngAnimate',
    'Player.home',
    'Player.about',
    'Player.settings',
    'Player.player',
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: './views/player/player.html',
            controller: 'PlayerController'
        })
        .when('/about', {
            templateUrl: './views/about/about.html',
            controller: 'AboutController'
        })
        .when('/settings', {
            templateUrl: './views/settings/settings.html',
            controller: 'SettingsController'
        })
        .when('/home', {
            templateUrl: './views/home/home.html',
            controller: 'HomeController'
        })
        .otherwise({redirectTo: '/'});
}])
