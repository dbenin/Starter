///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface IPicture
    {
        take(library: boolean, specifics: CameraOptions): ng.IPromise<string>;
        saveSettings(): void;
    }

    export class Picture implements IPicture
    {
        static $inject = ["$q"];

        settings: any = { save: false, quality: 50 };//da definire il tipo
        
        constructor(private $q: ng.IQService)
        {
            let settings: string = window.localStorage["Settings"];
            if (settings)
            {
                this.settings = angular.fromJson(settings);
            }
        }

        take(library: boolean, specifics: CameraOptions): ng.IPromise<string>
        {
            console.log("TAKE " + this.settings.save + " " + this.settings.quality);
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
                options.quality = this.settings.quality;
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.encodingType = Camera.EncodingType.JPEG;
                options.saveToPhotoAlbum = this.settings.save;
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

        saveSettings(): void
        {
            console.log("SAVE " + this.settings.save + " " + this.settings.quality);
            window.localStorage["Settings"] = angular.toJson(this.settings);
        }
    }
}
