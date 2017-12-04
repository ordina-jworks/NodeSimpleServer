'use strict';

var app = (function () {

    console.log('Webpage code started!');
    window.addEventListener('load', pageLoaded);

    var httpRequest;
    var port;

    function pageLoaded(event) {
        console.log('Webpage content ready!');

        port = window.location.port;
        port = port == '' ? '' : ':' + port;

        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('GET', 'http://' + window.location.hostname + port + '/apps');
        httpRequest.send();
    }

    function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                console.log(data.apps);

                var element = document.getElementById('webapps');

                for (var i = 0; i < data.apps.length; i++) {
                    var item = document.createElement("li");
                    item.classList.add('list-item');
                    var link = document.createElement("a");
                    link.href = 'http://' + window.location.hostname + port + '/' + data.apps[i].split('/')[2] + '/index.html';
                    var content = document.createTextNode(data.apps[i].split('/')[2]);

                    link.appendChild(content);
                    item.appendChild(link);
                    element.appendChild(item);
                }
            } else {
                console.log('Could not fetch list of webapps!');
            }
        }
    }
}());