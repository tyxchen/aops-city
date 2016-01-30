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
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');

var folders = {
  globals: 'src/components/',
  dist: 'dist/'
};


//
// node-sass functions
//
// Experimental according to documentation but that doesn't prevent it
// from working

var functions = {
  // Turns SVG Code into a base64 data URI
  // Used in _icons.scss
  //
  // @param $svg A valid SVG document
  // @return A data URI of the base64 encoded representation of the given
  //         SVG document

  'svg_to_base64($svg)': function svg_to_base64(svg, done) {
    var String = require('node-sass').types.String,
        src = svg.getValue(),
        base64;
      src = src.replace(/[\s\\a]+(?=<)/g, '');

    base64 = new Buffer(src).toString('base64');

    done(new String('data:image/svg+xml;base64,' + base64));
  }
};

// Gulp Tasks


// Core building
gulp.task('build:sass', function () {
  return gulp.src('src/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourcemap: true,
      outputStyle: 'expanded',
      functions: functions
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
