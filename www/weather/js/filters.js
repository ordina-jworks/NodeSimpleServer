angular.module('weatherGenieApp.filters', [])
    .filter('optionalDistance', function() {
        return function(input) {

            if(input === "-") {
                return "None";
            } else {
                return "At " + Math.round(input) + " km";
            }
        };
    })
    .filter('openweathermapIconId', function() {
        return function(input) {
            var data = getWeatherConditionInfo(input);

            if(data !== null) {
                return data.icon;
            } else {
                return "sun";
            }
        }
    })
    .filter('buienradarIconId', function() {
        return function(input) {
            var data = getImageForPredictionCode(input);

            if(data !== null) {
                return data;
            } else {
                return "sun";
            }
        }
    })
    .filter('placename', function() {
        return function(input) {
            if(input === null || input === undefined) {
                return "";
            }

            if(input.length > 11) {
                if(input.length > 23) {
                    var result = input.substring(0, input.length - 4);
                    result += "...:";
                    return result;
                }
                return input + ":";
            } else {
                return "Weather in " + input + ":";
            }
        }
    });