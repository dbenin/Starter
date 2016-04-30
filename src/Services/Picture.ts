///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Services in cui sono definiti i servizi dell'applicazione
module VisualSearch.Services
{
    // Definizione del servizio "Picture"
    // Espone i metodi e i dati condivisi dall'applicazione per la gestione della fotocamera
    export class Picture
    {
        // Dichiarazione dei servizi usati tramite dependency injection
        static $inject = ["$q"];

        // Impostazioni generiche per il plugin Camera di Cordova
        // Vengono inizializzate a dei valori di default (non salvare, qualità 50)
        settings: Models.ISettings = { save: false, quality: 50 };
        
        // Costruttore della classe del servizio "Picture"
        constructor(private $q: ng.IQService)// Dependency injection del servizio
        {
            // Prende le impostazioni dallo storage locale se disponibili
            let settings: string = window.localStorage["Settings"];
            if (settings)
            {
                // Conversione delle impostazioni da stringa ad oggetto
                this.settings = angular.fromJson(settings);
            }
        }

        /**
         * Metodo che utilizza il plugin Camera di Cordova per ottenere una foto
         * @param library Vale true se si vuole caricare una foto dalla libreria, false per scattarla con la fotocamera
         * @param specifics Le opzioni specifiche del motore di ricerca attivo, se presenti
         * @returns Una promise con la stringa dell'immagine caricata o scattata
         */
        take(library: boolean, specifics: CameraOptions): ng.IPromise<string>
        {
            console.log("TAKE " + this.settings.save + " " + this.settings.quality);//debug

            // Oggetto delle impostazioni del plugin Camera di Cordova
            let options: CameraOptions = {};
            // Impostazioni comuni
            options.quality = this.settings.quality;
            options.correctOrientation = true;
            options.encodingType = Camera.EncodingType.JPEG;
            options.targetWidth = 640;
            options.targetHeight = 640;
            if (library)
            {
                // Impostazioni per il caricamento dalla libreria
                options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                options.mediaType = Camera.MediaType.PICTURE;
            }
            else
            {
                // Impostazioni per scattare una foto con la fotocamera del telefono
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.saveToPhotoAlbum = this.settings.save;
            }
            options.destinationType = Camera.DestinationType.FILE_URI;
            if (specifics)
            {
                // Sono presenti delle impostazioni specifiche per il motore di ricerca attivo
                console.log("WE GOT SPECIFIC OPTIONS");//debug
                // Sovrascrivo le impostazioni specifiche a quelle di default
                for (let option in specifics) { options[option] = specifics[option]; }
            }

            let q: ng.IDeferred<any> = this.$q.defer();

            // Chiamata del metodo "getPicture" del plugin Camera di Cordova
            navigator.camera.getPicture((data: string): void =>
            {
                // In caso di successo formatto la stringa ottenuta
                console.log("Data: " + data);//debug
                if (options.destinationType === Camera.DestinationType.DATA_URL)
                {
                    // Formato dell'immagine è dati in Base64 senza l'intestazione "data:image/jpeg;base64,"
                    // Aggiungo l'intestazione per una corretta visualizzazione della foto nella view con l'elemento <img>
                    data = "data:image/jpeg;base64," + data;
                }
                else
                {
                    // Formato dell'immagine è file URI, se la foto è stata scattata con la fotocamera
                    // il plugin Camera di Cordova inserisce "?" e alcuni numeri dopo il nome del file:
                    // file:///storage/emulated/0/Android/data/io.cordova.myapp46c7f9/cache/DSC_0202.JPG?1461750294298
                    // Il nome va pulito per il corretto funzionamento con i motori di ricerca visuale
                    let i: number = data.indexOf('?');
                    if (i > 0)
                    {
                        // Rimuovo "?" e quello che segue dalla stringa dell'URI
                        data = data.substr(0, i);
                    }
                }
                console.log("Image: " + data);//debug
                q.resolve(data);
            }, (message: string): void =>
            {
                q.reject(message);
            }, options);// Le opzioni passate al metodo "getPicture" del plugin Camera di Cordova

            return q.promise;
        }

        // Metodo che salva le impostazioni nello storage locale
        saveSettings(): void
        {
            console.log("SAVE " + this.settings.save + " " + this.settings.quality);//debug
            window.localStorage["Settings"] = angular.toJson(this.settings);
        }
    }
}
