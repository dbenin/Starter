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
        private static address: string = window.localStorage["Database"] || "http://172.16.82.56";
        private static $q: ng.IQService;
        private static $http: ng.IHttpService;
        private static Layout: Services.Layout;

        public static set($q: ng.IQService, $http: ng.IHttpService, Layout: Services.Layout)
        {
            this.$q = $q;
            this.$http = $http;
            this.Layout = Layout;
        }

        private static getProducts(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: this.address + "/test/api/Products?component=" + component
            });
        }

        private static getStock(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: this.address + "/test/api/Stock?component=" + component
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
                this.Layout.alert("Service not available.");
                //console.log("Database non disponibile: " + reason.data.Message);
                //this.Layout.alert("Database non disponibile:\n" + reason.data.Message);
            });
            return q.promise;
        }

        public static save(): void
        {
            window.localStorage["Database"] = this.address;
        }
    }
}
