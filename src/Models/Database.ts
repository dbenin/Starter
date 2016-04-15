///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export interface IDatabase
    {
        ip: string;
        getResults(component: string): ng.IPromise<any>;
    }

    export class Database implements IDatabase
    {
        constructor(
            public ip: string,
            private $q: ng.IQService,
            private $http: ng.IHttpService,
            private layout: VisualSearch.Services.ILayout
        ) { }

        getProducts(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://172.16.82.56/test/api/Products?component=" + component
            });
        }

        getStock(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://172.16.82.56/test/api/Stock?component=" + component
            });
        }

        getResults(component: string): ng.IPromise<any>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            return q.promise;
        }
    }
}
