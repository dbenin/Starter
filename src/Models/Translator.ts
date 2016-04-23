///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export interface ITranslatorResult
    {
        ok?: boolean;
        text?: string;
        lang?: string;
    }

    export class Translator
    {
        private static id: string = window.localStorage["Translator ID"] || "visualsearchapp";
        private static secret: string = window.localStorage["Translator Secret"] || "F0Clr0fv2s4QyKUTOyfuQ4wAHFDMKrznCRKh46o5VZ8";
        private static token: string = "";
        private static time: number = 0;

        private static $q: ng.IQService;
        private static $http: ng.IHttpService;
        private static Layout: Services.Layout;

        public static set($q: ng.IQService, $http: ng.IHttpService, Layout: Services.Layout)
        {
            this.$q = $q;
            this.$http = $http;
            this.Layout = Layout;

            //testing
            //this.translate("Fuck off you fucking piece of shit!", "en");
        }

        private static getToken(): ng.IPromise<any>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();

            if (this.time === 0 || ((+new Date - this.time) / 1000 > 600))
            {//token non esistente o scaduto (tempo maggiore di 600 sec o 10 minuti)
                this.$http({
                    method: "POST",
                    url: "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: "client_id=" + this.id + "&client_secret=" + this.secret + "&scope=http://api.microsofttranslator.com/" + "&grant_type=client_credentials"
                }).then((promiseValue: any) =>
                {
                    this.time = +new Date();
                    this.token = promiseValue.data.access_token;
                    q.resolve();

                    console.log("promiseValue: " + JSON.stringify(promiseValue));
                    console.log("token: " + promiseValue.data.access_token);
                }, (reason: any) =>
                {
                    this.time = 0;
                    q.reject();

                    console.log("FAIL: " + JSON.stringify(reason));
                });
            }
            else
            {//token già valido
                q.resolve();
            }

            return q.promise;
        }

        public static translate(text: string, lang: string): ng.IPromise<ITranslatorResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();

            let result: ITranslatorResult = { ok: false, text: "", lang: "" };
            let target: string = "it";
            if (lang === "it")
            {
                target = "en";
            }
            this.getToken().then(() =>
            {//token valido
                this.$http.defaults.headers.common.Authorization = "Bearer " + this.token;
                this.$http({
                    method: "GET",
                    url: "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + text + "&from=" + lang + "&to=" + target
                }).then((promiseValue: any) =>
                {
                    console.log("SUCCESS: " + JSON.stringify(promiseValue));
                    let value: string = promiseValue.data;
                    value = value.substr(value.indexOf('>') + 1);
                    value = value.substr(0, value.lastIndexOf('<'));
                    result.ok = true;
                    result.text = value;
                    result.lang = target;
                    console.log(value);
                    q.resolve(result);//
                }, (reason: any) =>
                {
                    console.log("FAIL: " + JSON.stringify(reason));
                    q.reject(result);
                });
            }, () =>
            {
                q.reject(result);
            });
            
            return q.promise;
        }

        public static save(): void
        {
            window.localStorage["Translator ID"] = this.id;
            window.localStorage["Translator Secret"] = this.secret;
        }
    }
}
