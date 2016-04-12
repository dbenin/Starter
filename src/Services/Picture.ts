///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface IPicture
    {
        take(options: CameraOptions): ng.IPromise<string>;
    }

    export class Picture implements IPicture
    {
        static $inject = ["$q"];
        
        constructor(private $q: ng.IQService) { }

        take(options: CameraOptions): ng.IPromise<string>
        {
            let q: ng.IDeferred<any> = this.$q.defer();
            navigator.camera.getPicture((result): void => { q.resolve(result); }, (error): void => { q.reject(error); }, options);
            return q.promise;
        }
    }
}
