///<reference path="../../typings/tsd.d.ts"/>

module Services.Camera
{
    export interface IPicture
    {
        take(options: CameraOptions): ng.IPromise<any>;
    }

    export class Picture implements IPicture
    {
        static $inject = ["$q"];
        
        constructor(private $q: ng.IQService) { }

        take(options)
        {
            let q: ng.IDeferred<any> = this.$q.defer();
            navigator.camera.getPicture((result): void => { q.resolve(result); }, (error): void => { q.reject(error); }, options);
            return q.promise;
        }
    }
}

//angular.module("VisualSearch").service("Picture", Services.Camera.Picture);
