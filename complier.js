var browserify = require('browserify')
var watchify = require('watchify')
var tsify = require('tsify')
var through = require('through')
var fs = require('fs')
var path = require('path')

class SrcBundler {

    compilerOptions() {
        try {
            const tsconfig = fs.readFileSync('tsconfig.json', { encoding: "utf-8" })
            const options = JSON.parse(tsconfig).compilerOptions
            options.types = []
            return options
        } catch (error) {
            return {}
        }
    }

    createBrowserify() {
        return browserify({
            cache: {},
            packageCache: {},
        })
            .add('source/main.ts')
            .plugin(tsify, this.compilerOptions())
            .transform(function (file) {
                var data = '';
                return through(write, end);
                function write(buf) { data += buf }
                function end() {
                    if (file == path.resolve('src/main.ts')) {
                        data = resBundler.bundle() + "\n" + data
                    }
                    this.queue(data);
                    this.queue(null);
                }
            })
            .transform('uglifyify', { sourceMap: false })
    }

    watch(dest) {
        const b = this.createBrowserify()
        b.plugin(watchify)
            .on('update', () => {
                b.bundle(function (err) {
                    if (!err) {
                        console.log("✅ Built at: " + new Date())
                    }
                })
                    .on('error', (error) => {
                        this.watchDelay(error, dest)
                    })
                    .pipe(fs.createWriteStream(dest));
                console.log("📌 Started at: " + new Date())
            })
        b.bundle(function (err) {
            if (!err) {
                console.log("✅ Built at: " + new Date())
            }
        })
            .on('error', (error) => {
                this.watchDelay(error, dest)
            })
            .pipe(fs.createWriteStream(dest))
        console.log("📌 Started at: " + new Date())
    }

    watchDelay(error, dest) {
        if (this.lastError === undefined || error.message !== this.lastError.message) {
            this.lastError = error
            console.error(error)
            console.error("💔 Built failed: " + new Date())
            console.log("🚥 Compiler will try after 5 second.")
        }
        else {
            console.log("🚥 Still failed. Compiler will try after 5 second.")
        }
        // clearTimeout(this.watchTimer)
        // this.watchTimer = setTimeout(function () {
        //     this.watch(dest)
        // }.bind(this), 5000)
    }

    build(dest) {
        const b = this.createBrowserify()
        b.bundle(function () {
            console.log("✅ Built at: " + new Date())
        })
            .pipe(fs.createWriteStream(dest));
        console.log("📌 Started at: " + new Date())
    }

}

const srcBundler = new SrcBundler()

if (process.argv.includes('build')) {
    srcBundler.build('build/dist.min.js')
}
else if (process.argv.includes('watch')) {
    srcBundler.watch('build/dist.min.js')
}
