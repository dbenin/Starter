///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class GoogleCloudVision extends SearchEngine
    {
        options: CameraOptions;
        constructor(q: ng.IQService, http: ng.IHttpService)
        {
            let key: string = window.localStorage["GoogleCloudVisionKey"] || "AIzaSyA3CSP33Kkj0FN1ypV7UeS_BhEcQjqLzsI";
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
        {//necessita di picture in formato base64 SENZA header "data:image/jpeg;base64,"
            let i: number = picture.indexOf(',');
            if (i > 0)
            {
                picture = picture.substr(i + 1, picture.length - 1);//removing "data:image/jpeg;base64," to work properly with API
            }
            console.log("google picture: " + picture);
            return this.$http({
                method: "POST",
                data: '{"requests":[{"image":{"content":"' + picture + '"},"features":[{"type":"' + this.sets[set].value + '","maxResults":10}]}]}',
                url: "https://vision.googleapis.com/v1/images:annotate?key=" + this.key
            });
        }
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            this.search(picture, set).then((promiseValue: any) =>
            {
                //console.log("SUCCESS: " + JSON.stringify(promiseValue));
                //console.log("Responses: " + promiseValue.data.responses.length);
                if (Object.getOwnPropertyNames(promiseValue.data.responses[0]).length === 0)
                {
                    result = { ok: false, content: "No results found." };
                    q.reject(result);
                }
                else
                {
                    //console.log("SUCCESS: " + JSON.stringify(promiseValue));
                    result = { ok: true, content: promiseValue.data };
                    q.resolve(result);
                }
            }, (reason: any) =>
            {
                //console.log("FAIL: " + JSON.stringify(reason));
                result = { ok: false, content: reason.data.error.message };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
