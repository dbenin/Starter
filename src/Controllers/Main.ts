///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Controllers
{
    export class Main
    {
        static $inject = ["Loader", "Picture", "Layout"];

        photo: string;
        searchEngines: Array<Models.ISearchEngine>;
        activeEngine: Models.IActiveNames;
        results: Models.IResult;

        constructor(
            private Loader: Services.ILoader,
            private Picture: Services.IPicture,
            private Layout: Services.ILayout)
        {
            this.photo = "";
            this.searchEngines = Loader.getEngines();
            this.activeEngine = Loader.getActive();
            this.results = {};
        }

        selectEngine(engineIndex, setIndex)
        {
            this.Loader.setActive(engineIndex, setIndex);
            this.results = {};
            this.photo = "";
            this.Layout.toggleSideMenu();
        }

        toggleSideMenu()//per la chiamata dalla view
        {
            this.Layout.toggleSideMenu();
        }

        getPhoto(library?: boolean)
        {
            this.results = {};
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
                //overriding options with the specifics
                for (let option in specifics) { options[option] = specifics[option]; }
            }

            this.Picture.take(options).then(image =>
            {
                console.log("Image: " + image);
                if (options.destinationType === Camera.DestinationType.DATA_URL)
                {
                    this.photo = "data:image/jpeg;base64," + image;//adding header in order to display the img properly
                }
                else
                {
                    let i: number = image.indexOf('?');
                    if (i > 0)
                    {
                        image = image.substr(0, i);//removing ? after file name to work properly with API
                    }
                    this.photo = image;
                }
                console.log("Last photo: " + this.photo);
                this.Layout.showLoading();
                this.Loader.getResults(this.photo).then((promiseValue: Models.IResult) =>
                {
                    this.results = promiseValue;
                    if (this.results.ok) { console.log("Status OK"); }
                }, (reason: any) =>
                {
                    console.log("FAIL: ");
                }).finally(() =>
                {
                    this.Layout.hideLoading();
                });
                //console.log("Status: " + result.status);
            }, error =>
            {
                console.log("CAMERA ERROR: " + error);
            });
        }
    }
}
