(function () {
    'use strict';

    angular
        .module('booze')
        .service("socketService", socketService);

    socketService.$inject = ['$window'];

    function socketService($window) {
        var socket = io.connect('http://' + $window.location.hostname + ':8000/socket');
        var callbacks = [];

        this.sendJSONMessage = function (jsonMessage) {
            console.log('Sending message to server: ' + jsonMessage);
            socket.emit('app-event', JSON.stringify(jsonMessage));
        };

        this.registerCallback = function (callback) {
            callbacks.push(callback);
        };

        socket.on('welcome', function(msg){
            console.log(msg);
        });

        socket.on('app-event', function(msg){
            console.log(msg);

            var data = JSON.parse(msg);
            for(var i = 0; i < callbacks.length; i++) {
                switch(data.level){
                    case 'FULL' :
                        callbacks[i](100);
                        break;
                    case 'HIGH' :
                        callbacks[i](75);
                        break;
                    case 'MEDIUM' :
                        callbacks[i](50);
                        break;
                    case 'LOW' :
                        callbacks[i](25);
                        break;
                    case 'EMPTY' :
                        callbacks[i](0);
                        break;
                    default :
                        if(data.level && data.level >= 0 && data.level <= 100){
                            callbacks[i](data.level);
                        }
                }
            }
        });
    }

})();