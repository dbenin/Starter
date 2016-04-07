///<reference path="../../typings/tsd.d.ts"/>

class CameraController
{
    static $inject = ["Picture", "Loader"];

    lastPhoto: any;

    constructor(private Picture: Services.Camera.IPicture, private Loader: SearchEngines.ILoader) { this.lastPhoto = ""; }

    getPhoto(library?: boolean)
    {
        let options: CameraOptions = {};
        options.correctOrientation = true;
        options.targetWidth = 640;
        options.targetHeight = 640;
        if (library)
        {
            options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            options.mediaType = Camera.MediaType.PICTURE;
        }
        else
        {
            options.quality = 50;
            options.sourceType = Camera.PictureSourceType.CAMERA;
            options.encodingType = Camera.EncodingType.JPEG;
            options.saveToPhotoAlbum = false;
        }
        options.destinationType = Camera.DestinationType.FILE_URI;
        let specifics: CameraOptions = this.Loader.getActiveOptions();
        if (specifics)
        {
            console.log("WE GOT SPECIFIC OPTIONS");
            //overriding specific in options
            for (let option in specifics) { options[option] = specifics[option]; }
        }
        
        this.Picture.take(options).then(image =>
        {
            console.log("CAMERA SUCCESS: " + image);
            if (options.destinationType === Camera.DestinationType.DATA_URL)
            {
                this.lastPhoto = "data:image/jpeg;base64," + image;//adding header in order to display the img properly
            }
            else
            {
                this.lastPhoto = image;
            }
        }, error =>
        {
            console.log("CAMERA ERROR" + error);
        });
    }
}

//angular.module("VisualSearch").controller("CameraController", CameraController);
