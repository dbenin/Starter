/// <binding ProjectOpened='watch' />
var gulp = require("gulp");
var ts = require("gulp-typescript");
var paths = {
    scripts: ["./scripts/*.ts"],
    sass: []
};

gulp.task("scripts", function () {
    gulp.src(paths.scripts)
        .pipe(ts({
            noImplicitAny: false,
            noEmitOnError: true,
            removeComments: true,
            sourceMap: true,
            out: "bundle.js",
            target: "es5"
        }))
        .pipe(gulp.dest("www/scripts"));
});

gulp.task("watch", ["scripts"], function () {
    gulp.watch(paths.scripts, ["scripts"]);
});
