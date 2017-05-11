/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                                            Services.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
angular.module('weatherGenieApp.services', [])
    .factory('weatherAPIService', function($http) {

        var weatherAPI = {};

        /**
         * Retrieves the weather information for the given city.
         *
         * @param city The city for which to retrieve the weather information.
         * @param callback The callback function to call when done.
         */
        weatherAPI.getCityInformation = function (city, callback) {
            console.log("Submitted: " + city);

            $http.get('data?city=' + city).then(
                function onResponse(response) {
                    var data = response.data;

                    //Check for errors from the backend (City not found,...).
                    if (data.error === null || data.error === undefined) {
                        //Process data.
                        data.latitude = (data.latitude + "").replace(".", ",");
                        data.longitude = (data.longitude + "").replace(".", ",");
                        data.sunriseString = unixTimeToTimeString(data.sunrise);
                        data.sunsetString = unixTimeToTimeString(data.sunset);

                        data.error = null;
                        callback(data);
                    } else {
                        callback({error: data.error});
                    }
                },
                function onError(response) {
                    callback({error: "An error occurred: " + response.statusCode});
                }
            );
        };

        /**
         * Retrieves the rain information for the given coordinates.
         *
         * @param lat The latitude coordinate.
         * @param lon The longitude coordinate.
         * @param callback The callback function to call when done.
         */
        weatherAPI.retrieveRainInformation = function (lat, lon, callback) {
            $http.get('rainForCoords?latitude=' + lat + "&longitude=" + lon).then(
                function onResponse(response) {
                    var data = response.data;

                    //Check for errors from the backend.
                    if(data.error === null || data.error === undefined) {

                        //Data integrity check:
                        if(data.currentConditions === null || data.currentConditions === undefined) {
                            callback({error: "No rain data found!"});
                            return;
                        }

                        //Process rain data and put in on the scope:
                        var currentRain = data.currentConditions.data[data.currentConditions.data.length - 1];
                        switch (currentRain.intensity) {
                            case 0:
                                currentRain = 0;
                                break;
                            case 1:
                                currentRain = 1;
                                break;
                            case 2:
                                currentRain = 4;
                                break;
                            case 3:
                                currentRain = 7.5;
                                break;
                            case 4:
                                currentRain = 50;
                                break;
                            case 5:
                                currentRain = 100;
                                break;
                        }

                        var rainingData = {
                            isRainingNow: currentRain !== 0,
                            intensity: currentRain,
                            originalData: data,
                            error: null
                        };
                        callback(rainingData);
                    } else {
                        callback({error: data.error});
                    }
                },
                function onError(response) {
                    callback({error: "An error occurred: " + response.statusCode});
                }
            );
        };

        /**
         * Retrieves the lighting information for the given coordinates.
         *
         * @param lat The latitude coordinate.
         * @param lon The longitude coordinate.
         * @param callback The callback function to call when done.
         */
        weatherAPI.retrieveLightningInformation = function (lat, lon, callback) {
            $http.get('lightningForCoords?latitude=' + lat + "&longitude=" + lon).then(
                function onResponse(response) {
                    var data = response.data;

                    //Check for errors from the backend.
                    if(data.error === null || data.error === undefined) {

                        //Check for warnings!
                        if(data.warning !== null && data.warning !== undefined) {
                            callback({closestStrike: {distance : "-"}, error: null});
                            return;
                        }

                        //Vars.
                        var now = new Date();
                        var strike = null;
                        var closeCount = 0;
                        var mediumCount = 0;
                        var farCount = 0;
                        //Lightning logic.
                        for (var i = 0; i < data.data.length; i++) {
                            var currentStrike = data.data[i];
                            var dt = new Date(currentStrike.timestamp);

                            //Do a stale data check on the strike, if too old discard!
                            //60 minutes * 60 secs * 1000 milliseconds.
                            if (dt.getTime() + 60 * 60 * 1000 < now.getTime()) {
                                continue;
                            }

                            if (strike === null) {
                                strike = currentStrike;
                            }

                            //Find the closest strike:
                            if (currentStrike.distance < strike.distance) {
                                strike = currentStrike;
                            }

                            //Count strikes depending on distance to the current lat/lon
                            if (currentStrike.distance <= 50) {
                                closeCount++;
                            } else if (currentStrike.distance <= 100) {
                                mediumCount++;
                            } else {
                                farCount++;
                            }
                        }

                        //If no strike is available, show a dash!
                        if(strike === null) {
                            strike = {distance : "-"};
                        }

                        var lightningData = {
                            closestStrike: strike,
                            closeCount: closeCount,
                            mediumCount: mediumCount,
                            farCount: farCount,
                            error: null
                        };
                        callback(lightningData);
                    } else {
                        callback({error: data.error});
                    }
                },
                function onError(response) {
                    callback({error: "An error occurred: " + response.statusCode});
                }
            );
        };

        return weatherAPI;
    });