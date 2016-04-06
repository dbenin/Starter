///<reference path="../../typings/tsd.d.ts"/>

class SearchEnginesController
{
    static $inject = ["Loader"];
    searchEngines: Array<SearchEngines.ISearchEngine>;
    activeEngine: SearchEngines.IActiveSearchEngine;

    constructor(public Loader: SearchEngines.ILoader)
    {
        this.searchEngines = Loader.getEngines();
        this.activeEngine = Loader.getActive();
    }

    selectEngine(engineIndex, setIndex)
    {
        this.Loader.setActive(engineIndex, setIndex);

        //$scope.results = {};

        //$ionicSideMenuDelegate.toggleLeft(false);
    }
}

angular.module("VisualSearch").controller("SearchEnginesController", SearchEnginesController);
