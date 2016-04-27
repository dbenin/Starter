///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Definizione dell'interfaccia "IDatabaseResult" che rappresenta il risultato restituito dal database
    export interface IDatabaseResult
    {
        // Vale true se rappresenta un risultato valido
        ok?: boolean;

        // Array dei prodotti in cui è utilizzato il componente
        products?: any;

        // Giacenza del componente
        stock?: number;
    }

    // Classe che implementa l'interfacciamento con il database
    export class Database
    {
        // Indirizzo della macchina in cui è installata la Web API per il database, se non è presente viene fornito un valore di default
        private static address: string = window.localStorage["Database"] || "http://172.16.82.56";

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

        /**
         * Metodo che effettua la chiamata alla Web API per i prodotti in cui è utilizzato il componente
         * @param component Il nome del componente
         * @returns Una promise con il risultato della chiamata
         */
        private static getProducts(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: this.address + "/test/api/Products?component=" + component
            });
        }

        /**
         * Metodo che effettua la chiamata alla Web API per la giacenza del componente
         * @param component Il nome del componente
         * @returns Una promise con il risultato della chiamata
         */
        private static getStock(component: string): ng.IPromise<any>
        {
            return this.$http({
                method: "GET",
                url: this.address + "/test/api/Stock?component=" + component
            });
        }

        /**
         * Metodo che effettua le chiamate ai metodi "getProducts" e "getStock" e gestisce i risultati da ritornare al chiamante
         * @param component Il nome del componente
         * @returns Una promise con l'oggetto di tipo IDatabaseResult
         */
        public static getResults(component: string): ng.IPromise<IDatabaseResult>
        {
            let q: ng.IDeferred<IResult> = this.$q.defer();
            let result: IDatabaseResult = { ok: true, products: {}, stock: 0 };

            // Chiamata al metodo "getProducts"
            this.getProducts(component).then((promiseValue: any) =>
            {
                result.products = promiseValue.data;
                console.log("PRODUCTS: " + JSON.stringify(result.products));//debug
                // Chiamata al metodo "getStock"
                this.getStock(component).then((promiseValue: any) =>
                {
                    result.stock = promiseValue.data[0].Stock;
                    console.log("STOCK: " + result.stock);
                }).finally(() => { q.resolve(result); });
            }, (reason: any) =>
            {
                result.ok = false;
                q.resolve(result);
                // Visualizzo un messaggio di errore tramite il servizio Layout
                this.Layout.alert("Servizio prodotti e componenti non disponibile.");
                //console.log("Database non disponibile: " + reason.data.Message);//debug
            });
            return q.promise;
        }

        // Metodo che salva l'indirizzo nello storage locale
        public static save(): void
        {
            window.localStorage["Database"] = this.address;
        }
    }
}
