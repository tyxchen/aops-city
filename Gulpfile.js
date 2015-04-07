/**
 * Gulpfile.js
 */

/* jshint node:true */

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps');

// Gulp Tasks

// Core building
gulp.task('build:sass', function () {
  return sass('src/main.scss', {sourcemap: true, style: 'expanded'})
    .on('error', function (e) {
      console.error(e.message);
    })
    .pipe(sourcemaps.write({sourceRoot: './'}))
    .pipe(rename({basename: 'city'}))
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
