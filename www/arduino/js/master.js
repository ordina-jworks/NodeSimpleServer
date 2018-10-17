'use strict';

var app = (function () {

    console.log('Webpage code started!');
    window.addEventListener('load', pageLoaded);

    function pageLoaded(event) {
        console.log('Webpage content ready!');

        new Clipboard('.copyButton', {
            text: function (trigger) {
                return trigger.nextElementSibling.children[0].innerText;
            }
        });
    }

    function showModelArduinoSerial() {
        console.log('Clicked showModelArduinoSerial');

        blockUI();
        displayModalExampleContent(true);
    }

    function showModalArduinoJohnnyFive() {
        console.log('clicked showModalArduinoJohnnyFive');

        blockUI();
        displayModalExampleContent(false);
    }

    function blockUI() {
        var element = document.getElementById('wrapper');
        element.classList.add('blurred');

        element = document.getElementById('fullPageModal');
        element.classList.remove('hidden');
    }

    function closeModal(event) {
        var elementId = event.target.id;
        if (elementId !== 'fullPageModal' && elementId !== 'btnHideModal') {
            return;
        }

        var element = document.getElementById('wrapper');
        element.classList.remove('blurred');

        element = document.getElementById('fullPageModal');
        element.classList.add('hidden');
    }

    function displayModalExampleContent(isForSerial) {
        var serial = document.getElementById('arduinoSerialContainer');
        var johnny = document.getElementById('arduinoJohnnyFiveContainer');

        if (isForSerial) {
            serial.classList.remove('hidden');
            johnny.classList.add('hidden');
        } else {
            serial.classList.add('hidden');
            johnny.classList.remove('hidden');
        }
    }

    return {
        showModelArduinoSerial: showModelArduinoSerial,
        showModalArduinoJohnnyFive: showModalArduinoJohnnyFive,
        closeModal: closeModal
    }
}());