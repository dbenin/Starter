///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Classe che implementa il motore di ricerca visuale MetaMind, estende la classe base astratta "SearchEngine"
    export class MetaMind extends SearchEngine
    {
        // Opzioni specifiche di MetaMind per il plugin Camera di Cordova
        options: CameraOptions;

        // Costruttore, prende come parametri i servizi Angular utilizzati
        constructor(q: ng.IQService, http: ng.IHttpService)
        {
            // Prende la chiave dallo storage locale, se non è presente viene fornito un valore di default
            let key: string = window.localStorage["MetaMind Key"] || "Basic T2e0GexSpnGDPmxU4xj6kktMx89yl3aGxSGOd9jljRTe19xFYW";

            // Definizione dei set utilizzati da MetaMind
            let sets: Array<ISearchEngineSet> = [
                { name: "General Classifier", value: "imagenet-1k-net" },
                { name: "Food Classifier", value: "food-net" },
                // Set personalizzato, prende l'ID dallo storage locale, se non è presente viene fornito un valore di default
                { name: "Custom Classifier", value: window.localStorage["MetaMindCustom"] || "41291" }
            ];

            // Chiamata al costruttore della classe base
            super("MetaMind", key, sets, q, http);

            // Inizializzazione delle opzioni specifiche, MetaMind necessita dell'immagine in formato dati Base64 (invece che il default file URI)
            this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
        }

        // Metodo che salva i dati del set personalizzato nello storage locale
        save(): void
        {
            // Chiamata al metodo base per il salvataggio della chiave
            super.save();
            window.localStorage["MetaMindCustom"] = this.sets[2].value;
        }

        /**
         * Implementazione del metodo "search"
         * @param picture La foto da cercare in formato dati Base64 (con header "data:image/jpeg;base64,")
         * @param set L'indice del set in cui cercare
         * @returns Una promise con l'oggetto ritornato da MetaMind
         */
        search(picture: string, set: number): ng.IPromise<any>
        {
            // Necessita di picture in formato base64 CON header "data:image/jpeg;base64,"
            let classifier: string = this.sets[set].value;
            if (set !== 2)
            {
                // Aggiungo le virgolette al classifier se non e' custom (quindi non e' un numero ma una stringa, esempio: '"imagenet-1k-net"')
                classifier = '"' + classifier + '"';
            }

            // Impostazione dell'header Authorization con la chiave d'accesso a CloudSight con il servizio $http di Angular
            this.$http.defaults.headers.common.Authorization = this.key;
            // Ritorno la promise tornata dal servizio $http di Angular con la chiamata al server di MetaMind
            return this.$http({
                method: "POST",
                data: '{"classifier_id":' + classifier + ', "image_url": "' + picture + '"}',
                url: "https://www.metamind.io/vision/classify"
            });
        }

        /**
         * Implementazione del metodo "getResult"
         * @param picture La foto da cercare in formato dati Base64
         * @param set L'indice del set in cui cercare
         * @returns Una promise con l'oggetto di tipo IResult
         */
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IResult;

            // Chiamata al metodo "search"
            this.search(picture, set).then((promiseValue: any) =>
            {
                //console.log("SUCCESS: " + JSON.stringify(promiseValue));//debug
                result = { ok: true, content: promiseValue.data, database: { ok: true, products: {}, stock: 0 } };
                if (set === 2)
                {
                    // Set personalizzato, integro i risultati con il database
                    // Ottengo il nome del componente da cercare con la chiamata al database
                    let component: string = result.content.predictions[0].class_name;
                    console.log("CUSTOM component: " + component);//debug

                    // Chiamata al metodo "search" del database con il nome del componente da cercare come parametro
                    Database.getResults(component).then((promiseValue: IDatabaseResult) =>
                    {
                        // Integro i risultati con l'oggetto ritornato
                        result.database = promiseValue;
                        q.resolve(result);
                    });//never rejected so no need error callback
                }
                else
                {
                    q.resolve(result);
                }
            }, (reason: any) =>
            {
                //console.log("FAIL: " + JSON.stringify(reason));//debug
                // In caso di errore allego il messaggio al risultato
                result = { ok: false, content: reason.data.message };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
