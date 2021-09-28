const merge2 = require('merge2');
const through2 = require('through2');
const path = require('path');
const gulp = require('gulp');
const cwd = process.cwd();
const libDir = path.join(cwd, 'lib');
const lessFiles = ['src/**/*.less'];
const resourceFiles = ['src/**/*.@(jpg|jpeg|gif|png|svg)'];



function moveLessFile() {
    const less = gulp
        .src(lessFiles)
        .pipe(
            through2.obj(function (file, encoding, next) {
                this.push(file);
                next();
            })
        )
        .pipe(gulp.dest(libDir));
    return less;
}


function moveResource() {
    return gulp.src(resourceFiles).pipe(gulp.dest(libDir));
}

gulp.task('less', (done) => {
    // rimraf.sync(libDir);
    merge2([moveLessFile(), moveResource()]).on('finish', done);
});


