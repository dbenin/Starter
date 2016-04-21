///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export class Layout// implements ILayout
    {
        static $inject = ["$ionicSideMenuDelegate", "$ionicLoading", "$ionicPopup", "$ionicModal"];

        settingsModal: ionic.modal.IonicModalController;
        aboutModal: ionic.modal.IonicModalController;

        constructor(
            private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate,
            private $ionicLoading: ionic.loading.IonicLoadingService,
            private $ionicPopup: ionic.popup.IonicPopupService,
            private $ionicModal: ionic.modal.IonicModalService
        )
        {
            $ionicModal.fromTemplateUrl("templates/settings.html", {
                animation: "slide-in-up"
            }).then((modal) =>
            {
                this.settingsModal = modal;
            });
            $ionicModal.fromTemplateUrl("templates/about.html", {
                animation: "slide-in-up"
            }).then((modal) =>
            {
                this.aboutModal = modal;
            });
        }

        toggleSideMenu(): void
        {
            this.$ionicSideMenuDelegate.toggleLeft();
        }

        showSettings(): void
        {
            this.settingsModal.show();
        }

        hideSettings(): void
        {
            this.settingsModal.hide();
        }

        showAbout(): void
        {
            this.aboutModal.show();
        }

        hideAbout(): void
        {
            this.aboutModal.hide();
        }

        showLoading(): void
        {
            this.$ionicLoading.show({
                template: '<p>Ricerca in corso...</p><ion-spinner icon="circles" class="spinner-dark"></ion-spinner>'
            });
        }

        hideLoading(): void
        {
            this.$ionicLoading.hide();
        }

        alert(message: string): void
        {
            this.$ionicPopup.alert({
                title: "Si è verificato un errore!",
                template: message,
                okType: "button-assertive"
            });
        }
    }
}
