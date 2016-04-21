///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Controllers
{
    export class Main
    {
        static $inject = ["Loader", "Picture", "Layout"];

        photo: string;
        results: Models.IResult;

        constructor(
            private Loader: Services.Loader,
            private Picture: Services.Picture,
            private Layout: Services.Layout)
        {
            ionic.Platform.ready((): void =>
            {
                if (this.Loader.first === true)
                {
                    this.Layout.aboutModal.show();
                }
            });
            this.photo = "";
            this.results = {};
        }

        selectEngine(engineIndex, setIndex)
        {
            this.Loader.setActive(engineIndex, setIndex);
            this.results = {};
            this.photo = "";
            this.Layout.toggleSideMenu();
        }

        getPhoto(library?: boolean)
        {
            this.results = {};
            this.Picture.take(library, this.Loader.active.engine.options).then(image =>
            {
                this.photo = image;//formato immagine base64 con header oppure file uri senza ?
                this.Layout.showLoading();
                this.Loader.getResults(this.photo).then((promiseValue: Models.IResult) =>
                {
                    this.results = promiseValue;
                    if (this.results.ok) { console.log("Status OK"); }
                }, (reason: Models.IResult) =>
                {
                    this.Layout.alert(reason.content);
                    //alert(reason.content);//Cambiare in ionic alert
                }).finally(() =>
                {
                    this.Layout.hideLoading();
                });
            }, error =>
            {
                console.log("CAMERA ERROR: " + error);
            });
        }
    }
}
