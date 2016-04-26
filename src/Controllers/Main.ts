///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Controllers in cui sono definiti i controller dell'applicazione
module VisualSearch.Controllers
{
    // Definizione del controller "Main"
    // Espone i metodi, servizi e dati usati dall'applicazione principale nella view
    export class Main
    {
        // Dichiarazione dei servizi usati tramite dependency injection
        static $inject = ["Loader", "Picture", "Layout"];

        // L'ultima foto scattata (o caricata), in formato file URI o dati codificati in Base64
        // (dipende dalle opzioni del servizio attivo)
        photo: string;

        // Ultimi risultati ottenuti
        results: Models.IResult;

        // Costruttore della classe del controller "Main"
        constructor(
            // Dependency injection dei servizi
            private Loader: Services.Loader,
            private Picture: Services.Picture,
            private Layout: Services.Layout)
        {
            // Al completamento del caricamento dell'applicazione
            ionic.Platform.ready((): void =>
            {
                // Controllo se è la prima esecuzione
                if (this.Loader.first === true)
                {
                    // Mostro la pagina delle informazioni alla prima esecuzione
                    this.Layout.aboutModal.show();
                }
            });

            // Inizializzazione dei campi dati
            this.photo = "";
            this.results = {};
        }

        /**
         * Metodo chiamato dalla view alla selezione di un motore di ricerca visuale dal menù laterale da parte dell'utente
         * @param engineIndex Indice del motore di ricerca visuale selezionato (ad esempio Google Cloud Vision ha indice 2)
         * @param setIndex Indice del set selezionato (ad esempio Landmark Detection ha indice 0 all'interno di Google Cloud Vision)
         */
        selectEngine(engineIndex: number, setIndex: number): void
        {
            // Chiamata del metodo "setActive" del servizio Loader che imposta il servizio attivo
            this.Loader.setActive(engineIndex, setIndex);

            // Azzeramento dei campi, hanno l'effeto di togliere la visualizzazione dell'ultima foto e degli ultimi risultati dalla view
            this.results = {};
            this.photo = "";

            // Chiamata del metodo "toggleSideMenu" del servizio Layout che nasconde il menù laterale
            this.Layout.toggleSideMenu();
        }

        /**
         * Metodo chiamato dalla view alla pressione dei pulsanti "Scatta" o "Carica" (foto) da parte dell'utente
         * @param library opzionale, vale "true" se l'utente vuole caricare una foto (pressione del pulsante carica), altrimenti non è presente
         */
        getPhoto(library?: boolean)
        {
            // Azzeramento dei risultati, ha l'effeto di toglierne la visualizzazione dalla view
            this.results = {};

            // Chiamata del metodo "take" del servizio Picture
            this.Picture.take(library, this.Loader.active.engine.options).then((image: string) =>
            {
                // La chiamata al metodo "take" del servizio Picture ha avuto successo ed il parametro "image"
                // rappresenta la foto in formato dati Base64 (con header) oppure file URI (senza ? dopo il nome)

                // Assegnazione dell'immagine restituita da "take" al campo dati "photo" del controller,
                // ha l'effetto di visualizzare la foto nella view 
                this.photo = image;

                // Chiamata del metodo "showLoading" del servizio Layout che visualizza una schermata di caricamento
                this.Layout.showLoading();

                // Chiamata del metodo "getResults" del servizio Loader con l'ultima foto scattata come parametro
                this.Loader.getResults(this.photo).then((promiseValue: Models.IResult) =>
                {
                    // La chiamata al metodo "getResults" del servizio Loader ha avuto successo ed il parametro "promiseValue"
                    // rappresenta i risultati della ricerca

                    // Assegnazione dei risultati restituiti da "getResults" al campo dati "results" del controller,
                    // ha l'effetto di visualizzare i risultati nella view 
                    this.results = promiseValue;

                    if (this.results.ok) { console.log("Status OK"); }//debug
                }, (reason: Models.IResult) =>
                {
                    // La chiamata al metodo "getResults" del servizio Loader non ha avuto successo ed il parametro "reason"
                    // contiene l'errore restituito dal motore di ricerca visuale

                    // Chiamata del metodo "alert" del servizio Layout che visualizza l'errore restituito nella view
                    this.Layout.alert(reason.content);
                }).finally(() =>
                {
                    // Eseguita alla fine, sia in caso di successo che di errore del metodo "getResults" del servizio Loader

                    // Chiamata del metodo "hideLoading" del servizio Layout che nasconde la schermata di caricamento
                    this.Layout.hideLoading();
                });
            }, (error: any) =>
            {
                // La chiamata al metodo "take" del servizio Picture non ha avuto successo ed il parametro "error"
                // rappresenta l'errore restituito
                console.log("CAMERA ERROR: " + error);//debug
            });
        }
    }
}
