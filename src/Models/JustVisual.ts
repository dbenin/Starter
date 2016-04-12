///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class JustVisual extends SearchEngine
    {
        constructor(key: string, q: ng.IQService)
        {
            let sets: Array<ISearchEngineSet> = [
                { name: "Fashion", value: "http://style.vsapi01.com" },
                { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
                { name: "Furniture", value: "http://decor.vsapi01.com" },
                { name: "Pet", value: "http://pets.vsapi01.com" }
            ];
            super("JustVisual", key, sets, q);
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
            fileTransfer.upload(picture, encodeURI(this.sets[set].value + "/api-search?apikey=" + this.key), successCallback, errorCallback, options, true);

            return q.promise;
        }
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            this.search(picture, set).then((promiseValue: any) =>
            {
                result = { ok: true, content: promiseValue.data };
                q.resolve(result);
            }, (reason: any) =>
                {
                    result = { ok: false, content: reason };
                    q.reject(result);
                });
            return q.promise;
        }
    }
}
