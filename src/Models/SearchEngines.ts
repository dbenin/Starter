///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Definizione dell'interfaccia "IResult" che rappresenta il risultato restituito dal motore di ricerca visuale
    // Tutti i campi dati sono opzionali per permettere l'inizializzazione ad oggetto vuoto {} nel controller "Main"
    export interface IResult
    {
        // Vale true se rappresenta un risultato valido altrimenti false se rappresenta un errore
        ok?: boolean;

        // Contiene il risultato effettivo o la stringa d'errore (a seconda del valore del campo "ok")
        content?: any;

        // Risultato del database associato (nel caso della ricerca su archivio personalizzato)
        database?: IDatabaseResult;

        // Risultato della traduzione (nel caso di Text Detecton di Google Cloud Vision)
        translator?: ITranslatorResult;
    }

    // Definizione dell'interfaccia "ISearchEngineSet" che rappresenta il set di un motore di ricerca visuale (esempio: Text Detecton di Google Cloud Vision)
    export interface ISearchEngineSet
    {
        // Nome del set (esempio: "Text Detection")
        name: string;

        // Valore del set, usato nella richiesta al server del motore di ricerca (esempio: "TEXT_DETECTION")
        value: string;

        // Valore dell'index, usato solo per il personalizzato di JustVisual
        index?: string;
    }

    // Definizione dell'interfaccia "ISearchEngine" che rappresenta il motore di ricerca visuale
    // Espone i campi dati e metodi pubblici
    export interface ISearchEngine
    {
        // Nome del motore di ricerca visuale
        name: string;

        // Chiave di accesso alle API del motore di ricerca
        key: string;

        // Array dei set disponibili del motore di ricerca
        sets: Array<ISearchEngineSet>;

        // Opzioni specifiche del motore di ricerca per il plugin Camera di Cordova (se necessario, generalmente il formato dell'immagine)
        options?: CameraOptions;

        // Metodo per la ricerca di un'immagine in un determinato set, ritorna un risultato
        getResult(picture: string, set: number): ng.IPromise<IResult>;
    }

    // Classe base astratta per i motori di ricerca visuale, implementa l'interfaccia ISearchEngine
    export abstract class SearchEngine implements ISearchEngine
    {
        // Dichiarazione del metodo "search" che effettua la chiamata al server del motore di ricerca visuale per la
        // ricerca di un'immagine in un determinato set e torna una promise (è usato dal metodo pubblico "getResult")
        abstract search(picture: string, set?: number): ng.IPromise<any>;

        // Dichiarazione del metodo pubblico "getResult"
        abstract getResult(picture: string, set: number): ng.IPromise<IResult>;

        // Costruttore, chiamato tramite "super()" dalle classi derivate
        constructor(
            // Inizializzazione dei campi dati
            public name: string,
            public key: string,
            public sets: Array<ISearchEngineSet>,
            // Inizializzazione dei servizi Angular utilizzati
            protected $q: ng.IQService,
            protected $http?: ng.IHttpService,
            protected $interval?: ng.IIntervalService
        ) { }

        // Metodo che salva la chiave nello storage locale
        save(): void
        {
            window.localStorage[this.name + " Key"] = this.key;
        }
    }
}
