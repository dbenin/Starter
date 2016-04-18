///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class JustVisual extends SearchEngine
    {
        constructor(q: ng.IQService)
        {
            let key: string = window.localStorage["JustVisualKey"] || "8b502b94-24f6-4b97-b33e-a78ad605da31";
            let sets: Array<ISearchEngineSet> = [
                { name: "Fashion", value: "http://style.vsapi01.com" },
                { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
                { name: "Furniture", value: "http://decor.vsapi01.com" },
                { name: "Pet", value: "http://pets.vsapi01.com" },
                {
                    name: "Custom Index",
                    value: window.localStorage["JustVisualServer"] || "api.vsapi01.com",
                    index: window.localStorage["JustVisualIndex"] || "index_name"
                }
            ];
            super("JustVisual", key, sets, q);
        }
        save(): void
        {
            super.save();
            window.localStorage["JustVisualServer"] = this.sets[4].value;
            window.localStorage["JustVisualIndex"] = this.sets[4].index;
        }
        search(picture: string, set: number): ng.IPromise<any>
        {
            console.log("justvisual " + picture);
            let q: ng.IDeferred<any> = this.$q.defer();

            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) => { q.resolve(result); };

            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) => { q.reject(error); };

            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST"
            };

            let fileTransfer: FileTransfer = new FileTransfer();
            let uri: string;
            if (set === 4)//custom: http://[API_server]/search?apikey=[YOUR_API_KEY]&index=[INDEX_NAME]
            {
                uri = "http://" + this.sets[set].value + "/search?apikey=" + this.key + "&index=" + this.sets[set].index;
            }
            else
            {
                uri = this.sets[set].value + "/api-search?apikey=" + this.key;
            }
            fileTransfer.upload(picture, encodeURI(uri), successCallback, errorCallback, options, true);

            return q.promise;
        }
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            this.search(picture, set).then((promiseValue: any) =>
            {
                if (JSON.parse(promiseValue.response).errorMessage)
                {//{"errorMessage":"Result is empty","searchId":"f528ade0-00c5-11e6-95f1-a0d3c10632f4"}
                    result = { ok: false, content: JSON.parse(promiseValue.response).errorMessage };
                    q.reject(result);
                }
                else
                {//aggiungo db
                    result = { ok: true, content: JSON.parse(promiseValue.response), database: { ok: true, products: {}, stock: 0 } };
                    //console.log("SUCCESS :" + JSON.stringify(result.content));
                    if (set === 4)
                    {//custom, integro con database
                        let component: string = result.content.images[0].title;
                        console.log("CUSTOM component: " + component);
                        Database.getResults(component).then((promiseValue: IDatabaseResult) =>
                        {
                            result.database = promiseValue;
                            q.resolve(result);
                        });//never rejected so no need error callback
                    }
                    else
                    {
                        q.resolve(result);
                    }
                }
            }, (reason: any) =>
            {
                console.log("FAIL :" + JSON.stringify(reason));
                result = { ok: false, content: JSON.parse(reason.body).errorMessage };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
