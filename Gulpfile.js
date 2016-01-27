/**
 * Gulpfile.js
 */

/* jshint node:true */

'use strict';

// If NodeJS version is 0.10.x, use Promise polyfill to support Autoprefixer
if (/0.10/.test(process.version)) {
  console.log("NodeJS 0.10.x detected; using Promise polyfill");
  require('es6-promise').polyfill();
}

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps');

// Gulp Tasks

// Core building
gulp.task('build:sass', function () {
  return gulp.src('src/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourcemap: true,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(rename({basename: 'city'}))
    .pipe(sourcemaps.write('./', {sourceRoot: './'}))
    .pipe(gulp.dest('dist/'));
});

// Production
gulp.task('production', ['build:sass'], function () {
  return gulp.src('dist/city.css')
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    // normal version
    .pipe(gulp.dest('dist/'))
    // minified version
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin({processImport: false}))
    .pipe(gulp.dest('dist/'));
});

// Default task
gulp.task('default', ['build:sass', 'watch']);

// Watch files
gulp.task('watch', function () {
  gulp.watch(['src/**/*.scss', 'src/main.scss'], ['build:sass']);
});
