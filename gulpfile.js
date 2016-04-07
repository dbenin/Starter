/// <binding ProjectOpened='watch' />
var gulp = require("gulp");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");
var sass = require('gulp-sass');
var paths = {
    typescript: ["./src/*/*.ts"],
    sass: ["./scss/ionic.app.scss"]
};

gulp.task("typescript", function () {
    gulp.src(paths.typescript)
        .pipe(ts({
            noImplicitAny: false,
            noEmitOnError: true,
            removeComments: true,
            sourceMap: true,
            out: "app.js",
            target: "es5"
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./www/js"));
});

gulp.task("sass", function () {
    gulp.src(paths.sass)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(gulp.dest("./www/css/"));
});

gulp.task("watch", ["typescript", "sass"], function () {
    gulp.watch(paths.typescript, ["typescript"]);
    gulp.watch(paths.sass, ["sass"]);
});
