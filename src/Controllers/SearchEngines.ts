///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Controllers
{
    export class SearchEngines
    {
        static $inject = ["Loader", "SideMenu"];
        searchEngines: Array<Models.ISearchEngine>;
        activeEngine: Models.IActiveNames;

        constructor(private Loader: Services.ILoader, private SideMenu: Services.ISideMenu)
        {
            this.searchEngines = Loader.getEngines();
            this.activeEngine = Loader.getActive();
        }

        selectEngine(engineIndex, setIndex)
        {
            this.Loader.setActive(engineIndex, setIndex);
            //$scope.results = {};
            this.SideMenu.toggle();
        }
    }
}
