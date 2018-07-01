var gulp          = require('gulp'),
    plumber       = require('gulp-plumber'),
    rename        = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    imagemin      = require('gulp-imagemin'),
    cache         = require('gulp-cache'),
    minifycss     = require('gulp-minify-css'),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync');


var config = require('./gulpconfig.json');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src(config.images + '/hq/**/*')
      .pipe(cache(imagemin({
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
          svgoPlugins: [{removeViewBox: true}]
      })))
      .pipe(gulp.dest(config.images));
});

gulp.task('styles', function(){
  gulp.src([config.sass + '/**/*.scss'])
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
        }}))
      .pipe(sass())
      .pipe(rename({basename: config.default_name}))
      .pipe(gulp.dest(config.css))
      .pipe(rename({
        basename: config.default_name,
        suffix: '.min'
      }))
      .pipe(minifycss())
      .pipe(gulp.dest(config.css))
      .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return  gulp.src([
                    config.javascript + '/*.js',
                    config.exclude_files.javascript + '/*.min.js'
              ])
              .pipe(plumber({
                errorHandler: function (error) {
                  console.log(error.message);
                  this.emit('end');
                }}))
              .pipe(concat('main.js'))
              .pipe(gulp.dest(config.javascript))
              .pipe(rename({
                  basename: config.default_name,
                  suffix: '.min'
              }))
              .pipe(uglify({
                  mangle: {
                      toplevel: true
                  }
              }))
              .pipe(gulp.dest(config.javascript))
              .pipe(browserSync.reload({stream:true}))
});

gulp.task('default',  function(){
  gulp.watch(config.sass + "/**/*.scss", ['styles']);
  // gulp.watch(config.javascript + "/**/*.js", ['scripts']);
  // gulp.watch(config.images + "/hq", ['images']);
  gulp.watch("*.html", ['bs-reload']);
});
