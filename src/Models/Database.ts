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
        private static ip: string = window.localStorage["DatabaseIP"] || "172.16.82.56";
        private static $q: ng.IQService;
        private static $http: ng.IHttpService;
        private static Layout: Services.ILayout;

        public static set($q: ng.IQService, $http: ng.IHttpService, Layout: Services.ILayout)
        {
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

        public static getResults(component: string): ng.IPromise<IDatabaseResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IDatabaseResult = { ok: true, products: {}, stock: 0 };
            this.getProducts(component).then((promiseValue: any) =>
            {
                result.products = promiseValue.data;
                console.log("PRODUCTS: " + JSON.stringify(result.products));
                this.getStock(component).then((promiseValue: any) =>
                {
                    result.stock = promiseValue.data[0].Stock;
                    console.log("STOCK: " + result.stock);
                }).finally(() => { q.resolve(result); });
            }, (reason: any) =>
            {
                result.ok = false;
                q.resolve(result);
                this.Layout.alert("Database non disponibile.");
                //console.log("Database non disponibile: " + reason.data.Message);
                //this.Layout.alert("Database non disponibile:\n" + reason.data.Message);
            });
            return q.promise;
        }
    }
}
