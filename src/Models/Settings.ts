///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Definizione dell'interfaccia "ISettings" che rappresenta le impostazioni generiche per il plugin Camera di Cordova
    export interface ISettings
    {
        // Vale true se si desidera salvare in libreria la foto scattata
        save: boolean;

        // Qualità della foto in formato JPG (valori permessi tra 30 e 80)
        quality: number;
    }
}
