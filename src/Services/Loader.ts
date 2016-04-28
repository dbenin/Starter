///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Services in cui sono definiti i servizi dell'applicazione
module VisualSearch.Services
{
    // Definizione del servizio "Loader"
    // Espone i metodi e i dati condivisi dall'applicazione per la gestione dei motori di ricerca visuale, database e traduzione
    export class Loader
    {
        // Dichiarazione dei servizi usati tramite dependency injection
        static $inject = ["$q", "$http", "$interval", "Layout"];
        
        // Vale true se è la prima esecuzione
        first: boolean;

        // Array dei motori di ricerca visuale
        engines: Array<Models.ISearchEngine>;

        // Motore di ricerca attivo
        active: Models.IActiveSearchEngine;

        // Riferimento al database
        database: Models.Database;
        // Riferimento al traduttore
        translator: Models.Translator;

        // Costruttore della classe del servizio "Loader"
        constructor(
            // Dependency injection dei servizi
            private $q: ng.IQService,
            private $http: ng.IHttpService,
            private $interval: ng.IIntervalService,
            private Layout: Services.Layout
        )
        {
            // Inizializzazione del database
            Models.Database.set(this.$q, this.$http, this.Layout);
            this.database = Models.Database;

            // Inizializzazione del traduttore
            Models.Translator.set(this.$q, this.$http, this.Layout);
            this.translator = Models.Translator;

            // Inizializzazione dei motori di ricerca visuale
            this.engines = [
                new Models.CloudSight(this.$q, this.$http, this.$interval),
                new Models.Imagga(this.$q, this.$http),
                new Models.GoogleCloudVision(this.$q, this.$http),
                new Models.MetaMind(this.$q, this.$http),
                new Models.JustVisual(this.$q),
                new Models.MicrosoftComputerVision(this.$q, this.$http)
            ];
            
            // Prende l'ultimo motore attivo dallo storage locale altrimenti viene inizializzato al primo set del primo motore
            let engineIndex: number = parseInt(window.localStorage["lastActiveEngineIndex"]) || 0;
            let setIndex: number = parseInt(window.localStorage["lastActiveSetIndex"]) || 0;
            this.active = {
                names: { engine: this.engines[engineIndex].name, set: this.engines[engineIndex].sets[setIndex].name },
                indexes: { engine: engineIndex, set: setIndex },
                engine: this.engines[engineIndex]
            };

            // Prende la variabile "First" dallo storage locale, se non esiste allora è la prima esecuzione
            this.first = window.localStorage["First"] || true;
            if (this.first)
            {
                // Prima esecuzione, modifico lo storage locale per le successive esecuzioni
                window.localStorage["First"] = false;
            }
        }

        /**
         * Metodo che imposta il motore di ricerca attivo
         * @param engineIndex L'indice del motore di ricerca da impostare come attivo
         * @param setIndex L'indice del set da impostare come attivo
         */
        setActive(engineIndex: number, setIndex: number): void
        {
            // Imposto i nomi del motore di ricerca attivo in "active"
            this.active.names.engine = this.engines[engineIndex].name;
            this.active.names.set = this.engines[engineIndex].sets[setIndex].name;
            // Imposto gli indice del motore di ricerca attivo in "active"
            this.active.indexes.engine = engineIndex;
            this.active.indexes.set = setIndex;
            // Imposto il riferimento al motore di ricerca attivo in "active"
            this.active.engine = this.engines[engineIndex];
            console.log("SET: " + this.active.indexes.set);//debug
            // Salvo gli indice del motore di ricerca attivo nello storage locale
            window.localStorage["lastActiveEngineIndex"] = engineIndex;
            window.localStorage["lastActiveSetIndex"] = setIndex;
        }

        /**
         * Metodo che chiama il metodo "getResult" del motore di ricerca attivo
         * @param picture Foto passata al metodo "getResult"
         * @return La promise tornata dal metodo "getResult" con l'oggetto di tipo IResult
         */
        getResults(picture: string): ng.IPromise<Models.IResult>
        {
            return this.active.engine.getResult(picture, this.active.indexes.set);
        }
    }
}
