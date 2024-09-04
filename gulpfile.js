const gulp = require('gulp') //r - it work, l - it doesn't  work

const fileInclude = require('gulp-file-include') //r
const server = require('gulp-server-livereload') //r

const sass = require('gulp-sass')(require('sass')) //r
const sassGlob = require('gulp-sass-glob') //r
const autoprefixer = require('gulp-autoprefixer'); //r
const concat = require('gulp-concat') //r
const sourcemaps = require('gulp-sourcemaps') //r

const clean = require('gulp-clean') //r
const fs = require('fs') //r
const changed = require('gulp-changed'); //r
const uglify = require('gulp-uglify-es').default; // r
const plumber = require('gulp-plumber'); //r

const imagemin = require('gulp-imagemin') //r 
const webpCss = require('gulp-webp-css'); // r
const webpHTML = require('gulp-webp-html'); //r
const webp = require('gulp-webp'); //r


const fileIncludeSetting = {
    prefix:'@@',
    basepath:'@file'
}
const sassSeting = {
    outputStyle:'compressed'
}
const serverSetting = {
    livereload:true,
    open : true
}
const cleanSetting = {
    force:true
}
const plumberSetting = {
    errorHandler: function(err) {
        notify.onError({
            title:    "Gulp Error",
            message:  "Error: <%= error.message %>",
            sound:    "Bottle"
        })(err);
        this.emit('end');
    }
}
const autoprefixerSetting = {
    overrideBrowserslist:['last 10 version']
}
const imageminSetting = {
    verbose:true,
}
gulp.task('clean',function(done){
    if (fs.existsSync('dist/')){
        return gulp
            .src('dist/')
            .pipe(clean(cleanSetting))
    }
    done();
})

gulp.task('html',function(){
    return gulp
        .src('src/*.html')
        .pipe(fileInclude(fileIncludeSetting))
        // .pipe(webpHTML())
        .pipe(gulp.dest('dist/'))
})

gulp.task('sass',function(){
    return gulp
        .src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(changed('dist/css/'))
        .pipe(concat('main.min.scss'))
        // .pipe(webpCss())
        .pipe(sassGlob())
        .pipe(autoprefixer(autoprefixerSetting ))
        .pipe(sass(sassSeting).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css/'))
})

gulp.task('js',function(){
    return gulp
        .src('src/js/*.js')
        .pipe(changed('dist/js/'))
        .pipe(plumber(plumberSetting))
        // .pipe(webpack(require('webpack.config.js')))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
})

gulp.task('image',function(){
    return gulp
        .src('src/img/**/*')
        // .pipe(changed('dist/img/'))
        // .pipe(webp())
        // .pipe(gulp.dest('dist/img/'))

        // .pipe(gulp.src('src/img/**/*'))
        .pipe(changed('dist/img/'))
        .pipe(imagemin(imageminSetting))
        .pipe(gulp.dest('dist/img/'))
})

gulp.task('fonts',function(){
    return gulp
        .src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})

gulp.task('server',function(){
    return gulp
        .src('dist/')
        .pipe(server(serverSetting))
})

gulp.task('watch',function(){
    gulp.watch('src/scss/**/*.scss',gulp.parallel('sass'))
    gulp.watch('src/**/*.html',gulp.parallel('html'))
    gulp.watch('src/img/**/*',gulp.parallel('image'))
    gulp.watch('src/fonts/*',gulp.parallel('fonts'))
    gulp.watch('src/js/*',gulp.parallel('js'))
})

gulp.task('default',gulp.series(
    'clean',
    gulp.parallel('html','sass','image','fonts','js'),
    gulp.parallel('server','watch')
))

// const webpack= require('webpack-stream');
