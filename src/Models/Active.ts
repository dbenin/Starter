///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Definizione dell'interfaccia "IActiveNames" che rappresenta i nomi del motore di ricerca visuale attivo
    export interface IActiveNames
    {
        // Nome del motore di ricerca visuale attivo (esempio: "Google Cloud Vision")
        engine: string;

        // Nome del set attivo (esempio: "Text Detection")
        set: string;
    }

    // Definizione dell'interfaccia "IActiveNames" che rappresenta gli indici del motore di ricerca visuale attivo
    export interface IActiveIndexes
    {
        // Indice del motore di ricerca visuale attivo (esempio: 2 per "Google Cloud Vision")
        engine: number;

        // Indice del set attivo (esempio: 3 per "Text Detection")
        set: number;
    }

    // Definizione dell'interfaccia "IActiveSearchEngine" che rappresenta il motore di ricerca attivo
    export interface IActiveSearchEngine
    {
        // Nomi del motore di ricerca visuale attivo
        names: IActiveNames;

        // Indici del motore di ricerca visuale attivo
        indexes: IActiveIndexes;

        // Riferimento all'oggetto del motore di ricerca visuale attivo
        engine: ISearchEngine;
    }
}
