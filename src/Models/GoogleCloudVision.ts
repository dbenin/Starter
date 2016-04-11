///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class GoogleCloudVision extends SearchEngine
    {
        options: CameraOptions;
        constructor(key: string, q: ng.IQService, http: ng.IHttpService)
        {
            let sets: Array<ISearchEngineSet> = [
                { name: "Label Detection", value: "LABEL_DETECTION" },
                { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
                { name: "Logo Detection", value: "LOGO_DETECTION" },
                { name: "Text Detection", value: "TEXT_DETECTION" }
            ];
            super("GoogleCloudVision", key, sets, q, http);
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
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            this.search(picture, set).then((promiseValue: any) =>
            {
                result = { status: ResultStatus.SUCCESS, content: promiseValue.data };
                q.resolve(result);
            }, (reason: any) =>
                {
                    result = { status: ResultStatus.ERROR, content: reason };
                    q.reject(result);
                });
            return q.promise;
        }
    }
}
