///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class GoogleCloudVision extends SearchEngine
    {
        private $http: ng.IHttpService;
        options: CameraOptions;
        constructor(key: string, http: ng.IHttpService)
        {
            let sets: Array<ISearchEngineSet> = [
                { name: "Label Detection", value: "LABEL_DETECTION" },
                { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
                { name: "Logo Detection", value: "LOGO_DETECTION" },
                { name: "Text Detection", value: "TEXT_DETECTION" }
            ];
            super("GoogleCloudVision", key, sets);
            this.$http = http;
            this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
        }
        search(picture: string, set: number): ng.IPromise<any>
        {//picture in formato base64 SENZA header
            return this.$http({
                method: "POST",
                data: '{"requests":[{"image":{"content":"' + picture + '"},"features":[{"type":"' + this.sets[set].value + '","maxResults":5}]}]}',
                url: "https://vision.googleapis.com/v1/images:annotate?key=" + this.key
            });
        }
        getResult(picture: string, set?: number): IResult
        {
            let result: IResult;
            result.status = ResultStatus.SUCCESS;
            return result;
        }
    }
}
