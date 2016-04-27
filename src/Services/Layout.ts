///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Services in cui sono definiti i servizi dell'applicazione
module VisualSearch.Services
{
    // Definizione del servizio "Layout"
    // Espone i metodi e i dati condivisi dall'applicazione per la gestione dell'interfaccia utente
    export class Layout
    {
        // Dichiarazione dei servizi usati tramite dependency injection
        static $inject = ["$ionicSideMenuDelegate", "$ionicLoading", "$ionicPopup", "$ionicModal"];

        // Modal delle impostazioni
        settingsModal: ionic.modal.IonicModalController;
        // Modal delle informazioni sull'applicazione
        aboutModal: ionic.modal.IonicModalController;

        // Costruttore della classe del servizio "Layout"
        constructor(
            // Dependency injection dei servizi
            private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate,
            private $ionicLoading: ionic.loading.IonicLoadingService,
            private $ionicPopup: ionic.popup.IonicPopupService,
            private $ionicModal: ionic.modal.IonicModalService
        )
        {
            // Inizializzazione delle modal
            $ionicModal.fromTemplateUrl("templates/settings.html", { animation: "slide-in-up" }).then((modal) => { this.settingsModal = modal; });
            $ionicModal.fromTemplateUrl("templates/about.html", { animation: "slide-in-up" }).then((modal) => { this.aboutModal = modal; });
        }

        // Metodo che visualizza o nasconde il menù laterale
        toggleSideMenu(): void
        {
            this.$ionicSideMenuDelegate.toggleLeft();
        }

        // Metodo che visualizza una schermata di caricamento
        showLoading(): void
        {
            this.$ionicLoading.show({
                template: '<p>Ricerca in corso...</p><ion-spinner icon="circles" class="spinner-dark"></ion-spinner>'
            });
        }

        // Metodo che nasconde la schermata di caricamento
        hideLoading(): void
        {
            this.$ionicLoading.hide();
        }

        /**
         * Metodo che visualizza un messaggio di errore
         * @param message Il messaggio da visualizzare
         */
        alert(message: string): void
        {
            this.$ionicPopup.alert({
                title: "Si è verificato un errore:",
                template: message,
                okType: "button-assertive"
            });
        }
    }
}
