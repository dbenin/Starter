var gulp = require("gulp");          // Load gulp
var uglify = require("gulp-uglify"); // Load gulp-uglify
var concat = require("gulp-concat"); // Load gulp-concat

gulp.task("combine-and-uglify", function () {
    return gulp.src('www/scripts/*.js')
        .pipe(concat('combined.js'))
        .pipe(uglify())
        .pipe(gulp.dest('min/scripts'));
});