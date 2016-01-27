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
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');

var folders = {
      globals: 'src/prereqs/',
      dist: 'dist/'
    };

// Gulp Tasks

// Concatenate globals
gulp.task('build:concat', function () {
  return gulp.src([
    folders.globals + '_variables.scss',
    folders.globals + '_mixins.scss',
    folders.globals + '_icons.scss',
    folders.globals + '_fonts.scss',
    folders.globals + '_placeholders.scss'
  ])
    .pipe(concat('include.scss'))
    .pipe(gulp.dest(folders.globals));
});

// Core building
gulp.task('build:sass', ['build:concat'], function () {
  return gulp.src('src/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourcemap: true,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(rename({basename: 'city'}))
    .pipe(sourcemaps.write('./', {sourceRoot: './'}))
    .pipe(gulp.dest(folders.dist));
});

// Production
gulp.task('production', ['build:sass'], function () {
  return gulp.src(folders.dist + 'city.css')
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    // normal version
    .pipe(gulp.dest(folders.dist))
    // minified version
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin({processImport: false}))
    .pipe(gulp.dest(folders.dist));
});

// Default task
gulp.task('default', ['build:sass', 'watch']);

// Watch files
gulp.task('watch', function () {
  gulp.watch(['src/**/*.scss', 'src/main.scss'], ['build:sass']);
});
