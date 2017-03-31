(function () {
    'use strict';

    angular.module('devoxx')
        .service("nodeSocketService", nodeSocketService);

    nodeSocketService.$inject = ['$window'];

    function nodeSocketService($window) {

        //Internal variables.
        var nodeSocket = null;
        var callbacks = [];

        //Kick things into gear!
        connectToWebsocket();

        this.sendJSONMessage = function (jsonMessage) {
            nodeSocket.send(JSON.stringify(jsonMessage));
        };

        this.registerCallback = function (callback) {
            callbacks.push(callback);
        };

        function connectToWebsocket() {
            nodeSocket = new WebSocket("ws://"+$window.location.hostname+":7081");

            //Wait for the socket connection to be established before doing anything else socket related!
            nodeSocket.onopen = function (event) {
                console.log("Connection to web socket established!");

                nodeSocket.onmessage = function (event) {
                    console.log("Received message from web socket:" + event.data);
                    var data = JSON.parse(event.data);

                    for (var i = 0; i < callbacks.length; i++) {
                        callbacks[i](data);
                    }
                }
            };
        }
    }
})();