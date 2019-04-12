'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css'); // css压缩
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const resolve  = require('rollup-plugin-node-resolve');
const commonjs  = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript');

sass.compiler = require('node-sass');

const babel = require('rollup-plugin-babel')
const Rollup = require('rollup')
const rollup = require('gulp-rollup')
const size = require('gulp-size')
const uglify = require('rollup-plugin-uglify')

const pkgjson = require('./package.json')

const mainJs = pkgjson.main || './src/js/index.js'
const allJs = './src/js/*.{js,ts}'
/**
 * css
 */

gulp.task('sass', () => {
  return gulp.src('./src/css/sass/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(concat('style.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./dist/', { sourcemaps: true }))
    .pipe(reload({stream: true}))
});

/**
 * js
 */
const rollupConfig = mini => ({
  rollup: Rollup,
  input: mainJs,
  output: {
    name: 'demo',
    format: 'umd',
    exports: 'named',
  },
  allowRealFiles: true,
  plugins: [
    // babel({exclude: 'node_modules/**'}),
    // babel({
    //   exclude: "/node_modules/",
    //   babelrc: true
    // }),
    resolve(),
    commonjs(),
    typescript({lib: ["es5", "es6", "dom"], target: "es5"}),
  ].concat(
    mini ? [
      uglify({
        compress: {warnings: false},
        mangle: true,
        sourceMap: false,
      })] : []
  ),
})
gulp.task('rollupjs', () => {
  return gulp.src(allJs)
      .pipe(rollup(rollupConfig(false)))
      .pipe(size({ showFiles: true }))
      .pipe(rename(function(path){path.extname = '.js'}))
      .pipe(gulp.dest('./dist/'))
      .pipe(reload({stream: true}))
})

gulp.task('js', () => {
  return gulp.src(mainJs)
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(reload({stream: true}))
})

// 静态服务器 + 监听css文件
gulp.task('server', function() {
  browserSync.init({
      server: {
          baseDir: "./",
      },
      port: 3033
  });
  // 监听scss文件
  gulp.watch('./src/css/sass/**/*.{scss,sass}', gulp.series('sass'));
  // 监听js文件改变
  gulp.watch('./src/js/**/*.{js,ts}', gulp.series('rollupjs'));
  // 监听html改变
  gulp.watch('./**/*.html', function () {
    reload();
  })
});

gulp.task('build', gulp.series(['sass','js']));
gulp.task('rollup-build', gulp.series(['sass','rollupjs']));