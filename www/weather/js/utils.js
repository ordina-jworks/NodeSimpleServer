/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                             Functions for background selection.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
//Background vars.
var bgCounter = 1;
var bgTotal = 9;

/**
 * Returns an object corresponding to the given condition type. The returned object has more information about the given condition.
 *
 * @param conditionCode The condition id as received from the backend (wrapped openweathermap API).
 * @returns {{kind: string, bgIndex: number, weight: number}} An object containing more info about the background.
 */
function getWeatherConditionInfo(conditionCode) {
    switch (conditionCode) {
        //Thunderstorm:
        case 200	: return {kind: "thunderstorm with light rain",             bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 201	: return {kind: "thunderstorm with rain",                   bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 202	: return {kind: "thunderstorm with heavy rain",             bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 210	: return {kind: "light thunderstorm",                       bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 211	: return {kind: "thunderstorm",                             bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 212	: return {kind: "heavy thunderstorm",                       bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 221	: return {kind: "ragged thunderstorm",                      bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 230	: return {kind: "thunderstorm with light drizzle",          bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 231	: return {kind: "thunderstorm with drizzle",                bgIndex: 7, weight: 70, icon: "cond_thunder"};
        case 232	: return {kind: "thunderstorm with heavy drizzle",          bgIndex: 7, weight: 70, icon: "cond_thunder"};

        //Drizzle:
        case 300	: return {kind: "light intensity drizzle",                  bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 301	: return {kind: "drizzle",                                  bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 302	: return {kind: "heavy intensity drizzle",                  bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 310	: return {kind: "light intensity drizzle rain",             bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 311	: return {kind: "drizzle rain",                             bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 312	: return {kind: "heavy intensity drizzle rain",             bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 313	: return {kind: "shower rain and drizzle",                  bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 314	: return {kind: "heavy shower rain and drizzle",            bgIndex: 5, weight: 50, icon: "cond_light_rain"};
        case 321	: return {kind: "shower drizzle",                           bgIndex: 5, weight: 50, icon: "cond_light_rain"};

        //Rain:
        case 500	: return {kind: "light rain",                               bgIndex: 6, weight: 60, icon: "cond_partly_clouded_rain"};
        case 501	: return {kind: "moderate rain",                            bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 502	: return {kind: "heavy intensity rain",                     bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 503	: return {kind: "very heavy rain",                          bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 504	: return {kind: "extreme rain",                             bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 511	: return {kind: "freezing rain",                            bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 520	: return {kind: "light intensity shower rain",              bgIndex: 6, weight: 60, icon: "cond_partly_clouded_rain"};
        case 521	: return {kind: "shower rain",                              bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 522	: return {kind: "heavy intensity shower rain",              bgIndex: 6, weight: 60, icon: "cond_rain"};
        case 531	: return {kind: "ragged shower rain",                       bgIndex: 6, weight: 60, icon: "cond_partly_clouded_rain"};

        //Snow:
        case 600	: return {kind: "light snow",                               bgIndex: 8, weight: 60, icon: "cond_light_snow"};
        case 601	: return {kind: "snow",                                     bgIndex: 8, weight: 60, icon: "cond_snow"};
        case 602	: return {kind: "heavy snow",                               bgIndex: 8, weight: 60, icon: "cond_snow"};
        case 611	: return {kind: "sleet",                                    bgIndex: 8, weight: 60, icon: "cond_snow"};
        case 612	: return {kind: "shower sleet",                             bgIndex: 8, weight: 60, icon: "cond_snow"};
        case 615	: return {kind: "light rain and snow",                      bgIndex: 8, weight: 60, icon: "cond_light_snow"};
        case 616	: return {kind: "rain and snow",                            bgIndex: 8, weight: 60, icon: "cond_snow"};
        case 620	: return {kind: "light shower snow",                        bgIndex: 8, weight: 60, icon: "cond_light_snow"};
        case 621	: return {kind: "shower snow",                              bgIndex: 8, weight: 60, icon: "cond_snow"};
        case 622	: return {kind: "heavy shower snow",                        bgIndex: 8, weight: 60, icon: "cond_snow"};

        //Atmosphere:
        case 701	: return {kind: "mist",                                     bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 711	: return {kind: "smoke",                                    bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 721	: return {kind: "haze",                                     bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 731	: return {kind: "sand, dust whirls",                        bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 741	: return {kind: "fog",                                      bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 751	: return {kind: "sand",                                     bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 761	: return {kind: "dust",                                     bgIndex: 9, weight: 50, icon: "cond_fog"};
        case 762	: return {kind: "volcanic ash",                             bgIndex: 9, weight: 50, icon: "cond_fog"};
        /*case 771	: return {kind: "squalls"};
        case 781	: return {kind: "tornado"};*/

        //Clouds:
        case 800	: return {kind: "clear sky",                                bgIndex: 1, weight: 10, icon: "sun"};
        case 801	: return {kind: "few clouds",                               bgIndex: 2, weight: 20, icon: "cond_partly_clouded"};
        case 802	: return {kind: "scattered clouds",                         bgIndex: 3, weight: 30, icon: "cond_partly_clouded"};
        case 803	: return {kind: "broken clouds",                            bgIndex: 4, weight: 40, icon: "cond_overcast"};
        case 804	: return {kind: "overcast clouds",                          bgIndex: 4, weight: 40, icon: "cond_overcast"};

        //Extreme:
        /*case 900	: return {kind: "tornado"};
        case 901	: return {kind: "tropical storm"};
        case 902	: return {kind: "hurricane"};
        case 903	: return {kind: "cold"};
        case 904	: return {kind: "hot"};
        case 905	: return {kind: "windy"};
        case 906	: return {kind: "hail"};*/

        //Extra:
        /*case 951	: return {kind: "calm"};
        case 952	: return {kind: "light breeze"};
        case 953	: return {kind: "gentle breeze"};
        case 954	: return {kind: "moderate breeze"};
        case 955	: return {kind: "fresh breeze"};
        case 956	: return {kind: "strong breeze"};
        case 957	: return {kind: "high wind, near gale"};
        case 958	: return {kind: "gale"};
        case 959	: return {kind: "severe gale"};
        case 960	: return {kind: "storm"};
        case 961	: return {kind: "violent storm"};
        case 962	: return {kind: "hurricane"};*/
        default     : return null;
    }
}

/**
 * Returns the SVG icon filename (without folder prepend and extension append) for the given weather prediction code.
 *
 * @param code The weather prediction code.
 * @returns {String}
 */
function getImageForPredictionCode(code) {
    switch (code) {
        case "a"    : return "sun";
        case "b"    : return "cond_partly_clouded";
        case "c"    : return "cond_overcast";
        case "d"    : return "cond_fog";
        case "f"    : return "cond_light_rain";
        case "g"    : return "cond_thunder";
        case "h"    : return "cond_partly_clouded_rain";
        case "i"    : return "cond_snow";
        case "j"    : return "cond_partly_clouded";
        case "m"    : return "cond_light_rain";
        case "n"    : return "cond_fog";
        case "q"    : return "cond_rain";
        case "r"    : return "cond_partly_clouded";
        case "s"    : return "cond_thunder";
        case "t"    : return "cond_snow";
        case "u"    : return "cond_light_snow";
        case "v"    : return "cond_light_snow";
        case "w"    : return "cond_snow";
        default     : return code;
    }
}

/**
 * Used to loop through all the backgrounds.
 */
function toggleBackground() {
    var from = bgCounter++;
    if(bgCounter > bgTotal) {
        bgCounter = 1;
    }
    swapPageBackground(from, bgCounter);
}

/**
 * Swaps the background images between from and to indexes.
 *
 * @param from The index to swap from.
 * @param to The index to swap to.
 */
function swapPageBackground(from, to) {
    $("#bgImage" + from).toggleClass("transparent");
    $("#bgImage" + to).toggleClass("transparent");
}

/**
 * Determines the correct background image for the given weather data.
 *
 * @param weatherData The weather data as received by the call to the REST API.
 * @param rainData The rain data as received by the call to the REST API.
 * @param lightningData The lightning data as received by the call to the REST API.
 */
function determineBackgroundImage(weatherData, rainData, lightningData) {
    var conditions = weatherData.conditions;
    var weights = [];

    for(var i = 0 ; i < conditions.length ; i++) {
        console.log("Current condition: " + JSON.stringify(conditions[i]));
        var weight = getWeatherConditionInfo(conditions[i].id);
        if(weight !== null) {
            weights.push(weight);
        }
    }

    weights.sort(function(a,b) { return parseFloat(a.weight) - parseFloat(b.weight) });
    console.log("Sorted conditions:");
    console.log(JSON.stringify(weights));

    //TODO: When overriding we should also set a condition to override (instead of only overriding the background image)
    //Rain and or lightning override!
    var overriddenWeight = null;
    if(lightningData.closestStrike.distance !== "-" && lightningData.closestStrike.distance < 25) {
        overriddenWeight = getWeatherConditionInfo(211);
    } else {
        var isSnow = false;
        if(weatherData.minTemp < 1) {
            isSnow = true;
        }

        if(rainData.isRainingNow === true) {
            switch (rainData.intensity) {
                case 1  :
                    overriddenWeight = getWeatherConditionInfo(!isSnow ? 500 : 600);
                    break;
                case 2  :
                    overriddenWeight = getWeatherConditionInfo(!isSnow ? 501 : 601);
                    break;
                case 3  :
                    overriddenWeight = getWeatherConditionInfo(!isSnow ? 502 : 602);
                    break;
                case 4  :
                    overriddenWeight = getWeatherConditionInfo(!isSnow ? 503 : 621);
                    break;
                case 5  :
                    overriddenWeight = getWeatherConditionInfo(!isSnow ? 504 : 622);
                    break;
            }
        } else {
            //Check predicted rain. (the first hour only)
            for(var i = 0; i < 6 ; i++) {
                var willRain = rainData.originalData.predictedConditions.data[i].intensity > 0;
                if(willRain) {
                    if(isSnow) {
                        overriddenWeight = getWeatherConditionInfo(601);
                    } else {
                        overriddenWeight = getWeatherConditionInfo(501);
                    }
                }
            }

            if(overriddenWeight === null && (weights[0].bgIndex === 5 || weights[0].bgIndex === 6 || weights[0].bgIndex === 8)) {
                overriddenWeight = getWeatherConditionInfo(801);
            }
        }
    }
    //Make sure our overridden condition is on the top of the list of conditions!
    if(overriddenWeight !== null) {
        console.log("Condition overridden to: " + JSON.stringify(overriddenWeight));
        weights.unshift(overriddenWeight);
    }

    //TODO: Night backgrounds!
    if(weights !== null && weights.length > 0) {
        swapPageBackground(bgCounter, weights[0].bgIndex);
        bgCounter = weights[0].bgIndex;
    }
}

/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                             Functions for background selection.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
function calculateAndAnimsateSunPosition(weatherData) {
    var now = new Date();
    var sunUp = new Date(weatherData.sunrise * 1000);
    var sunDown = new Date(weatherData.sunset * 1000);

    var sunIsUpMinutes = (sunDown.getHours() * 60 + sunDown.getMinutes()) - (sunUp.getHours() * 60 + sunUp.getMinutes());
    var nowMinutes = now.getHours() * 60 + now.getMinutes();

    var degPerMinute = 180 / sunIsUpMinutes;
    var sunDeg = 315 + Math.round((nowMinutes - (sunUp.getHours() * 60 + sunUp.getMinutes())) * degPerMinute);

    restartAnimation("sunAnimation", "animateSun", "sunContainer", "sunWrapper" ,"to", "transform:rotate(" + sunDeg + "deg);");
}

function calculateAndAnimateWindDirectionPosition(weatherData) {
    restartAnimation("windDirAnimation", "animateWindDir", "compassWrapper", "needle" ,"to", "transform:rotate(" + weatherData.avgWindDirectionDegree +"deg);");
}

function calculateAndAnimateWindSpeed(weatherData) {
    var windArms = $("#windArms");
    windArms.removeClass("windSlow");
    windArms.removeClass("windMedium");
    windArms.removeClass("windFast");
    windArms.removeClass("windStorm");

    //This delay is necessary to make the change in animation work!
    setTimeout(function () {
        //km/h is m/s * 3.6
        var windSpeed = Math.round(weatherData.avgWindSpeed * 3.6);

        if(windSpeed == 0) {
            //No wind!
        } else if(windSpeed < 10) {
            windArms.addClass("windSlow");
        } else if(windSpeed < 30) {
            windArms.addClass("windMedium");
        } else if(windSpeed < 50) {
            windArms.addClass("windFast");
        } else {
            windArms.addClass("windStorm");
        }
    },100);
}

/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                                     Other weather functions.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
/**
 * Reloads the external images.
 */
function reloadExternalImages() {
    var lightingImg = $("#lightningImg");
    var buienradarImg = $("#buienradarImg");

    //TODO: Find workaround for hacking detection!
    //lightingImg.attr("src", "https://images.lightningmaps.org/blitzortung/europe/index.php?map=benelux?");
    buienradarImg.attr("src", "https://api.buienradar.nl/image/1.0/radarmapbe/?ext=gif&hist=-1&forc=13&step=0&w=550&h=512");
}

/**
 * Creates data to plot a chart.
 *
 * @param data The data to plot on the graph.
 * @param isForCurrentRainData, True when the data passed is the current rain data, false if it is predicted rain data.
 * @returns {{labels: [text], datasets: [dataset]}}
 */
function createChartData(data, isForCurrentRainData) {
    var conditions = null;
    if(isForCurrentRainData) {
        conditions = data.currentConditions;
    } else {
        conditions = data.predictedConditions;
    }

    //Check for error after data assignment.
    if(conditions === null || conditions === undefined) {
        blockUIWithDismissableError("Cannot plot rain data!");
        return null;
    }

    var labels = [];
    var datasets = [];
    var dataset =
    {
        label: "Current conditions",
        fillColor: "rgba(10,123,255,0.3)",
        strokeColor: "rgba(10,123,255,0.7)",
        pointColor: "rgba(10,123,255,1)",
        pointStrokeColor: "rgba(10,123,255,0.7)",
        pointHighlightFill: "rgba(10,123,255,0.7)",
        pointHighlightStroke: "rgba(10,123,255,0.7)",
        data: []
    };
    datasets.push(dataset);

    for( var i = 0; i < conditions.data.length ; i++) {
        var input = conditions.data;

        labels.push(input[i].time);
        dataset.data.push(input[i].intensity);
    }

    var result = {};
    result.labels = labels;
    result.datasets = datasets;
    return result;
}

/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                           Non weather specific javascript util functions.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
var styleSheetSelection = null;

/**
 * Hides the soft keyboard on mobile devices.
 */
function hideSoftKeyboard() {
    document.activeElement.blur();
    var inputs = document.querySelectorAll('input');
    for(var i=0; i < inputs.length; i++) {
        inputs[i].blur();
    }
}

/**
 * Converts any given UNIX timestamp into a timeString (hh:mm).
 *
 * @param unixTimeStamp The timestamp to convert.
 * @returns {string} The converted timestamp in string format (hh:mm)
 */
function unixTimeToTimeString(unixTimeStamp) {
    var date = new Date(unixTimeStamp * 1000);
    var hours = date.getHours() + "";
    var minutes = date.getMinutes() + "";

    if(hours.length == 1) {
        hours = "0" + hours;
    }
    if(minutes.length == 1) {
        minutes = "0" + minutes;
    }

    return hours + ":" + minutes;
}

/**
 * Finds the given keyframe by name.
 *
 * @param rule The name of the keyframe rule to find in any document css.
 * @returns {*}
 */
function findKeyframesRule(rule) {
    var rules = [];
    var styleSheets = window.document.styleSheets;
    var styleSheetsLength = styleSheets.length;
    for(var i = 0; i < styleSheetsLength; i++){
        var classes;
        try {
            classes = styleSheets[i].cssRules;
        } catch(error) {
            classes = styleSheets[i].rules;
        }
        if(classes === null || classes === undefined) {
            continue;
        }
        var classesLength = classes.length;
        for (var x = 0; x < classesLength; x++) {
            //console.log("Check: " + classes[x].name + " vs " + rule);
            if (classes[x].name === rule && (classes[x].type == CSSRule.KEYFRAMES_RULE || classes[x].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE)) {
                //console.log("Rule matched: " + classes[x].name);
                rules.push(classes[x]);
            }
        }
    }
    return rules.length === 0 ? null : rules;
}

/**
 * Restarts a pure css animation, and supports altering animation end state parameters.
 *
 * @param animationName The name of the CSS keyframe based animation.
 * @param animationClass The name of the CSS class that contains the animation definition.
 * @param objectParentId The id of the wrapper object of the animated object.
 * @param objectId The id of the animated object.
 * @param ruleName The optional name of the keyframe animation label to alter.
 * @param rule The optional rule that should go with the ruleName.
 */
function restartAnimation(animationName, animationClass, objectParentId, objectId, ruleName, rule){
    if(ruleName !== null && rule !== null) {
        var keyframes = findKeyframesRule(animationName);

        //Because some browsers are silly, we delete the index (as per the spec) first and then the rulename (looking at you chrome).
        switch(ruleName) {
            case "from":
                deleteFromRules(keyframes, "0");
                deleteFromRules(keyframes, ruleName);
                break;
            case "to":
                deleteFromRules(keyframes, "1");
                deleteFromRules(keyframes, ruleName);
                break;
            default:
                deleteFromRules(keyframes, ruleName);
        }

        addToRules(keyframes, ruleName, rule);
    }

    //Restart the animation by cloning, removing and adding it to the DOM again.
    //This is the only way it consistently works.
    var original = $("#" + objectId);
    var cloned = original.clone().removeClass();
    original.remove();
    $("#" + objectParentId).append(cloned);
    cloned.addClass(animationClass);
}

function addToRules(rules, ruleName, ruleToAdd) {
    if(rules instanceof Array) {
        for(var i = 0 ; i < rules.length ; i++) {
            addRule(rules[i], ruleName, ruleToAdd);
        }
    } else {
        addRule(rules, ruleName, ruleToAdd);
    }
}

function addRule(rules, ruleName, rule) {
    if (typeof rules.insertRule === 'function') {
        rules.insertRule(ruleName +  " { -webkit-" + rule + " }");
    } else {
        rules.appendRule(ruleName +  " { " + rule + " }");
    }
}

function deleteFromRules(rules, ruleToDelete) {
    try {
        if(rules instanceof Array) {
            for(var i = 0 ; i < rules.length ; i++) {
                rules[i].deleteRule(ruleToDelete);
            }
        } else {
            rules.deleteRule(ruleToDelete);
        }
    } catch (error) {
        //Swallow any errors silently.
    }
}

/*-------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------
 *                                  UI blocking and unblocking.
 * ------------------------------------------------------------------------------------------------
 ------------------------------------------------------------------------------------------------*/
/**
 * Blocks the UI for the whole page, This will prevent the user from interacting with the page.
 *
 * @param message The message to show to the user.
 */
function blockUI(message) {
    if(message === null || message === undefined) {
        message = "Loading weather data...";
    }

    $.blockUI({
        message: message,
        css: {
            border: "none",
            padding: "15px",
            backgroundColor: "rgb(202,202,202)",
            color: "rgb(71,71,71)",
            opacity: "1",
            'z-index': "9999"
        }
    });
}

/**
 * Blocks the UI with a given error message. The user can dismiss the error message by clicking anywhere on the page!
 *
 * @param message The message to show to the user.
 */
function blockUIWithDismissableError(message) {
    message = "An error occurred: " + message + "<br/>Click to close this message!";

    $(".blockMsg").html(message);
    $(".blockUI").bind("click touchstart", function(){
        unblockUI();
    });
}

/**
 * This unblocks the UI, allowing the user to interact with it again.
 */
function unblockUI() {
    $.unblockUI();
}