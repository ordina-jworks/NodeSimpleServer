(function () {
    'use strict';

    angular
        .module('devoxx')
        .service("nodeSocketService", socketService);

    socketService.$inject = ['$window'];

    function socketService($window) {

        var port = $window.location.port;
        port = port == '' ? '' : ':' + 8000;
        var location;
        if(port === '') {
            location = $window.location.hostname.replace('-http-', '-ws-');
        } else {
            location = $window.location.hostname;
        }

        var socket = io.connect('http://' + location + port + '/socket');
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