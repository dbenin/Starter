/// <binding ProjectOpened='watch' />
var gulp = require("gulp");
var ts = require("gulp-typescript");
var sass = require('gulp-sass');
var paths = {
    scripts: ["./scripts/*.ts"],
    sass: ["./scss/ionic.app.scss"]
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
        .pipe(gulp.dest("./www/scripts"));
});

gulp.task("sass", function (done) {
    gulp.src(paths.sass)
      .pipe(sass())
      .on("error", sass.logError)
      .pipe(gulp.dest("./www/css/"))
      .on('end', done);
});

gulp.task("watch", ["scripts", "sass"], function () {
    gulp.watch(paths.scripts, ["scripts"]);
    gulp.watch(paths.sass, ["sass"]);
});
