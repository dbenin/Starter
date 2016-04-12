///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface ILayout
    {
        toggleSideMenu(): void;
        showLoading(): void;
        hideLoading(): void;
        alert(message: string): void;
    }

    export class Layout implements ILayout
    {
        static $inject = ["$ionicSideMenuDelegate", "$ionicLoading", "$ionicPopup"];

        constructor(
            private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate,
            private $ionicLoading: ionic.loading.IonicLoadingService,
            private $ionicPopup: ionic.popup.IonicPopupService
        ) { }

        toggleSideMenu(): void
        {
            this.$ionicSideMenuDelegate.toggleLeft();
        }

        showLoading(): void
        {
            this.$ionicLoading.show({
                template: '<p>Searching...</p><ion-spinner icon="circles" class="spinner-dark"></ion-spinner>'
            });
        }

        hideLoading(): void
        {
            this.$ionicLoading.hide();
        }

        alert(message: string): void
        {
            this.$ionicPopup.alert({
                title: "An error occured",
                template: message
            });
        }
    }
}
