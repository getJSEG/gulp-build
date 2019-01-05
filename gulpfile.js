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

// this function concatenate, minifies, and copies all projects javascripts files and creates sourcemaps
const scripts = (cb) => {
    return gulp.src(['js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(maps.write(`./`))
    .pipe(gulp.dest(`${dist}/scripts`));    
    cb();
}
//compiles sass to css and minifies them
const styles = (cb) => {
    return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename('global.min.css'))
    .pipe(maps.write(`./`))
    .pipe(gulp.dest(`${dist}/styles`));
    cb();
}
//min. all images and set the dest. to content
const images = (cb) => { 
    return gulp.src('images/*')
    .pipe(imageMin())
    .pipe(gulp.dest(`${dist}/content`));
    cb();
}

//deletes all of the file and subdirectories in the dist directory.
const clean = (cb) => { return del(`${dist}/*`);  cb(); }

const server = cb => {
    connect.server({port:3000});
    cb();
}

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
exports.default = gulp.series(build, server);