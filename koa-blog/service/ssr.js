const fs = require("fs")

const { createRenderer, createBundleRenderer } = require("vue-server-renderer")

const staticDir = "../static/dist/js/"

const serverBundle = require(staticDir + "vue-ssr-server-bundle.json")
const clientManifest = require(staticDir + "vue-ssr-client-manifest.json")



module.exports = () => {


    return async options => {

        const renderer = createBundleRenderer(serverBundle, {
            runInNewContext: false, // 推荐
            template: fs.readFileSync(options.src, "utf-8"),
            clientManifest,
            inject: false
        })

        return await new Promise((resolve, reject) => {

            let context = {
                title: "",
                meta: "",
                scripts: "",
                abc: 123
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
                resolve(html) // 渲染完成
            })

        })

    }

}