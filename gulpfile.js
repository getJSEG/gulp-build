"use strict";
const gulp = require('gulp'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename'),
      maps = require('gulp-sourcemaps'),
      cleanCSS = require('gulp-clean-css'),
      imageMin = require('gulp-imagemin'),
      del = require('del'),
      connect = require('gulp-connect');

const dist = 'dist';

//sets up a server to port:3000 and enables live Re-load
const server = cb => {
    connect.server({
      port:3000,
      livereload: true
    });
    cb();
}
// this  concatenate, minifies, re-names them, creates sourcemaps and saves them inside dist/scripts directory
const scripts = (cb) => {
    return gulp.src(['js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(maps.write(`./`))
    .pipe(gulp.dest(`${dist}/scripts`))
    .pipe(connect.reload());
    cb();
}
//compiles sass to css, minifies them, re-names them, creates sourcemaps and saves them inside dist/styles diretory
const styles = (cb) => {
    return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename('all.min.css'))
    .pipe(maps.write(`./`))
    .pipe(gulp.dest(`${dist}/styles`))
    .pipe(connect.reload());
    cb();
}
//minifies all images and set the destination to content folder inside dist
const images = (cb) => {
    return gulp.src('images/*')
    .pipe(imageMin())
    .pipe(gulp.dest(`${dist}/content`));
    cb();
}

//deletes all of the file and sub-directories inside dist.
const clean = (cb) => { return del(`${dist}/*`);  cb(); }

//watches for js and scss updated files
const watch = (cb) => {
    gulp.watch('sass/**/*.scss', gulp.series('styles'));
    gulp.watch('js/**/*.js', gulp.series('scripts'));
    cb();
}

const build =  gulp.series(clean, gulp.parallel(scripts, styles, images));

exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.clean = clean;
exports.server = server;
exports.watch = watch;
exports.build = build;
exports.default = gulp.series(build, [server, watch]);
