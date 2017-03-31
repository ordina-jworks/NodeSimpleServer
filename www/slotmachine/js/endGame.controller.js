(function () {
    'use strict';

    angular.module('devoxx')
        .controller('EndGameCtrl', EndGameCtrl);

    EndGameCtrl.$inject = ['$scope', 'nodeSocketService' ,'$mdDialog', 'gameState'];

    function EndGameCtrl($scope, nodeSocketService, $mdDialog, gameState) {

        $scope.name = gameState.name;
        $scope.winner = gameState.winner;
        $scope.closeButNoCigar = gameState.closeButNoCigar;
        $scope.active1 = getImg(gameState.slots[0]);
        $scope.active2 = getImg(gameState.slots[1]);
        $scope.active3 = getImg(gameState.slots[2]);

        function getImg(slot){
            return 'img/slot' + (slot.active+1) + '.png';
        }

        $scope.newGame = function () {
            $mdDialog.hide();
            $('#coin1').show();
            $('#coin2').show();
            $('#coin3').show();
            nodeSocketService.sendJSONMessage({reset: true});
        }
    }
})();
