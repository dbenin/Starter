module VisualSearch.Controllers
{
    export class About
    {
        static $inject = ["Loader", "Layout"];

        constructor(
            private Loader: Services.Loader,
            private Layout: Services.Layout)
        { }
    }
}
