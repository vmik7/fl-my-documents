require('dotenv').config();

const fsp = require('fs/promises');
const path = require('path');

const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const include = require('gulp-include');

// works with CSS
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const groupMedia = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');

// works with JS
const uglify = require('gulp-uglify-es').default;

// works with Images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// works with Fonts
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');

// routing
const routes = require('./gulp/routes');

// BrowserSync configuration
function browserSyncConfig() {
    browserSync.init({
        server: {
            baseDir: routes.buildFolderName,
        },
        port: process.env.PORT || 3000,
        notify: false,
        online: true,
    });
}

// * HTML

function html() {
    return (
        src(routes.src.html)
            // .pipe(webpHtml())
            .pipe(dest(routes.build.html))
            .pipe(browserSync.stream())
    );
}

// * CSS

function css() {
    return src(routes.src.scss)
        .pipe(
            sass({
                outputStyle: 'expanded',
            }).on('error', sass.logError),
        )
        .pipe(groupMedia())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true,
            }),
        )
        .pipe(dest(routes.build.css))
        .pipe(
            rename({
                extname: '.min.css',
            }),
        )
        .pipe(cleanCss())
        .pipe(dest(routes.build.css))
        .pipe(browserSync.stream());
}

// * JS

function js() {
    return src(routes.src.js)
        .pipe(include())
        .pipe(dest(routes.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: '.min.js',
            }),
        )
        .pipe(dest(routes.build.js))
        .pipe(browserSync.stream());
}

// * Images

function images() {
    return src(routes.src.images)
        .pipe(
            webp({
                quality: 70,
            }),
        )
        .pipe(dest(routes.build.images))
        .pipe(src(routes.src.images))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: true }],
                interlaced: true,
                optimizationLevel: 3, // 0..7
            }),
        )
        .pipe(dest(routes.build.images))
        .pipe(browserSync.stream());
}

// * Fonts

function fonts() {
    return src(routes.src.fonts).pipe(dest(routes.build.fonts));
}

// Converting .ttf fonts to .woff and .woff2
async function convertFonts() {
    await fsp.mkdir(path.resolve(routes.prepare.fontsTo), {
        recursive: true,
    });

    const allFiles = await fsp.readdir(routes.prepare.fontsFrom);
    const ttfFiles = allFiles.filter(
        (fileName) => path.extname(fileName) === '.ttf',
    );

    for (const fileName of ttfFiles) {
        console.log(fileName, 'converting...');
        try {
            const content = await fsp.readFile(
                path.resolve(routes.prepare.fontsFrom, fileName),
            );
            await fsp.writeFile(
                path.resolve(
                    routes.prepare.fontsTo,
                    `${path.basename(fileName, '.ttf')}.woff`,
                ),
                ttf2woff(content).toString(),
            );
            await fsp.writeFile(
                path.resolve(
                    routes.prepare.fontsTo,
                    `${path.basename(fileName, '.ttf')}.woff2`,
                ),
                ttf2woff2(content),
            );
            await fsp.rm(path.resolve(routes.prepare.fontsFrom, fileName));
        } catch (e) {
            console.error(e);
        }
    }
}

// imports builded Fonts
async function importFonts() {
    const fontsFileName = path.resolve(
        routes.srcFolderName,
        'scss/_fonts.scss',
    );
    await fsp.writeFile(fontsFileName, '');

    const files = await fsp.readdir(routes.prepare.fontsTo);
    const fontNames = new Set(
        files.map((current) => path.basename(current, path.extname(current))),
    );
    for (const font of fontNames) {
        await fsp.appendFile(
            fontsFileName,
            `@include font("${font}", "${font}", "400", "normal");\r\n`,
        );
        console.log(font, 'included!');
    }
}

// Converts and imports fonts
async function prepareFonts() {
    await convertFonts();
    await importFonts();
}

// * Favicon

function favicon() {
    return src(routes.src.favicon).pipe(dest(routes.build.favicon));
}

// Monitors source failes to be changed
function watchFiles() {
    watch([routes.watch.html], html);
    watch([routes.watch.css], css);
    watch([routes.watch.js], js);
    watch([routes.watch.images], images);
    watch([routes.watch.fonts], fonts);
}

// Clean build directory
function clean() {
    return del(routes.buildFolderName);
}

const buildFunction = series(
    parallel(clean, convertFonts),
    parallel(favicon, js, css, html, images, fonts),
);
const watchFunction = parallel(buildFunction, watchFiles, browserSyncConfig);

exports.build = buildFunction;
exports.watch = watchFunction;
exports.default = watchFunction;

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.convertFonts = convertFonts;
exports.importFonts = importFonts;
exports.prepareFonts = prepareFonts;
exports.favicon = favicon;
