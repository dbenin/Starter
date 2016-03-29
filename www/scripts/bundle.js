var TS;
(function (TS) {
    "use strict";
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            document.addEventListener('pause', onPause, false);
            document.addEventListener('resume', onResume, false);
            var element = document.getElementById("deviceready");
            element.innerHTML = 'Device Ready';
            element.className += ' ready';
        }
        function onPause() {
        }
        function onResume() {
        }
    })(Application = TS.Application || (TS.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(TS || (TS = {}));
