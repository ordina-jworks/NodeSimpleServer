(function() {
    'use strict';

    angular.module('booze', [
        'ngRoute'
    ])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    redirectTo: '/meter'
                })
                .when('/meter', {
                    templateUrl: 'meter.html',
                    controller: 'MeterCtrl',
                    controllerAs: 'meter',
                    bindToController: 'true'
                })
                .otherwise({
                    redirectTo: '/meter'
                });
        })
})();