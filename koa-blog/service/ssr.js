const fs = require("fs")

const { createRenderer, createBundleRenderer } = require("vue-server-renderer")

const staticDir = "../static/dist/js/"


module.exports = obj => {

    const serverBundle = require(staticDir + obj.serverBundle)
    const clientManifest = require(staticDir + obj.clientManifest)

    return async options => {

        const renderer = createBundleRenderer(serverBundle, {
            runInNewContext: false, // 推荐
            template: fs.readFileSync(options.src || "./template/html/ssr.html", "utf-8"),
            clientManifest,
            inject: false
        })

        return await new Promise((resolve, reject) => {

            let context = {
                title: "",
                meta: "",
                scripts: "",
                url: options.url
            }

            Object.assign(context, options)

            /*
            renderer.renderToString(context, (err, html) => {
                resolve(html)
            })
            */

            const stream = renderer.renderToStream(context)
            let html = ""

            stream.on("data", data => {
                html += data.toString()
            })

            stream.on("end", () => {
                let state = JSON.stringify(context.state)

                html = html.replace("<!--window-->", `<script>window.__INITIAL_STATE__=${state}</script>`)
                resolve(html)
            })

        })

    }

}