'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var Server = require('karma').Server;
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var karmaConf = require('./karma.conf.js');
var _ = require('lodash');

//app directory structor
var folder = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist',
  temp: '.tmp'
};

// for sources
var paths = {
  scripts: [
    folder.app + '/scripts/**/*.module.js',
    folder.app + '/scripts/**/*.js',
    '!' + folder.app + '/scripts/**/*.spec.js'
  ],
  styles: [folder.app + '/styles/**/*.scss'],
  test: [
    folder.app + '/scripts/**/*.module.js',
    folder.app + '/scripts/**/*.js',
    folder.app + '/scripts/**/*.spec.js'
  ],
  testRequire: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-messages/angular-messages.js',
    'bower_components/angular-toastr/dist/angular-toastr.tpls.js'
  ],
  views: {
    main: folder.app + '/index.html',
    bowermain: folder.temp + '/index.html',
    files: [folder.app + '/scripts/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint) // '.jshintrc'
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, {
    browsers: ['last 2 version']
  })
  .pipe(gulp.dest, folder.temp + '/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf(folder.temp, cb);
});

gulp.task('watch', function () {
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles())
    .pipe($.connect.reload())

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload())

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())

  $.watch(paths.test)
    .pipe($.plumber())

  $.watch(paths.views.main)
    .pipe($.plumber())
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: '..'
    }))
    .pipe(gulp.dest(folder.temp))
    .pipe($.connect.reload())

  gulp.watch('bower.json', ['bower']);
});

var testConfig;
karmaConf({
  set: function (newConfig) {
    testConfig = _.assign({}, newConfig, {
      action: 'run',
      files: paths.testRequire.concat(paths.test),
      basePath: './'
    });
  }
});

gulp.task('test', function (done) {
  new Server(_.assign({}, testConfig, {
    singleRun: true,
    autoWatch: false
  })).start(done);
});

gulp.task('test:debug', function (done) {
  new Server(_.assign({}, testConfig, {
    singleRun: false,
    autoWatch: true,
    reporters: ['dots'],
    browsers: ['Chrome']
  })).start(done);
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: '..'
    }))
    .pipe(gulp.dest(folder.temp));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf(folder.dist, cb);
});

gulp.task('client:build', ['bower', 'html', 'styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.bowermain)
    .pipe($.useref({ searchPath: [folder.app, folder.temp] }))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({ cache: true }))
    .pipe(cssFilter.restore())
    .pipe(gulp.dest(folder.dist));
});

gulp.task('html', function () {
  return gulp.src(paths.views.files)
    .pipe(gulp.dest(folder.dist + '/scripts'));
});

gulp.task('images', function () {
  return gulp.src(folder.app + '/images/**/*')
    .pipe(gulp.dest(folder.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(folder.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(folder.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src('./bower_components/bootstrap/dist/fonts/**/*')
    .pipe(gulp.dest(folder.dist + '/fonts'));
});

gulp.task('build', ['clean:dist', 'bower'], function (done) {
  runSequence(['images', 'copy:extras', 'copy:fonts', 'client:build'], done);
});

gulp.task('default', function (done) {
  runSequence('lint:scripts',
    'build',
    'test',
    done);
});

///////////
// Server //
///////////

gulp.task('start:server', function () {
  $.connect.server({
    root: [folder.temp, folder.app],
    livereload: true,
    port: 9000,
    middleware: function (connect, opt) {
      return [['/bower_components', connect["static"]('./bower_components')]]
    }
  });
});

gulp.task('start:server:dist', function () {
  $.connect.server({
    root: [folder.dist],
    livereload: {
      port: 9001
    },
    port: 9000,
    middleware: function (connect, opt) {
      return [['/bower_components', connect["static"]('./bower_components')]
      ]
    }
  });
});

gulp.task('start:client', ['start:server', 'styles', 'lint:scripts'], function () {
  openURL('http://localhost:9000');
});

gulp.task('start:client:dist', ['start:server:dist'], function () {
  openURL('http://localhost:9000');
});

gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
    'bower',
    'lint:scripts',
    'start:client',
    'watch', cb);
});

gulp.task('serve:prod', function (cb) {
  runSequence('build',
    'start:client:dist',
    cb);
});