///<reference path="../../typings/tsd.d.ts"/>

class SearchEnginesController
{
    static $inject = ["Loader"];
    searchEngines: Array<SearchEngines.ISearchEngine>

    constructor(public Loader: SearchEngines.ILoader)
    {
        this.searchEngines = Loader.get();
    }
}

angular.module("VisualSearch").controller("SearchEnginesController", SearchEnginesController);
