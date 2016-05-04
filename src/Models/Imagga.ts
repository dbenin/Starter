///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Classe che implementa il motore di ricerca visuale Imagga, estende la classe base astratta "SearchEngine"
    export class Imagga extends SearchEngine
    {
        // Costruttore, prende come parametri i servizi Angular utilizzati
        constructor(q: ng.IQService, http: ng.IHttpService)
        {
            // Prende la chiave dallo storage locale, se non è presente viene fornito un valore di default
            let key: string = window.localStorage["Imagga Key"] || "Basic YWNjXzE5NDZjMTE0Y2Y4NWM2YTpjOGY4MGFmODg0YjA0OGVjZWYwYzNkYjVlZTk0ZWJlMA==";
            
            // Definizione dei set utilizzati da Imagga
            let sets: Array<ISearchEngineSet> = [{ name: "Tagging", value: "tagging" }];

            // Chiamata al costruttore della classe base
            super("Imagga", key, sets, q, http);
        }

        /**
         * Implementazione del metodo "search"
         * @param picture La foto da cercare in formato file URI (senza ?... dopo il nome)
         * @param set L'indice del set in cui cercare
         * @returns Una promise con l'oggetto ritornato da Imagga
         */
        search(picture: string, set: number): ng.IPromise<any>
        {
            console.log("imagga " + picture);//debug
            let q: ng.IDeferred<any> = this.$q.defer();

            /**
             * Funzione chiamata in caso di successo nell'invio della foto al server Imagga
             * @param result L'oggetto ritornato da Imagga contenente l'id della foto caricata da utilizzare per la richiesta del risultato
             */
            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
            {

                let res: any = JSON.parse(result.response);
                // Se lo stato della risposta è "success"
                if (res.status === "success")
                {
                    // Ottengo l'id da utilizzare nella richiesta di risultato
                    let id: string = res.uploaded[0].id;
                    console.log("id " + id);//debug

                    // Utilizzo del servizio $http di Angular
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

            /**
             * Funzione chiamata in caso di errore nell'invio della foto al server Imagga
             * @param error L'oggetto ritornato dal server Imagga contenente il messaggio di errore
             */
            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) => { q.reject(error); };

            // Oggetto contenente le opzioni del plugin FileTransfer di Cordova per l'invio della foto a Imagga
            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                headers: { "Authorization": this.key }
            };

            // Invio della foto a Imagga tramite il plugin FileTransfer di Cordova
            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, "https://api.imagga.com/v1/content", successCallback, errorCallback, options, true);

            return q.promise;
        }

        /**
         * Implementazione del metodo "getResult"
         * @param picture La foto da cercare in formato file URI (senza ?... dopo il nome)
         * @param set L'indice del set in cui cercare, sempre 0 nel caso di Imagga
         * @returns Una promise con l'oggetto di tipo IResult
         */
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;

            // Chiamata al metodo "search"
            this.search(picture, set).then((promiseValue: any) =>
            {
                // Se esiste il campo "unsuccessful" si è verificato un errore
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
                // In caso di errore allego il messaggio al risultato
                result = { ok: false, content: JSON.parse(reason.body).message };
                // Creo una promise di errore allegando il risultato
                q.reject(result);
            });
            return q.promise;
        }
    }
}
