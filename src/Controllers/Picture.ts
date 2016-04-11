///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Controllers
{
    export class Picture
    {
        static $inject = ["Picture", "Loader"];

        last: any;

        constructor(private Picture: Services.IPicture, private Loader: Services.ILoader) { this.last = ""; }

        get(library?: boolean)
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
                console.log("Image: " + image);
                if (options.destinationType === Camera.DestinationType.DATA_URL)
                {
                    this.last = "data:image/jpeg;base64," + image;//adding header in order to display the img properly
                }
                else
                {
                    let i: number = image.indexOf('?');
                    if (i > 0)
                    {
                        image = image.substr(0, i);//removing ? after file name to work properly with API
                    }
                    this.last = image;
                }
                console.log("Last photo: " + this.last);
            }, error =>
            {
                console.log("CAMERA ERROR" + error);
            });
        }
    }
}
