///<reference path="../../typings/tsd.d.ts"/>

class CameraController
{
    static $inject = ["Picture"];

    lastPhoto: any;

    constructor(public Picture: Services.Camera.IPicture) { this.lastPhoto = ""; }

    getPhoto()
    {
        let options: CameraOptions = {};
        options.quality = 50;
        options.sourceType = Camera.PictureSourceType.CAMERA;
        options.encodingType = Camera.EncodingType.JPEG;
        options.destinationType = Camera.DestinationType.FILE_URI;
        options.saveToPhotoAlbum = false;
        options.correctOrientation = true;
        options.targetWidth = 640;
        options.targetHeight = 640;
        this.Picture.take(options).then(image => { console.log("CAMERA SUCCESS"); this.lastPhoto = image; }, error => { console.log("CAMERA ERROR"); });
    }
}

//angular.module("VisualSearch").controller("CameraController", CameraController);
