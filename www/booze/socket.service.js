(function () {
    'use strict';

    angular
        .module('booze')
        .service("socketService", socketService);

    socketService.$inject = ['$interval','$window'];

    function socketService($interval, $window) {

        //Internal variables.
        var nodeSocket = null;
        var callbacks = [];

        //Kick things into gear!
        connectToWebsocket();

        this.sendJSONMessage = function (jsonMessage) {
            if(nodeSocket !== null) {
                nodeSocket.send(JSON.stringify(jsonMessage));
            } else {
                console.log("No web socket connection is present!");
            }
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
                }
            };

            nodeSocket.onerror = function(error) {
                console.log("Websocket error: " + JSON.stringify(error, null, 4));
                nodeSocket = null;

                connectToWebsocket();
            };
        }
    }

})();