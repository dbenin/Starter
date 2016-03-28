(function () {
    "use strict";
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        var element = document.getElementById("deviceready");
        element.innerHTML = 'Device Ready';
        element.className += ' ready';
    }
    ;
    function onPause() {
    }
    ;
    function onResume() {
    }
    ;
})();
