///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Controllers
{
    export class Main
    {
        static $inject = ["Loader", "Picture", "Layout"];

        photo: string;
        //searchEngines: Array<Models.ISearchEngine>;
        //activeEngine: Models.IActiveNames;
        results: Models.IResult;
        database: Models.Database;

        constructor(
            private Loader: Services.Loader,
            private Picture: Services.Picture,
            private Layout: Services.Layout)
        {
            this.photo = "";
            //this.searchEngines = Loader.getEngines();//Loader.engines
            //this.activeEngine = Loader.getActive();//Loader.active.names
            this.results = {};
            this.database = Models.Database;
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
