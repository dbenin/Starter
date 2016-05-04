///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Classe che implementa il motore di ricerca visuale JustVisual, estende la classe base astratta "SearchEngine"
    export class JustVisual extends SearchEngine
    {
        // Costruttore, prende come parametri i servizi Angular utilizzati
        constructor(q: ng.IQService)
        {
            // Prende la chiave dallo storage locale, se non è presente viene fornito un valore di default
            let key: string = window.localStorage["JustVisual Key"] || "d5355a2f-a602-43d2-bedd-3a8ffcf286f2";

            // Definizione dei set utilizzati da JustVisual
            let sets: Array<ISearchEngineSet> = [
                { name: "Fashion", value: "http://style.vsapi01.com" },
                { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
                { name: "Furniture", value: "http://decor.vsapi01.com" },
                { name: "Pet", value: "http://pets.vsapi01.com" },
                {// Set personalizzato a pagamento (non testato)
                    name: "Custom Index",
                    // Prende il server e l'indice dallo storage locale, se non sono presenti vengono forniti dei valori di default
                    value: window.localStorage["JustVisualServer"] || "api.vsapi01.com",
                    index: window.localStorage["JustVisualIndex"] || "index_name"
                }
            ];

            // Chiamata al costruttore della classe base
            super("JustVisual", key, sets, q);
        }

        // Metodo che salva i dati del set personalizzato nello storage locale
        save(): void
        {
            // Chiamata al metodo base per il salvataggio della chiave
            super.save();
            window.localStorage["JustVisualServer"] = this.sets[4].value;
            window.localStorage["JustVisualIndex"] = this.sets[4].index;
        }

        /**
         * 
         * @param picture La foto da cercare in formato file URI
         * @param set L'indice del set in cui cercare
         * @returns Una promise con l'oggetto ritornato da JustVisual
         */
        search(picture: string, set: number): ng.IPromise<any>
        {
            console.log("justvisual " + picture);//debug
            let q: ng.IDeferred<any> = this.$q.defer();

            /**
             * Funzione chiamata in caso di successo nell'invio della foto al server JustVisual
             * @param result L'oggetto ritornato da JustVisual contenente i risultati della ricerca
             */
            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) => { q.resolve(result); };

            /**
             * Funzione chiamata in caso di errore nell'invio della foto al server JustVisual
             * @param error L'oggetto ritornato dal server Imagga contenente il messaggio di errore
             */
            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) => { q.reject(error); };

            // Oggetto contenente le opzioni del plugin FileTransfer di Cordova per l'invio della foto a JustVisual
            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST"
            };

            let uri: string;
            if (set === 4)//custom: http://[API_server]/search?apikey=[YOUR_API_KEY]&index=[INDEX_NAME]
            {
                // Set personalizzato, differenzio l'indirizzo del server per la ricerca
                uri = "http://" + this.sets[set].value + "/search?apikey=" + this.key + "&index=" + this.sets[set].index;
            }
            else
            {
                uri = this.sets[set].value + "/api-search?apikey=" + this.key;
            }

            // Invio della foto a Imagga tramite il plugin FileTransfer di Cordova
            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, encodeURI(uri), successCallback, errorCallback, options, true);

            return q.promise;
        }

        /**
         * Implementazione del metodo "getResult"
         * @param picture La foto da cercare in formato file URI
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
                // Se esiste il campo errorMessage si è verificato un errore
                if (JSON.parse(promiseValue.response).errorMessage)
                {//{"errorMessage":"Result is empty","searchId":"f528ade0-00c5-11e6-95f1-a0d3c10632f4"}
                    result = { ok: false, content: JSON.parse(promiseValue.response).errorMessage };
                    q.reject(result);
                }
                else
                {
                    result = { ok: true, content: JSON.parse(promiseValue.response), database: { ok: true, products: {}, stock: 0 } };
                    //console.log("SUCCESS :" + JSON.stringify(result.content));//debug
                    
                    if (set === 4)
                    {
                        // Set personalizzato, integro i risultati con il database
                        // Ottengo il nome del componente da cercare con la chiamata al database
                        let component: string = result.content.images[0].title;
                        console.log("CUSTOM component: " + component);//debug

                        // Chiamata al metodo "search" del database con il nome del componente da cercare come parametro
                        Database.getResults(component).then((promiseValue: IDatabaseResult) =>
                        {
                            // Integro i risultati con l'oggetto ritornato
                            result.database = promiseValue;
                            q.resolve(result);
                        });// Mai rejected quindi non necessita della promise d'errore
                    }
                    else
                    {
                        q.resolve(result);
                    }
                }
            }, (reason: any) =>
            {
                console.log("FAIL :" + JSON.stringify(reason));//debug
                // In caso di errore allego il messaggio al risultato
                result = { ok: false, content: JSON.parse(reason.body).errorMessage };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
