var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = 'dist';
var LIVERELOAD_PORT = 35729;

// let's make things more readable by
// encapsulating each part's setup
// in its own method
function startExpress() {

    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);
}


var lr;
function startLivereload() {

    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}

// notifies livereload of changes detected
// by `gulp.watch()` 
function notifyLivereload(event) {
    // `gulp.watch()` events provide an absolute path
    // so we need to make it relative to the server root
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

// takes jade files and compiles them into HTML
gulp.task('templates', function(){
    return gulp.src('src/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('dist/'));
});

// takes less files, compiles, minifies 
// and prefixes to beautiful CSS
gulp.task('styles', function(){
    var LessPluginCleanCSS = require('less-plugin-clean-css'),
        LessPluginAutoPrefix = require('less-plugin-autoprefix'),
        cleancss = new LessPluginCleanCSS({ advanced: true }),
        autoprefix= new LessPluginAutoPrefix({ browsers: ['last 2 versions'] });

    return gulp.src('src/styles/*.less')
      .pipe(less({
        plugins: [autoprefix, cleancss]
      }))
      .pipe(gulp.dest('dist/styles'));
})

// run this before you start your daily routine
gulp.task('build', ['templates', 'styles']);

// I wanted to keep gulp tasks to minimal,
// so if you end up in hundreds of files, this won't
// be maintainable, you'll have to break it up
gulp.task('default', function(){

    startExpress();
    startLivereload();


    // watch changes for dev files
    gulp.watch('src/*.jade', ['templates']);
    gulp.watch('src/styles/*.less', ['styles']);

    // when build changes, reload assets (not js!)
    gulp.watch('dist/*.html', notifyLivereload);
    gulp.watch('dist/styles/*.css', notifyLivereload);
});


