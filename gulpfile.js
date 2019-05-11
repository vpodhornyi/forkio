const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const pump = require('pump');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const gulpSequence = require('gulp-sequence');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

// Clean task1

gulp.task('clean-dist', function () {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

// CSS tasks

gulp.task('sass', function () {
  return gulp.src('./src/sass/style.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('auto-prefixes', () =>
  gulp.src('src/css/style.css')
    .pipe(autoprefixer({
      browsers: ['last 100 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/css'))
);

gulp.task('minify-css', () => {
  return gulp.src('src/css/style.css')
    .pipe(cleanCSS({ compatibility: 'ie10' }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/css'));
});

gulp.task('copy-css', function () {
  return gulp.src('./src/css/style.min.css')
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('css', function (cb) {
  gulpSequence('sass', 'auto-prefixes', 'minify-css', 'copy-css')(cb)
});

// FONTS task

gulp.task('copy-fonts', function () {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
});

// JS tasks

gulp.task('concat-js', function () {
  return gulp.src(['./src/js/*.js', '!./src/js/all.js', '!./src/js/all.min.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./src/js/'));
});

gulp.task('transpile', ['concat-js'], () =>
  gulp.src('./src/js/all.js')
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(gulp.dest('./src/js'))
);

gulp.task('compress', ['transpile'], function (cb) {
  pump([
      gulp.src('./src/js/all.js'),
      uglify(),
      rename("/all.min.js"),
      gulp.dest('src/js/')
    ],
    cb
  );
});

gulp.task('copy-js', ['compress'], function () {
  return gulp.src('./src/js/all.min.js')
    .pipe(gulp.dest('./dist/js'));
});

// FONTS task

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'));
});

// IMG task

gulp.task('image-min', () =>
  gulp.src('src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
);

// SERVE

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    tunnel: true,
    host: 'localhost',
    port: 8888,
    logPrefix: ""
  });
  gulp.watch('./index.html').on('change', browserSync.reload);
  gulp.watch('./src/sass/**/*.scss', ['css', 'copy-fonts']).on('change', browserSync.reload);
  gulp.watch('./src/js/**/*.js', ['copy-js']).on('change', browserSync.reload);
});

gulp.task('dev', gulpSequence('clean-dist', 'css', 'copy-js', 'fonts', 'image-min', 'serve'));

