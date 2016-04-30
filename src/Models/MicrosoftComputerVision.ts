///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Models in cui sono definiti i modelli dei dati dell'applicazione
module VisualSearch.Models
{
    // Classe che implementa il motore di ricerca visuale Microsoft Computer Vision, estende la classe base astratta "SearchEngine"
    export class MicrosoftComputerVision extends SearchEngine
    {
        // Costruttore, prende come parametri i servizi Angular utilizzati
        constructor(q: ng.IQService)
        {
            // Prende la chiave dallo storage locale, se non è presente viene fornito un valore di default
            let key: string = window.localStorage["Microsoft Computer Vision Key"] || "98b676305b654a239d9e868d9a95c08c";

            // Definizione dei set utilizzati da Microsoft Computer Vision
            let sets: Array<ISearchEngineSet> = [
                { name: "Analyse", value: "analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult" },
                { name: "OCR", value: "ocr" }
            ];

            // Chiamata al costruttore della classe base
            super("Microsoft Computer Vision", key, sets, q);
        }

        search(picture: string): ng.IPromise<any>
        {
            let q: ng.IDeferred<any> = this.$q.defer();
            return q.promise;
        }

        /**
         * Implementazione del metodo "getResult"
         * @param picture La foto da cercare in formato file URI (senza ?... dopo il nome)
         * @param set L'indice del set in cui cercare
         * @returns Una promise con l'oggetto di tipo IResult
         */
        getResult(picture: string, set: number): ng.IPromise<IResult>
        {
            //console.log("picture: " + picture);//debug

            let q: ng.IDeferred<IResult> = this.$q.defer();
            let res: IResult;

            /**
             * Funzione chiamata in caso di successo nell'invio della foto al server Microsoft
             * @param result L'oggetto ritornato da Microsoft contenente il risultato della ricerca
             */
            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
            {
                console.log("success: " + JSON.stringify(result));//debug
                if (set === 0)
                {
                    // Analyse, esempio del formato della risposta:
                    //{"bytesSent":23890,"responseCode":200,"response":"{\"categories\":[{\"name\":\"food_fastfood\",\"score\":0.71484375}],\"adult\":{\"isAdultContent\":false,\"isRacyContent\":false,\"adultScore\":0.032451242208480835,\"racyScore\":0.033728186041116714},\"tags\":[{\"name\":\"table\",\"confidence\":0.99268251657485962},{\"name\":\"food\",\"confidence\":0.96375185251235962},{\"name\":\"plate\",\"confidence\":0.95749586820602417},{\"name\":\"sandwich\",\"confidence\":0.86936056613922119,\"hint\":\"food\"},{\"name\":\"snack food\",\"confidence\":0.55466645956039429,\"hint\":\"food\"},{\"name\":\"meat\",\"confidence\":0.30502858757972717}],\"description\":{\"tags\":[\"table\",\"food\",\"plate\",\"sandwich\",\"sitting\",\"cup\",\"top\",\"coffee\",\"bun\",\"paper\",\"meat\",\"large\",\"topped\",\"white\",\"eating\",\"cake\",\"red\",\"cheese\"],\"captions\":[{\"text\":\"a sandwich on a plate\",\"confidence\":0.882921187827322}]},\"requestId\":\"64e9d60b-0d47-4f5d-9007-644be263e636\",\"metadata\":{\"width\":640,\"height\":360,\"format\":\"Jpeg\"},\"faces\":[],\"color\":{\"dominantColorForeground\":\"Brown\",\"dominantColorBackground\":\"Brown\",\"dominantColors\":[\"Brown\",\"Grey\"],\"accentColor\":\"966235\",\"isBWImg\":false},\"imageType\":{\"clipArtType\":0,\"lineDrawingType\":0}}","objectId":""}
                    res = { ok: true, content: JSON.parse(result.response) };
                    //console.log("description: " + res.content.description.captions[0].text);//debug
                    q.resolve(res);
                }
                if (set === 1)
                {
                    // OCR, esempio del formato della risposta:
                    //{"bytesSent":47557,"responseCode":200,"response":"{\"language\":\"en\",\"textAngle\":0.0,\"orientation\":\"Up\",\"regions\":[{\"boundingBox\":\"14,133,617,219\",\"lines\":[{\"boundingBox\":\"29,133,438,60\",\"words\":[{\"boundingBox\":\"29,133,177,59\",\"text\":\"Free\"},{\"boundingBox\":\"234,150,233,43\",\"text\":\"access\"}]},{\"boundingBox\":\"14,295,617,57\",\"words\":[{\"boundingBox\":\"14,310,18,42\",\"text\":\"4\"},{\"boundingBox\":\"33,301,197,48\",\"text\":\"Weildon*t-\"},{\"boundingBox\":\"238,295,25,43\",\"text\":\"b\"},{\"boundingBox\":\"269,297,118,41\",\"text\":\"elieve\"},{\"boundingBox\":\"397,296,87,41\",\"text\":\"that\"},{\"boundingBox\":\"493,298,138,44\",\"text\":\"anyone\"}]}]}]}","objectId":""}

                    // Formattazione del testo in un'unica stringa
                    let obj: any = JSON.parse(result.response);
                    let lang: string = obj.language;
                    let text: string = "";
                    for (let i: number = 0; i < obj.regions.length; i++)
                    {
                        for (let j: number = 0; j < obj.regions[i].lines.length; j++)
                        {
                            for (let k: number = 0; k < obj.regions[i].lines[j].words.length; k++)
                            {
                                text += obj.regions[i].lines[j].words[k].text;
                                if (k + 1 !== obj.regions[i].lines[j].words.length)
                                {// Non è l'ultima parola, aggiungo uno spazio
                                    text += " ";
                                }
                            }
                            if (j + 1 !== obj.regions[i].lines.length)
                            {// Non è l'ultima riga, aggiungo uno spazio
                                text += " ";
                            }
                        }
                        if (i + 1 !== obj.regions.length)
                        {// Non è l'ultima regione, aggiungo uno spazio
                            text += " ";
                        }
                    }
                    console.log("[inzioTesto]"+text+"[fineTesto]");//debug

                    res = {
                        ok: true,
                        content: {
                            lang: lang,
                            // Se il testo è vuoto torna un testo di errore
                            text: text === "" ? "Nessun testo trovato." : text
                        },
                        translator: { ok: false, text: "" }
                    };
                    if (text !== "")
                    {
                        // Testo valido
                        Translator.translate(text, lang).then((promiseValue: ITranslatorResult) =>
                        {
                            // Integro con il risultato della traduzione
                            res.translator = promiseValue;
                            q.resolve(res);
                        });
                    }
                    else
                    {
                        console.log("No testo");//debug
                        q.resolve(res);
                    }
                }
            };

            /**
             * Funzione chiamata in caso di errore nell'invio della foto al server Microsoft
             * @param error L'oggetto ritornato dal server Microsoft contenente il messaggio di errore
             */
            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) =>
            {
                //{"code":1,"source":"file:///storage/emulated/0/Android/data/io.cordova.myapp46c7f9/cache/DSC_0202.JPG","target":"https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult","http_status":401,"body":"{ \"statusCode\": 401, \"message\": \"Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription.\" }","exception":"https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult"}
                console.log("fail: " + JSON.stringify(error));//debug
                res = { ok: false, content: JSON.parse(error.body).message || error };
                q.reject(res);
            };

            // Oggetto contenente le opzioni del plugin FileTransfer di Cordova per l'invio della foto a Microsoft
            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                headers: { "Ocp-Apim-Subscription-Key": this.key }
            };

            let uri: string = "https://api.projectoxford.ai/vision/v1.0/" + this.sets[set].value;
            //console.log("uri: " + uri);//debug
            
            // Invio della foto a Microsoft tramite il plugin FileTransfer di Cordova
            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, encodeURI(uri), successCallback, errorCallback, options, true);

            return q.promise;
        }
    }
}
