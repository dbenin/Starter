///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Classe che implementa il motore di ricerca visuale Google Cloud Vision, estende la classe base astratta "SearchEngine"
    export class GoogleCloudVision extends SearchEngine
    {
        // Opzioni specifiche di Google Cloud Vision per il plugin Camera di Cordova
        options: CameraOptions;

        // Costruttore, prende come parametri i servizi Angular utilizzati
        constructor(q: ng.IQService, http: ng.IHttpService)
        {
            // Prende la chiave dallo storage locale, se non è presente viene fornito un valore di default
            let key: string = window.localStorage["Google Cloud Vision Key"] || "AIzaSyA3CSP33Kkj0FN1ypV7UeS_BhEcQjqLzsI";

            // Definizione dei set utilizzati da Google Cloud Vision
            let sets: Array<ISearchEngineSet> = [
                { name: "Label Detection", value: "LABEL_DETECTION" },
                { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
                { name: "Logo Detection", value: "LOGO_DETECTION" },
                { name: "Text Detection", value: "TEXT_DETECTION" }
            ];

            // Chiamata al costruttore della classe base
            super("Google Cloud Vision", key, sets, q, http);

            // Inizializzazione delle opzioni specifiche, Google Cloud Vision necessita dell'immagine in formato data Base64 (invece che file URI)
            this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
        }

        /**
         * Implementazione del metodo "search"
         * @param picture La foto da cercare in formato dati Base64
         * @param set L'indice del set in cui cercare
         * @returns Una promise con l'oggetto ritornato da Google
         */
        search(picture: string, set: number): ng.IPromise<any>
        {//necessita di picture in formato dati Base64 SENZA l'header "data:image/jpeg;base64,"
            let i: number = picture.indexOf(',');
            if (i > 0)
            {
                // Esiste un carattere virgola ',' quindi tolgo l'header prendendo solo quello che viene dopo la virgola
                picture = picture.substr(i + 1, picture.length - 1);
            }
            console.log("google picture: " + picture);//debug

            // Ritorno la promise tornata dal servizio $http di Angular con la chiamata al server di Google
            return this.$http({
                method: "POST",
                data: '{"requests":[{"image":{"content":"' + picture + '"},"features":[{"type":"' + this.sets[set].value + '","maxResults":10}]}]}',
                url: "https://vision.googleapis.com/v1/images:annotate?key=" + this.key
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
            this.search(picture, set).then((promiseValue: any) =>
            {
                //console.log("SUCCESS: " + JSON.stringify(promiseValue));//debug
                //console.log("Responses: " + promiseValue.data.responses.length);//debug
                if (Object.getOwnPropertyNames(promiseValue.data.responses[0]).length === 0)
                {
                    // Se l'oggetto ritornato ha il campo responses[0] vuoto allora non sono stati trovati risultati
                    result = { ok: false, content: "Nessun risultato trovato." };
                    q.reject(result);
                }
                else
                {
                    //console.log("SUCCESS: " + JSON.stringify(promiseValue));//debug
                    result = { ok: true, content: promiseValue.data, translator: { ok: false, text: "" } };

                    // Se il set attivo è "Text Detection" integro la traduzione del testo
                    if (set === 3)
                    {
                        // Testo ottenuto dalla foto
                        let text: string = promiseValue.data.responses[0].textAnnotations[0].description;
                        // Lingua del testo ottenuto dalla foto
                        let lang: string = promiseValue.data.responses[0].textAnnotations[0].locale;
                        //console.log(text + " " + lang);//debug
                        // Chiamata al metodo di traduzione 
                        Translator.translate(text, lang).then((promiseValue: ITranslatorResult) =>
                        {
                            // Integro con il risultato della traduzione
                            result.translator = promiseValue;
                            console.log(result.translator.text);//debug
                            q.resolve(result);
                        });
                    }
                    else
                    { q.resolve(result); }
                }
            }, (reason: any) =>
            {
                // In caso di errore
                console.log("FAIL: " + JSON.stringify(reason));//debug
                // Allego il messaggio di errore al risultato
                result = { ok: false, content: reason.data.error.message };
                q.reject(result);
            });
            return q.promise;
        }
    }
}
