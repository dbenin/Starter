﻿///<reference path="../../typings/tsd.d.ts"/>

class SearchEnginesController
{
    static $inject = ["Loader", "SideMenu"];
    searchEngines: Array<SearchEngines.ISearchEngine>;
    activeEngine: SearchEngines.IActiveSearchEngine;

    constructor(private Loader: SearchEngines.ILoader, private SideMenu: Layout.ISideMenu)
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

//angular.module("VisualSearch").controller("SearchEnginesController", SearchEnginesController);