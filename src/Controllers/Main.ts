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
            this.Picture.take(library, this.Loader.getActiveOptions()).then(image =>
            {
                this.photo = image;
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
            }, error =>
            {
                console.log("CAMERA ERROR: " + error);
            });
        }
    }
}
