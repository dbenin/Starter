﻿///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class MetaMind extends SearchEngine
    {
        private $http: ng.IHttpService;
        options: CameraOptions;
        constructor(key: string, http: ng.IHttpService)
        {
            let sets: Array<ISearchEngineSet> = [
                { name: "General Classifier", value: "imagenet-1k-net" },
                { name: "Food Classifier", value: "food-net" },
                { name: "Custom Classifier", value: "41291" }
            ];
            super("MetaMind", key, sets);
            this.$http = http;
            this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
        }
        search(picture: string, set: number): ng.IPromise<any>
        {//picture in formato base64 SENZA header
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
        searchDatabase(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: "http://172.16.82.56/test/api/Products?component=" + component
                //url: "http://172.16.82.56/test/api/Values"
            });
        }
        getResult(picture: string, set: number): IResult
        {
            let result: IResult;
            result.status = ResultStatus.SUCCESS;
            return result;
        }
    }
}
