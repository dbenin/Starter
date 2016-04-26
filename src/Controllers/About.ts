/**
 * Modulo VisualSearch.Controllers in cui sono definiti i controller dell'applicazione
 */
module VisualSearch.Controllers
{
    /**
     * Definizione del controller "About"
     * Espone i servizi (metodi e dati) usati dalla modal About nella view
     */
    export class About
    {
        // Dichiarazione dei servizi usati tramite dependency injection
        static $inject = ["Loader", "Layout"];

        /**
         * Costruttore della classe del controller "About"
         */
        constructor(
            // Dependency injection dei servizi
            private Loader: Services.Loader,
            private Layout: Services.Layout)
        { }
    }
}
