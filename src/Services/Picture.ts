///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface IPicture
    {
        take(library: boolean, specifics: CameraOptions): ng.IPromise<string>;
    }

    export class Picture implements IPicture
    {
        static $inject = ["$q"];
        
        constructor(private $q: ng.IQService) { }

        take(library: boolean, specifics: CameraOptions): ng.IPromise<string>
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
            if (specifics)
            {
                console.log("WE GOT SPECIFIC OPTIONS");
                //overriding options with the specifics
                for (let option in specifics) { options[option] = specifics[option]; }
            }

            let q: ng.IDeferred<any> = this.$q.defer();

            navigator.camera.getPicture((data: string): void =>
            {
                console.log("Data: " + data);
                if (options.destinationType === Camera.DestinationType.DATA_URL)
                {
                    data = "data:image/jpeg;base64," + data;//adding header in order to display the img properly
                }
                else
                {
                    let i: number = data.indexOf('?');
                    if (i > 0)
                    {
                        data = data.substr(0, i);//removing ? after file name to work properly with API
                    }
                }
                console.log("Image: " + data);
                q.resolve(data);
            }, (message: string): void =>
            {
                q.reject(message);
            }, options);

            return q.promise;
        }
    }
}
