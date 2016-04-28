///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class MicrosoftComputerVision extends SearchEngine
    {
        constructor(q: ng.IQService, http: ng.IHttpService)//$http SERVE???
        {
            let key: string = window.localStorage["Microsoft Computer Vision Key"] || "98b676305b654a239d9e868d9a95c08c";
            let sets: Array<ISearchEngineSet> = [{ name: "Analyse", value: "analyze" }];
            super("Microsoft Computer Vision", key, sets, q, http);
        }

        search(picture: string): ng.IPromise<any>
        {
            let q: ng.IDeferred<any> = this.$q.defer();
            return q.promise;
        }

        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            //console.log("picture: " + picture);//debug

            let q: ng.IDeferred<IResult> = this.$q.defer();
            let res: IResult;

            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
            {
                //{"bytesSent":23890,"responseCode":200,"response":"{\"categories\":[{\"name\":\"food_fastfood\",\"score\":0.71484375}],\"adult\":{\"isAdultContent\":false,\"isRacyContent\":false,\"adultScore\":0.032451242208480835,\"racyScore\":0.033728186041116714},\"tags\":[{\"name\":\"table\",\"confidence\":0.99268251657485962},{\"name\":\"food\",\"confidence\":0.96375185251235962},{\"name\":\"plate\",\"confidence\":0.95749586820602417},{\"name\":\"sandwich\",\"confidence\":0.86936056613922119,\"hint\":\"food\"},{\"name\":\"snack food\",\"confidence\":0.55466645956039429,\"hint\":\"food\"},{\"name\":\"meat\",\"confidence\":0.30502858757972717}],\"description\":{\"tags\":[\"table\",\"food\",\"plate\",\"sandwich\",\"sitting\",\"cup\",\"top\",\"coffee\",\"bun\",\"paper\",\"meat\",\"large\",\"topped\",\"white\",\"eating\",\"cake\",\"red\",\"cheese\"],\"captions\":[{\"text\":\"a sandwich on a plate\",\"confidence\":0.882921187827322}]},\"requestId\":\"64e9d60b-0d47-4f5d-9007-644be263e636\",\"metadata\":{\"width\":640,\"height\":360,\"format\":\"Jpeg\"},\"faces\":[],\"color\":{\"dominantColorForeground\":\"Brown\",\"dominantColorBackground\":\"Brown\",\"dominantColors\":[\"Brown\",\"Grey\"],\"accentColor\":\"966235\",\"isBWImg\":false},\"imageType\":{\"clipArtType\":0,\"lineDrawingType\":0}}","objectId":""}
                console.log("success: " + JSON.stringify(result));//debug
                res = { ok: true, content: JSON.parse(result.response) };
                console.log("description: " + res.content.description.captions[0].text);
                q.resolve(res);
            };

            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) =>
            {
                //{"code":1,"source":"file:///storage/emulated/0/Android/data/io.cordova.myapp46c7f9/cache/DSC_0202.JPG","target":"https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult","http_status":401,"body":"{ \"statusCode\": 401, \"message\": \"Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription.\" }","exception":"https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult"}
                console.log("fail: " + JSON.stringify(error));//debug
                res = { ok: false, content: JSON.parse(error.body).message };
                q.reject(res);
            };

            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                headers: { "Ocp-Apim-Subscription-Key": this.key }
            };

            let uri: string = "https://api.projectoxford.ai/vision/v1.0/" + this.sets[set].value + "?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult";
            //console.log("uri: " + uri);//debug
            
            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, encodeURI(uri), successCallback, errorCallback, options, true);

            return q.promise;
        }
    }
}
