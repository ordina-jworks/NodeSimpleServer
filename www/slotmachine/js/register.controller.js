(function () {
    'use strict';


    angular.module('devoxx')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope', '$mdToast', '$timeout', 'Restangular', 'nodeSocketService', '$mdDialog'];

    function RegisterCtrl($scope, $mdToast, $timeout, Restangular, nodeSocketService, $mdDialog) {

        var last = {bottom: false, top: true, left: false, right: true};
        $scope.toastPosition = angular.extend({}, last);

        $scope.getToastPosition = function () {
            sanitizePosition();
            return Object
                .keys($scope.toastPosition)
                .filter(function (pos) {
                    return $scope.toastPosition[pos];
                })
                .join(' ');
        };

        /**
         * Validates the entered form and if valid send it to the server.
         *
         * @param person The person object contains the data that was entered in the entry form.
         */
        $scope.validateAndSend = function (person) {
            if ($scope.registerForm.$valid) {
                if (person.interested === undefined) {
                    person.interested = false;
                }
                if (person.entity === undefined) {
                    person.entity = "";
                }

                nodeSocketService.sendJSONMessage({registered: true});
                Restangular.all('register').post(person);

                $scope.showActionToast('Successfully registered! Starting Game...');
                $timeout(function () {
                    $mdDialog.hide(person);
                }, 1000);
            }
        };


        /**
         * Shows a toast message at a set position.
         *
         * @param message The message to display
         */
        $scope.showActionToast = function (message) {
            var toast = $mdToast.simple()
                .content(message)
                .position($scope.getToastPosition());
            $mdToast.show(toast);
        };

        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                        Private functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        /**
         * Sanitize the position of the toast message.
         */
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        }
    }
})();
