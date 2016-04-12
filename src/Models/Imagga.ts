///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class Imagga extends SearchEngine
    {
        constructor(key: string, q: ng.IQService, http: ng.IHttpService)
        {
            let sets: Array<ISearchEngineSet> = [{ name: "Tagging", value: "tagging" }];
            super("Imagga", key, sets, q, http);

        }
        search(picture: string, set: number): ng.IPromise<any>
        {
            console.log("imagga " + picture);//formato picture dev'essere file uri senza ?... nel nome
            let q: ng.IDeferred<any> = this.$q.defer();

            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
            {
                let res: any = JSON.parse(result.response);
                if (res.status === "success")
                {
                    let id: string = res.uploaded[0].id;
                    console.log("id " + id);
                    this.$http.defaults.headers.common.Authorization = this.key;
                    this.$http({
                        method: "GET",
                        url: "https://api.imagga.com/v1/" + this.sets[set].value + "?content=" + id
                    }).then((promiseValue: ng.IHttpPromiseCallbackArg<any>) =>
                    {
                        q.resolve(promiseValue);
                    }, (reason: any) =>
                        {
                            q.reject(reason);
                        });
                }
                else
                {
                    q.reject(result);
                }
            };

            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) => { q.reject(error); };

            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                headers: { "Authorization": this.key }
            };

            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, "https://api.imagga.com/v1/content", successCallback, errorCallback, options, true);

            return q.promise;
        }
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            this.search(picture, set).then((promiseValue: any) =>
            {
                if (promiseValue.data.unsuccessful)
                {//{"results":[],"unsuccessful":[{"image":"85bd9f9a9f78cfd00049b568b579e9d0","message":"The request timed out."}]}
                    result = { ok: false, content: promiseValue.data.unsuccessful[0].message };
                    q.reject(result);
                }
                else
                {
                    result = { ok: true, content: promiseValue.data.results[0] };
                    q.resolve(result);
                    //console.log("SUCCESS: " + JSON.stringify(result.content.tags[0]));
                }
            }, (reason: any) =>
            {
                result = { ok: false, content: JSON.parse(reason.body).message };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
