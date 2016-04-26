///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Classe che implementa il motore di ricerca visuale CloudSight, estende la classe base astratta "SearchEngine"
    export class CloudSight extends SearchEngine
    {
        // Costruttore, prende come parametri i servizi Angular utilizzati
        constructor(q: ng.IQService, http: ng.IHttpService, interval: ng.IIntervalService)
        {
            // Prende la chiave dallo storage locale, se non è presente viene fornito un valore di default
            let key: string = window.localStorage["CloudSight Key"] || "Q-mo9tM_bf4fGlaJaAoZ8g";

            // Definizione dei set utilizzati da CloudSight
            let sets: Array<ISearchEngineSet> = [{ name: "Product", value: "" }];

            // Chiamata al costruttore della classe base
            super("CloudSight", key, sets, q, http, interval);
        }

        /**
         * Implementazione del metodo "search"
         * @param picture La foto da cercare in formato file URI (senza ?... dopo il nome)
         * @returns Una promise con l'oggetto ritornato da CloudSight
         */
        search(picture: string): ng.IPromise<any>
        {
            console.log("cloudsight " + picture);//debug
            let q: ng.IDeferred<any> = this.$q.defer();

            /**
             * Funzione chiamata in caso di successo nell'invio della foto al server CloudSight
             * @param result L'oggetto ritornato da CloudSight contenente il token identificativo della foto caricata
             */
            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
            {
                // Inizializzazione della variabile time per il calcolo del tempo di ricerca, il + torna un valore in formato numerico della data 
                let time: number = +new Date();

                // Il token restituito da CloudSight al caricamento della foto, da utilizzare in chiamate successive per ottenere un risultato
                let token: string = JSON.parse(result.response).token;
                console.log("token: " + token);//debug

                // Funzione chiamata ogni 2 secondi, grazie al servizio $interval di Angular, che interroga i server CloudSight per ottenere un risultato
                let polling: ng.IPromise<any> = this.$interval(() =>
                {
                    // Impostazione dell'header Authorization con la chiave d'accesso a CloudSight con il servizio $http di Angular
                    this.$http.defaults.headers.common.Authorization = "CloudSight " + this.key;
                    // Chiamata a CloudSight con il servizio $http di Angular inviando il token ottenuto in precedenza
                    this.$http({
                        method: "GET",
                        url: "https://api.cloudsightapi.com/image_responses/" + token
                    }).then((promiseValue: ng.IHttpPromiseCallbackArg<any>) =>
                    {
                        // La risposta può essere "completed", "not completed", "timeout", "skipped"
                        if (promiseValue.data.status === "not completed")
                        {
                            // Nel caso lo stato sia "non completed" continuiamo ad interrogare CloudSight ogni 2 secondi
                            console.log("Not completed...");//debug
                        }
                        else
                        {
                            // Nel caso lo stato non sia "non completed" abbiamo ottenuto un risultato

                            // Calcolo il tempo trascorso per la ricerca in secondi e lo allego al risultato
                            promiseValue.data.time = (+new Date() - time) / 1000;

                            // Creo una promise di successo passando l'oggetto del risultato della ricerca (lo stato può essere diverso da "completed")
                            q.resolve(promiseValue);

                            // Fermo le chiamate alla funzione "polling"
                            this.$interval.cancel(polling);
                        }
                    }, (reason: any) =>
                    {
                        // In caso di errore creo una promise di errore passando l'oggetto ritornato
                        q.reject(reason);
                        // Fermo le chiamate alla funzione "polling"
                        this.$interval.cancel(polling);
                    });
                // Parametro del servizio $interval che indica ogni quanti ms chiamare la funzione "polling"
                }, 2000);
            };

            /**
             * Funzione chiamata in caso di errore nell'invio della foto al server CloudSight
             * @param error L'oggetto ritornato dal server ClouSight contenente il messaggio di errore
             */
            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) =>
            {
                // Creo una promise di errore passando l'oggetto ritornato
                q.reject(error);
            };

            // Oggetto contenente le opzioni del plugin FileTransfer di Cordova per l'invio della foto a CloudSight
            let options: FileUploadOptions = {
                fileKey: "image_request[image]",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                params: { "image_request[locale]": "en-US" },
                headers: { "Authorization": "CloudSight " + this.key }
            };

            // Invio della foto a CloudSight tramite il plugin FileTransfer di Cordova
            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, "https://api.cloudsightapi.com/image_requests", successCallback, errorCallback, options, true);

            // Torno la promise creata
            return q.promise;
        }

        /**
         * Implementazione del metodo "getResult"
         * @param picture La foto da cercare in formato file URI (senza ?... dopo il nome)
         * @param set L'indice del set in cui cercare, sempre 0 nel caso di CloudSight
         * @returns Una promise con l'oggetto di tipo IResult
         */
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;
            
            // Chiamata al metodo "search"
            this.search(picture).then((promiseValue: any) =>
            {
                if (promiseValue.data.status !== "completed")
                {
                    // Se lo stato ritonato è diverso da "completed" non abbiamo un risultato valido, creo una promise di errore
                    result = { ok: false, content: promiseValue.data.status };
                    q.reject(result);
                }
                else
                {
                    // Abbiamo un risultato valido, creo una promise di successo
                    result = { ok: true, content: promiseValue.data };
                    q.resolve(result);
                    //console.log("Status: " + result.content.status + "\nName: " + result.content.name + "\nPolling time: " + result.content.time + " seconds");//debug
                }
            }, (reason: any) =>
            {
                // In caso di errore allego il messaggio al risultato
                result = { ok: false, content: JSON.parse(reason.body).error };
                // Creo una promise di errore allegando il risultato
                q.reject(result);
            });

            // Torno la promise creata
            return q.promise;
        }
    }
}
