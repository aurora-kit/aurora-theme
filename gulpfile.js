var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    csscomb       = require('gulp-csscomb'),
    cssmin        = require('gulp-cssmin'),
    header        = require('gulp-header'),
    livereload    = require('gulp-livereload'),
    notify        = require('gulp-notify'),
    plumber       = require('gulp-plumber'),
    rename        = require('gulp-rename'),
    sass          = require('gulp-sass'),
    size          = require('gulp-size'),
    package       = require('./package.json');


var banner = [
  '/* * * * * * * * * * * * * * * * * * * * *\\ \n',
    ' <%= package.name %> ',
    'v<%= package.version %> \n ',
    '<%= package.description %> \n',
    ' (c) ' + new Date().getFullYear() + ' <%= package.author %> \n',
    ' <%= package.homepage %> \n',
    ' Licensed under ' + ' <%= package.license %> \n',
  '\\* * * * * * * * * * * * * * * * * * * * */',
  '\n'
].join('');

// Scss Task
gulp.task('scss', function() {
  var onError = function(err) {
    notify.onError({
      title:    "Scss error",
      message:  "Error: <%= error.message %>",
      sound:    "Bottle"
    })(err);
    this.emit('end');
  }

  return gulp.src('src/**/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(header(banner, { package : package }))
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({
      onLast: true,
      message: 'scss task complete!'
    }));

});

// Fonts Task
gulp.task('fonts', function(){
  return gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts/'))
    .pipe(notify({
      onLast: true,
      message: 'fonts task complete!'
    }));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('src/**/*.scss', ['scss']);
  gulp.watch('src/fonts/**/*', ['fonts']);
  // livereload.listen();
});

gulp.task('default', ['fonts', 'scss']);
