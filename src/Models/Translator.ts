///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Definizione dell'interfaccia "ITranslatorResult" che rappresenta il risultato restituito dal traduttore
    export interface ITranslatorResult
    {
        // Vale true se rappresenta un risultato valido
        ok?: boolean;

        // Traduzione del testo
        text?: string;

        // Lingua della traduzione
        lang?: string;
    }

    // Classe che implementa il traduttore, fa uso delle API Microsoft Translator
    export class Translator
    {
        // Il client ID per l'utilizzo del traduttore, se non è presente viene fornito un valore di default
        private static id: string = window.localStorage["Translator ID"] || "myapp1645";

        // Il client secret per l'utilizzo del traduttore, se non è presente viene fornito un valore di default
        private static secret: string = window.localStorage["Translator Secret"] || "qwertyuiopasdfghjklz";

        // L'ultimo token ottenuto, necesserio per l'utilizzo delle API, deve essere rinnovato dopo 10 minuti
        private static token: string = "";
        // Data (in formato numerico) in cui è stato ottenuto l'ultimo token
        private static time: number = 0;

        // Servizi utilizzati
        private static $q: ng.IQService;
        private static $http: ng.IHttpService;
        private static Layout: Services.Layout;

        // Metodo che riceve i servizi come parametri e li inizializza
        public static set($q: ng.IQService, $http: ng.IHttpService, Layout: Services.Layout)
        {
            this.$q = $q;
            this.$http = $http;
            this.Layout = Layout;
        }

        // Metodo che controlla il tempo di vita dell'ultimo token e lo rinnova
        private static getToken(): ng.IPromise<any>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();

            if (this.time === 0 || ((+new Date - this.time) / 1000 > 600))
            {
                // Token non esistente (time è 0) o scaduto (tempo maggiore di 600 sec = 10 minuti)

                // Chiamata al server Microsoft per ottenere il token con il servizio $http di Angular
                this.$http({
                    method: "POST",
                    url: "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13",
                    headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": undefined },
                    data: "client_id=" + this.id + "&client_secret=" + this.secret + "&scope=http://api.microsofttranslator.com/" + "&grant_type=client_credentials"
                }).then((promiseValue: any) =>
                {
                    // In caso di successo imposto i campi dati time e token
                    this.time = +new Date();
                    this.token = promiseValue.data.access_token;
                    q.resolve();

                    console.log("promiseValue: " + JSON.stringify(promiseValue));//debug
                    console.log("token: " + promiseValue.data.access_token);//debug
                }, (reason: any) =>
                {
                    this.time = 0;
                    q.reject(reason.data.error_description);
                    // {"data":{"error":"invalid_request","error_description":"ACS90004: The request is not properly formatted.\r\nTrace ID: 87717b10-c00e-4531-b64c-c0a920099ab3\r\nCorrelation ID: 7726471c-f716-4acf-8735-12397d7c90c0\r\nTimestamp: 2016-05-04 10:14:56Z"},"status":400,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"https://datamarket.accesscontrol.windows.net/v2/OAuth2-13","headers":{"Content-Type":"application/x-www-form-urlencoded","Accept":"application/json, text/plain, */*"},"data":"client_id=myapp1645&client_secret=ZxTXjTxp1eYJpHucFYIuuSAkdVNXgr/Kb0nF0wT4pqI=&scope=http://api.microsofttranslator.com/&grant_type=client_credentials"},"statusText":"Bad Request"}
                    console.log("FAIL: " + JSON.stringify(reason));//debug
                });
            }
            else
            {
                // Token già valido
                q.resolve();
            }

            return q.promise;
        }

        /**
         * Metodo che gestisce la chiamata alle API di traduzione
         * @param text Il testo da tradurre
         * @param lang La lingua del testo da tradurre (non quella in cui tradurre)
         * @returns Una promise con l'oggetto di tipo ITranslatorResult
         */
        public static translate(text: string, lang: string): ng.IPromise<ITranslatorResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();

            let result: ITranslatorResult = { ok: false, text: "", lang: "" };

            // Lingua in cui tradurre 
            let target: string = "it";
            if (lang === "it")
            {
                // Se la lingua di origine è già l'italiano, traduco in inglese
                target = "en";
            }

            // Chiamata al metodo "getToken"
            this.getToken().then(() =>
            {
                // Abbiamo un token valido

                // Impostazione dell'header Authorization con il token d'accesso a Microsoft Translator con il servizio $http di Angular
                this.$http.defaults.headers.common.Authorization = "Bearer " + this.token;
                // Chiamata al metodo Translate di Microsoft Translator inviando il testo, la lingua di origine e quella di destinazione
                this.$http({
                    method: "GET",
                    url: "http://api.microsofttranslator.com/v2/Http.svc/Translate?text=" + text + "&from=" + lang + "&to=" + target
                }).then((promiseValue: any) =>
                {
                    // In caso di successo formatto il risultato ottenuto
                    console.log("SUCCESS: " + JSON.stringify(promiseValue));//debug
                    let value: string = promiseValue.data;
                    // Il risultato è in formato XML
                    value = value.substr(value.indexOf('>') + 1);// Tolgo il tag iniziale <string>
                    value = value.substr(0, value.lastIndexOf('<'));// Tolgo il tag finale </string>
                    result.ok = true;
                    result.text = value;
                    result.lang = target;
                    console.log(value);//debug
                    q.resolve(result);
                }, (reason: any) =>
                {
                    console.log("FAIL: " + JSON.stringify(reason));//debug
                    q.reject(result);
                });
            }, (reason: string) =>
            {
                this.Layout.alert("Microsoft Translator. " + reason);
                q.resolve(result);
            });
            
            return q.promise;
        }

        // Metodo che salva il client ID e secret nello storage locale
        public static save(): void
        {
            window.localStorage["Translator ID"] = this.id;
            window.localStorage["Translator Secret"] = this.secret;
        }
    }
}
