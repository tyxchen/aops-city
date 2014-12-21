/**
 * Gulpfile.js
 */

/* jshint node:true */

'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return sass('src/main.scss', {sourcemap: true, style: 'expanded'})
    .on('error', function (e) {
      console.error(e.message);
    })
    .pipe(sourcemaps.write({sourceRoot: './'}))
    .pipe(rename({basename: 'city'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('autoprefixer', ['sass'], function () {
  return gulp.src('dist/city.css')
    .pipe(autoprefixer({browsers: ['last 2 versions']}));
});

gulp.task('production:sass', function () {
  return sass('src/main.scss', {sourcemap: false, style: 'compressed'})
    .on('error', function (e) {
      console.error(e.message);
    })
    .pipe(rename({basename: 'city', suffix: '.min'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('production', ['production:sass'], function () {
  return gulp.src('dist/city.css')
    .pipe(autoprefixer({browsers: ['last 2 versions']}));
});

gulp.task('default', ['autoprefixer', 'watch']);

gulp.task('watch', function () {
  gulp.watch(['src/**/*.scss', 'src/main.scss'], ['autoprefixer']);
});
