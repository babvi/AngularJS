var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyJS = require('gulp-minify');
var minifyCSS = require('gulp-minify-css');

//Get all JS files and merge and compress them as one file
var scripts =
    gulp.task('scripts', function() {
        return gulp.src([
                "**/*.js"
            ])
            .pipe(minifyJS())
            .pipe(concat('all.js'))
            .pipe(gulp.dest('./'));
    });

//Get all css files and merge and compress them as one file
gulp.task('styles', function() {
    return gulp.src([
            "**/*.css"
        ])
        .pipe(minifyCSS())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./'));
});
