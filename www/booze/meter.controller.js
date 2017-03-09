(function () {
    'use strict';

    angular.module('booze')
        .controller('MeterCtrl', MeterCtrl);

    MeterCtrl.$inject = ['$scope', 'socketService', '$window'];

    function MeterCtrl($scope, socketService, $window) {

        var meter = this;
        var fullHeight = 558;

        socketService.registerCallback(messageReceived);

        function messageReceived(data) {
            $('#rect4384-5')[0].setAttribute('d', composePath((data * (558/100))));
        }

        function composePath(data) {
            var topLeftX = 0,
                topLeftY = 0,
                topRightX = 78,
                topRightY = 0,
                bezierPoint1X = 10,
                bezierPoint1Y = 15,
                bezierPoint2X = 76,
                bezierPoint2Y = 11;

            return 'm 281,73 0,558.436651 ' +
                'c 10,15 ' +
                '76,11 ' +
                '78,0 '+
                'l '+topLeftX+',-' + (topLeftY+data) + ' ' +
                'c -'+bezierPoint1X+',-'+bezierPoint1Y+' ' +
                '-'+bezierPoint2X+',-'+bezierPoint2Y+' ' +
                '-'+topRightX+','+topRightY+' z'
        }
    }

})();
