/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                                        Main angular app.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
var app = angular.module('weatherGenieApp', [
    'weatherGenieApp.controllers',
    'weatherGenieApp.services',
    'weatherGenieApp.filters'
]);

app.config(['$locationProvider', function applyConfiguration($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $locationProvider.hashPrefix('!');
}]);