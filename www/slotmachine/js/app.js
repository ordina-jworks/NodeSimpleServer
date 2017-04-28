(function () {
    'use strict';

    angular
        .module('devoxx', [
            'ngMessages',
            'ngRoute',
            'ngSanitize',
            'restangular',
            'ngMaterial',
            'ngMdIcons',
            'ngAnimate',
            'ngAria'
        ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    redirectTo: '/game'
                })
                .when('/game', {
                    templateUrl: 'game.html',
                    controller: 'GameCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .config(function (RestangularProvider) {
            RestangularProvider.setBaseUrl('http://localhost:8080/');
            RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('orange')
                .accentPalette('amber')
                .warnPalette('deep-orange');
        })
})();
