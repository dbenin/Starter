/// <binding ProjectOpened='watch' />
var gulp = require("gulp");
var ts = require("gulp-typescript");
var paths = {
    scripts: ["./scripts/*.ts"],
    tsconfig: "scripts/tsconfig.json",
    sass: []
};

gulp.task("scripts", function () {
    gulp.src(paths.scripts)
    .pipe(ts(ts.createProject(paths.tsconfig)))
    .pipe(gulp.dest("www/scripts"));
});

gulp.task("watch", ["scripts"], function () {
    gulp.watch(paths.scripts, ["scripts"]);
});
