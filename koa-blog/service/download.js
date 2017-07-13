const fs = require("fs")
const path = require("path")
const { mkdirsSync, cleardir } = require("./function")()

module.exports = (router, render) => {

    router.get("/download", async ctx => {
        let params = ctx.request.query
        let _u = "./static" + params.url

        let result = await new Promise((resolve, reject) => {
            fs.stat(_u, async(err, stats) => {
                if (err) {
                    ctx.redirect("/404")
                } else {
                    if (stats.isFile()) {
                        let _nu = _u.split("/")

                        ctx.status = 200
                        ctx.set({
                            "Content-type": "application/octet-stream",
                            "Content-Disposition": "attachment; filename=" + _nu[_nu.length - 1],
                            "Content-Length": stats.size
                        })

                        fs.createReadStream(_u)
                        resolve(1)
                    } else {
                        resolve(0)
                    }
                }
            })
        })

        ctx.body = await result
    })

    router.post("/generate", async ctx => {
        let params = ctx.request.body
        let _url = "./static/tmp"
        let ext = params.ext == "md" ? ".md" : ".html"
        let filename = params.filename + ext
        let _path = path.resolve(_url, filename)

        await cleardir(_url)

        mkdirsSync(_url)

        let result = await new Promise((resolve, reject) => {
            let data = params.data

            if (params.ext == "html") {
                data = `<!DOCTYPE HTML>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title>${params.filename}</title>
</head>
<body>
    ${params.data}
</body>
</html>`
            }

            fs.writeFile(_path, data, "utf8", async(err, data) => {
                if (err) {
                    resolve(false)
                } else {
                    resolve("/tmp/" + filename)
                }
            })
        })

        ctx.body = await result
    })

}