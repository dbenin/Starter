///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface ILayout
    {
        toggleSideMenu(): void;
        showLoading(): void;
        hideLoading(): void;
    }

    export class Layout implements ILayout
    {
        static $inject = ["$ionicSideMenuDelegate", "$ionicLoading"];

        constructor(
            private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate,
            private $ionicLoading: ionic.loading.IonicLoadingService
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
    }
}
