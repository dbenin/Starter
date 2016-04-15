///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class MetaMind extends SearchEngine
    {
        options: CameraOptions;
        constructor(q: ng.IQService, http: ng.IHttpService)
        {
            let key: string = window.localStorage["MetaMindKey"] || "Basic T2e0GexSpnGDPmxU4xj6kktMx89yl3aGxSGOd9jljRTe19xFYW";
            let sets: Array<ISearchEngineSet> = [
                { name: "General Classifier", value: "imagenet-1k-net" },
                { name: "Food Classifier", value: "food-net" },
                { name: "Custom Classifier", value: window.localStorage["MetaMindCustom"] || "41291" }
            ];
            super("MetaMind", key, sets, q, http);
            this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
        }
        search(picture: string, set: number): ng.IPromise<any>
        {//necessita di picture in formato base64 CON header "data:image/jpeg;base64,"
            let classifier: string = this.sets[set].value;
            if (set !== 2)
            {//aggiungo le virgolette al classifier se non e' custom (quindi non e' un numero ma una stringa)
                classifier = '"' + classifier + '"';
            }
            this.$http.defaults.headers.common.Authorization = this.key;
            return this.$http({
                method: "POST",
                data: '{"classifier_id":' + classifier + ', "image_url": "' + picture + '"}',
                url: "https://www.metamind.io/vision/classify"
            });
        }
        searchProductsDatabase(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://172.16.82.56/test/api/Products?component=" + component
            });
        }
        searchStockDatabase(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://172.16.82.56/test/api/Stock?component=" + component
            });
        }
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            this.search(picture, set).then((promiseValue: any) =>
            {
                //console.log("SUCCESS: " + JSON.stringify(promiseValue));
                result = { ok: true, content: promiseValue.data, database: { ok: true, products: {}, stock: 0 } };
                if (set === 2)
                {//custom, integro con database
                    let component: string = result.content.predictions[0].class_name;
                    console.log("CUSTOM component: " + component);
                    /*this.searchProductsDatabase(component).then((promiseValue: any) =>
                    {
                        result.database.products = promiseValue.data;
                        console.log("PRODUCTS: " + JSON.stringify(result.database.products));
                        this.searchStockDatabase(component).then((promiseValue: any) =>
                        {
                            result.database.stock = promiseValue.data[0].Stock;
                            console.log("STOCK: " + result.database.stock);
                        }).finally(() => { q.resolve(result); });
                    }, (reason: any) =>
                    {
                        result.database.ok = false;
                        q.resolve(result);
                        console.log("Database non disponibile: " + reason.data.Message);
                        alert("Database non disponibile:\n" + reason.data.Message);
                    });*///.finally(() => { q.resolve(result); });
                    Database.getResults(component).then((promiseValue: IDatabaseResult) =>
                    {
                        result.database = promiseValue;
                        //q.resolve(result);
                    });
                }
                q.resolve(result);
            }, (reason: any) =>
            {
                //console.log("FAIL: " + JSON.stringify(reason));
                result = { ok: false, content: reason.data.message };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
