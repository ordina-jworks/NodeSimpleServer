(function () {
    'use strict';

    angular
        .module('devoxx')
        .service("nodeSocketService", socketService);

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
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](data);
            }
        });
    }
})();