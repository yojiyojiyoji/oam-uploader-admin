'use strict';

var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var exit = require('gulp-exit');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var notifier = require('node-notifier');
var rename = require('gulp-rename');
var cp = require('child_process');

////////////////////////////////////////////////////////////////////////////////
//--------------------------- Variables --------------------------------------//
//----------------------------------------------------------------------------//

// The package.json
var pkg;

////////////////////////////////////////////////////////////////////////////////
//------------------------- Helper functions ---------------------------------//
//----------------------------------------------------------------------------//

function readPackage () {
  pkg = JSON.parse(fs.readFileSync('package.json'));
  // When requiring react with addons the site suddenly stops working.
  // This happens because multiple copies of react are included.
  // One is react with the addons, the other one is the normal react
  // as specified in the dependencies.
  // https://github.com/rackt/react-router/issues/1093
  // This is easily solvable by replacing the react to be included through the
  // dependencies with the one with addons.
  pkg.dependencies['react/addons'] = pkg.dependencies.react;
  delete pkg.dependencies.react;
}
readPackage();

////////////////////////////////////////////////////////////////////////////////
//------------------------- Callable tasks -----------------------------------//
//----------------------------------------------------------------------------//

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('serve', ['vendorScripts', 'javascript', 'styles'], function () {
  browserSync({
    port: 3000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': './node_modules'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/assets/graphics/**/*'
  ]).on('change', reload);

  gulp.watch('app/assets/styles/**/*.scss', ['styles']);
  gulp.watch('package.json', ['vendorScripts']);
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('build', ['vendorScripts', 'javascript', 'collecticons'], function () {
  gulp.start(['html', 'images', 'extras'], function () {
    return gulp.src('dist/**/*')
      .pipe($.size({title: 'build', gzip: true}))
      .pipe(exit());
  });
});

////////////////////////////////////////////////////////////////////////////////
//------------------------- Browserify tasks ---------------------------------//
//------------------- (Not to be called directly) ----------------------------//
//----------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// main.js
gulp.task('javascript', function () {
  // set the correct environment, which controls what happens in config.js
  if (!process.env.DS_ENV) {
    if (!process.env.TRAVIS_BRANCH
    || process.env.TRAVIS_BRANCH !== process.env.DEPLOY_BRANCH) {
      process.env.DS_ENV = 'production';
    } else {
      process.env.DS_ENV = 'staging';
    }
  }

  var watcher = watchify(browserify({
    entries: ['./app/assets/scripts/main.js'],
    debug: true,
    transform: [reactify],
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  function bundler () {
    if (pkg.dependencies) {
      watcher.external(Object.keys(pkg.dependencies));
    }
    return watcher.bundle()
      .on('error', function (e) {
        notifier.notify({
          title: 'Oops! Browserify errored:',
          message: e.message
        });
        console.log('Sass error:', e);
        // Allows the watch to continue.
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // Source maps.
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/assets/scripts'))
      .pipe(reload({stream: true}));
  }

  watcher
  .on('log', gutil.log)
  .on('update', bundler);

  return bundler();
});

// Vendor scripts. Basically all the dependencies in the package.js.
// Therefore be careful and keep the dependencies clean.
gulp.task('vendorScripts', function() {
  // Ensure package is updated.
  readPackage();
  var vb = browserify({
    debug: true,
    transform: [reactify],
    require: pkg.dependencies ? Object.keys(pkg.dependencies) : []
  });
  return vb.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/assets/scripts/'))
    .pipe(reload({stream: true}));
});

////////////////////////////////////////////////////////////////////////////////
//------------------------- Collecticon tasks --------------------------------//
//--------------------- (Font generation related) ----------------------------//
//----------------------------------------------------------------------------//
gulp.task('collecticons', function (done) {
  var args = [
    'node_modules/collecticons-processor/bin/collecticons.js',
    'compile',
    'app/assets/graphics/collecticons/',
    '--font-embed',
    '--font-dest', 'app/assets/fonts',
    '--font-types', 'woff',
    '--style-format', 'sass',
    '--style-dest', 'app/assets/styles/',
    '--no-preview'
  ];

  return cp.spawn('node', args, {stdio: 'inherit'})
    .on('close', done);
});

////////////////////////////////////////////////////////////////////////////////
//--------------------------- Helper tasks -----------------------------------//
//----------------------------------------------------------------------------//

gulp.task('styles', function () {
  return gulp.src('app/assets/styles/main.scss')
    .pipe($.plumber(function (e) {
      notifier.notify({
        title: 'Oops! Sass errored:',
        message: e.message
      });
      console.log('Sass error:', e.toString());
      // Allows the watch to continue.
      this.emit('end');
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'].concat(require('node-neat').includePaths)
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(revReplace())
    //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/assets/graphics/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/assets/graphics'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/**/*',
    '!app/*.html',
    '!app/assets/graphics/**',
    '!app/assets/vendor/**',
    '!app/assets/styles/**',
    '!app/assets/scripts/**'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});
