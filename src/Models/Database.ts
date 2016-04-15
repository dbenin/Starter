///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export interface IDatabaseResult
    {
        ok?: boolean;
        products?: any;
        stock?: number;
    }

    export class Database
    {
        private static ip: string;
        private static $q: ng.IQService;
        private static $http: ng.IHttpService;
        private static Layout: Services.ILayout;

        public static set(ip: string, $q: ng.IQService, $http: ng.IHttpService, Layout: Services.ILayout)
        {
            this.ip = ip;
            this.$q = $q;
            this.$http = $http;
            this.Layout = Layout;
        }

        private static getProducts(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://" + this.ip + "/test/api/Products?component=" + component
            });
        }

        private static getStock(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://" + this.ip + "/test/api/Stock?component=" + component
            });
        }

        public static getResults(component: string): ng.IPromise<any>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            this.Layout.alert("Database getResults()");
            return q.promise;
        }
    }
}
