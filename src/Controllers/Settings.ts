module VisualSearch.Controllers
{
    export class Settings
    {
        static $inject = ["Loader", "Picture", "Layout"];

        constructor(
            private Loader: Services.Loader,
            private Picture: Services.Picture,
            private Layout: Services.Layout)
        { }
    }
}
