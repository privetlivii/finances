const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const fileinclude = require('gulp-ex-file-include');
const mode = require('gulp-mode')();
const htmlbeautify = require('gulp-html-beautify');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const basePath = require('path');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const uglify = require('gulp-uglify-es').default;
const rigger = require('gulp-rigger');
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminZopfli = require("imagemin-zopfli");
const imageminMozjpeg = require("imagemin-mozjpeg");
const webp = require("gulp-webp");
const imageminWebp = require("imagemin-webp");

sass.compiler = require('node-sass');

// css task
const css = () => {
    return src('./src/styles/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename('styles.min.css'))
        .pipe(csso())
        .pipe(dest('build/css'))
        .pipe(mode.development(browserSync.stream()));
}

// js task
const js = () => {
    return src('./src/js/script.js')
        .pipe(rigger())
        .pipe(dest('./build/js'))
        .pipe(mode.development(browserSync.stream()));
}

// copy tasks
const copyImages = () => {
    return src('./src/img/**/*.{jpg,jpeg,png,svg}')
        .pipe(imagemin([
            imageminPngquant({
                speed: 5,
                quality: [0.6, 0.8]
            }),
            imageminZopfli({
                more: true
            }),
            imageminMozjpeg({
                progressive: true,
                quality: 90
            }),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {removeUnusedNS: false},
                    {removeUselessStrokeAndFill: false},
                    {cleanupIDs: false},
                    {removeComments: true},
                    {removeEmptyAttrs: true},
                    {removeEmptyText: true},
                    {collapseGroups: true}
                ]
            })
        ]))
        .pipe(dest('./build/img'));
}


const webpTask = () => {
    return src('./src/img/**/*.{jpg,jpeg,png}')
        .pipe(webp(imageminWebp({
            lossless: true,
            quality: 6,
            alphaQuality: 85
        })))
        .pipe(dest('./build/img'));
}

const copyFonts = () => {
    return src('./src/fonts/**/*.{woff,woff2}')
        .pipe(dest('build/fonts'));
}

const copyFavicon = () => {
    return src('./src/favicon/*.*')
        .pipe(dest('build/favicon'));
}

const html = () => {
    return src('./src/pages/*.html')
        .pipe(fileinclude())
        .pipe(mode.production(htmlbeautify()))
        .pipe(dest('build'))
        .pipe(mode.development(browserSync.stream()));
}

const svgStore = () => {
    return src('./src/img/spriteicons/*.svg')
        .pipe(svgmin(function (file) {
            let prefix = basePath.basename(file.relative, basePath.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(dest('./build/img'));
}

// watch task
const watchForChanges = () => {
    browserSync.init({
        server: {
            baseDir: './build/'
        },
        notify: false,
        port: 7384
    });

    watch('./src/styles/**/*.sass', css);
    watch('./src/js/**/*.js', js);
    watch('./src/pages/*.html', html);
    watch('./src/img/**/*.{png,jpg,jpeg,svg}', series(copyImages));
    watch('./src/fonts/**/*.{woff,woff2}', series(copyFonts));
    watch('./src/favicon/*.*', series(copyFavicon));
}

// public tasks
exports.default = series(parallel(css, js, copyImages, copyFonts, html, copyFavicon), watchForChanges);
exports.build = series(parallel(css, js, copyImages, copyFonts, html, copyFavicon));
exports.sprite = series(svgStore);
exports.webpTask = series(webpTask);
