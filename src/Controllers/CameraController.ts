///<reference path="../../typings/tsd.d.ts"/>

class CameraController
{
    static $inject = ["Picture"];

    lastPhoto: any;

    constructor(public Picture: Services.Camera.IPicture) { this.lastPhoto = ""; }

    getPhoto()
    {
        let options: CameraOptions = {};
        this.Picture.take(options).then(image => { console.log("CAMERA SUCCESS"); this.lastPhoto = image; }, error => { console.log("CAMERA ERROR"); });
    }
}

angular.module("VisualSearch").controller("CameraController", CameraController);
