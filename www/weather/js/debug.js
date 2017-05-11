$(document).ready(function () {

    //Init charts:
    Chart.defaults.global.scaleOverride = true;
    Chart.defaults.global.scaleSteps = 5;
    Chart.defaults.global.scaleStepWidth = 1;
    Chart.defaults.global.scaleStartValue = 0;
    Chart.defaults.global.showTooltips = false;

    //Create overlay divs for gif image:
    var appendage = "";
    for (var i = 0; i < 64; i++) {
        for (var j = 0; j < 55; j++) {
            appendage += "<div class='box' onclick='getDataForBox(" + j + "," + i + ")'></div>";
        }
    }
    $("#container").append(appendage);
});

function getDataForBox(x, y) {
    console.log("X: " + x + " Y: " + y);

    //Retrieve rain data for given x/y block!
    $.getJSON("/weather/rain/xy/" + x + "&" + y,
        function (data) {
            console.log(JSON.stringify(data, null, 4));

            //Charting!
            var ctxCurrent = document.getElementById("currentCanvas").getContext("2d");
            var ctxPredict = document.getElementById("predictCanvas").getContext("2d");
            var lineChartCurrent = new Chart(ctxCurrent).Line(createChartData(data, true));
            var lineChartPredict = new Chart(ctxPredict).Line(createChartData(data, false));
        });
}

function createChartData(data, isForCurrentRainData) {
    var conditions = null;

    if(isForCurrentRainData) {
        conditions = data.currentConditions;
    } else {
        conditions = data.predictedConditions;
    }

    var labels = [];
    var datasets = [];
    var dataset =
    {
        label: "Current conditions",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: []
    };
    datasets.push(dataset);

    for( var i = 0; i < conditions.data.length ; i++) {
        var input = conditions.data;

        labels.push(input[i].time);
        dataset.data.push(input[i].intensity);
    }

    var data = {};
    data.labels = labels;
    data.datasets = datasets;

    return data;
}