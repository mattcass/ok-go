
// GULP & PLUGINS 
var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var autoprefixer  = require('gulp-autoprefixer');
var concat        = require('gulp-concat');
var jshint        = require('gulp-jshint');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');
var stylish       = require('jshint-stylish');
var imagemin      = require('gulp-imagemin');
var plumber       = require('gulp-plumber');
var notify        = require('gulp-notify');
var connectPHP    = require('gulp-connect-php');

// FILE STRUCTURE
var jsFiles       = 'app/assets/javascripts/*.js';
var sassFiles     = 'app/assets/stylesheets/sass/**/*.scss';                        
var imageFiles    = 'app/assets/images/*.{png, jpg, gif}';
var phpFiles      = 'app/**/*.php';

var onError = function(err) {
    notify.onError({
      title: 'Gulp',
      subtitle: 'Failure!',
      message: 'Error: <%= error.message%>',
      sound: 'beep'
    })(err);
    this.emit('end');
}

gulp.task('connectPHP', function(){
  connectPHP.server({
    hostname: '0.0.0.0',
    port: 8000,
    base: './app/'
  });
});

gulp.task('serve', ['connectPHP'], function(){
  notify: true,
  browserSync({
    proxy: 'localhost:8000'
  });
});

gulp.task('imagemin', function() {
  return gulp.src(imageFiles)
    .pipe(imagemin())
    .pipe(gulp.dest('./app/assets/images'));
});

gulp.task('php', function() {
  return gulp.src(phpFiles)
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return gulp.src(sassFiles)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/assets/stylesheets/css'))
     .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(jsFiles)
    .pipe(plumber({errorHandler: onError}))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./app/assets/javascripts/dist'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(phpFiles, ['php'] );
  gulp.watch(sassFiles, ['styles']);
  gulp.watch(jsFiles, ['js']);
  gulp.watch(imageFiles, ['imagemin']);
});

gulp.task('default', ['watch', 'styles', 'php', 'js', 'imagemin', 'serve']);
