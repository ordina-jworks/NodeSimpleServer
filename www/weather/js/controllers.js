//Init charts.
Chart.defaults.global.scaleOverride = true;
Chart.defaults.global.scaleSteps = 5;
Chart.defaults.global.scaleStepWidth = 1;
Chart.defaults.global.scaleStartValue = 0;
Chart.defaults.global.showTooltips = false;
Chart.defaults.global.scaleLineColor = "rgba(255,255,255,.7)";
Chart.defaults.global.scaleFontColor = "rgba(255,255,255,.7)";

/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                                           Controllers.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
angular.module('weatherGenieApp.controllers', [])
    .controller('weatherController', function ($scope, $location,weatherAPIService) {

        //Loop through all the backgrounds. This will be stopped when a search has been done.
        var bgInterval = setInterval(toggleBackground, 10000);
        var animationPlaying = false;

        /**
         * Perform the initial search, from the welcome screen.
         * This will perform an animation into the full website.
         * This calls the search() function to do the actual search.
         */
        $scope.initialSearch = function () {
            animationPlaying = true;

            //Perform some animations to go away from the initial screen.
            $("#initialSearch").animate({bottom: 2000, opacity: 0, height: 50}, 1500, "swing", function complete() {
                $(this).addClass("hidden");
                animationPlaying = false;
            });

            var item = $("#headerWrapper");
            item.removeClass("hidden");
            item.fadeTo(2000, 1);
            item = $("#content");
            item.removeClass("hidden");
            item.fadeTo(2000, 1);
            item = $("#footer");
            item.removeClass("hidden");
            item.fadeTo(2000, 1);

            //Perform the actual search!
            $scope.search();
        };

        /**
         * Resets the UI to show the initial search.
         * Will clear any text entered in the initial search field!
         */
        $scope.reset = function () {
            $scope.city = "";

            var resetAnimation = function(){
                $("#headerWrapper").fadeTo(1000, 0, function complete() {
                    $("#headerWrapper").addClass("hidden");
                });
                $("#content").fadeTo(1000, 0, function complete() {
                    $("#content").addClass("hidden");
                });
                $("#footer").fadeTo(1000, 0, function complete() {
                    $("#footer").addClass("hidden");
                });

                var item = $("#initialSearch");
                item.removeClass("hidden");
                item.animate({bottom: 0, opacity: 1, height: 400}, 1500, "swing", function complete() {
                    bgInterval = setInterval(toggleBackground, 10000);
                });
            };

            //Defer reset animation if the initial animation is still playing!
            if(animationPlaying) {
                setTimeout(resetAnimation, 1500);
            } else {
                resetAnimation();
            }
        };

        /**
         * Performs the actual search.
         * Performs the following actions:
         * - Hide the soft keyboard on mobile devices.
         * - Block the UI to prevent unwanted user interaction.
         * - Reload the external buienradar/blitzortung images.
         * - Call the rest api via the injected weatherAPIService.
         * --> weatherAPIService.getCityInformation(...);
         * --> weatherAPIService.retrieveRainInformation(...);
         * --> weatherAPIService.retrieveLightningInformation(...);
         * - When all the calls to the service have returned the background will be determined and the UI will be unblocked.
         * - After each individual call returns, some data will be put on the scope. If an error occurs that will be displayed!
         */
        $scope.search = function () {
            hideSoftKeyboard();
            blockUI();
            reloadExternalImages();

            //Start with the city weather information.
            weatherAPIService.getCityInformation($scope.city, function(weatherData) {

                //If there are no errors, continue and show data.
                if(weatherData.error === null) {
                    //Clear background interval!
                    if (bgInterval !== null) {
                        clearInterval(bgInterval);
                        bgInterval = null;
                    }
                    //Start animations.
                    calculateAndAnimsateSunPosition(weatherData);
                    calculateAndAnimateWindDirectionPosition(weatherData);
                    calculateAndAnimateWindSpeed(weatherData);
                    $scope.weatherData = weatherData;
                } else {
                    $scope.reset();
                    blockUIWithDismissableError(weatherData.error + "</br></br>Be sure to search for a city in Belgium!");
                    $scope.weatherData = null;
                    return;
                }

                //Next collect the rain information.
                weatherAPIService.retrieveRainInformation(weatherData.latitude, weatherData.longitude, function(rainData) {

                    //If there are no errors, continue and show data.
                    if(rainData.error === null) {
                        $scope.rainData = rainData;

                        //Charting!
                        var ctxCurrent = document.getElementById("currentCanvas").getContext("2d");
                        var ctxPredict = document.getElementById("predictCanvas").getContext("2d");
                        var lineChartCurrent = new Chart(ctxCurrent).Line(createChartData(rainData.originalData, true), {bezierCurve: false});
                        var lineChartPredict = new Chart(ctxPredict).Line(createChartData(rainData.originalData, false), {bezierCurve: false});

                    } else {
                        $scope.reset();
                        blockUIWithDismissableError(rainData.error + "</br></br>Be sure to search for a city in Belgium!");
                        $scope.rainData = null;
                        return;
                    }

                    //Finally collect lightning information.
                    weatherAPIService.retrieveLightningInformation(weatherData.latitude, weatherData.longitude, function(lightningData) {

                        //If there are no errors, continue and show data.
                        if(lightningData.error === null) {
                            $scope.lightningData = lightningData;
                        } else {
                            $scope.reset();
                            blockUIWithDismissableError(lightningData.error + "</br></br>Be sure to search for a city in Belgium!");
                            $scope.lightningData = null;
                            return;
                        }

                        //Show the most appropriate background image.
                        determineBackgroundImage(weatherData, rainData, lightningData);
                        //All data retrieved!
                        unblockUI();
                    });
                });
            });
        };

        //Check if the URL contains a location param and value, if present do a search for this!
        var urlLocation = $location.search().location;
        if(urlLocation !== null && urlLocation !== undefined) {
            $scope.city = urlLocation;
            $scope.initialSearch();
        }
    });