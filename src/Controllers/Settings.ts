///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Controllers in cui sono definiti i controller dell'applicazione
module VisualSearch.Controllers
{
    // Definizione del controller "Settings"
    // Espone i servizi (metodi e dati) usati dalla modal Settings nella view
    export class Settings
    {
        // Dichiarazione dei servizi usati tramite dependency injection
        static $inject = ["Loader", "Picture", "Layout"];

        // Costruttore della classe del controller "Settings"
        constructor(
            // Dependency injection dei servizi
            private Loader: Services.Loader,
            private Picture: Services.Picture,
            private Layout: Services.Layout)
        { }
    }
}
