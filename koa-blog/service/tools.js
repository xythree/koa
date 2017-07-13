const fs = require("fs")
const path = require("path")
const { uploadFile } = require("./upload")
const qrcode = require("./qrcode")()
const { base64 } = require("./function")()

module.exports = (router, render) => {

    router.get("/tools", async ctx => {
        ctx.body = await render("tools/index")
    })

    router.post("/qrcode", async ctx => {
        let params = ctx.request.body
        let result = {}

        if (params.text == "") {
            result.code = 0
            result.msg = "内容不能为空"
        } else {
            result.result = await qrcode({
                text: params.text,
                type: params.type || "png",
                size: params.size || 6,
                margin: params.margin || 1
            })
        }

        ctx.body = await result
    })

    router.post("/base64", async ctx => {
        let originalPath = "/static/images/"
        let serverFilePath = path.join(__dirname, originalPath)
        let result = {}

        // 上传文件事件
        result = await uploadFile(ctx, {
            fileType: "base64", // common or album
            path: serverFilePath,
            originalPath: originalPath
        })

        if (result.state == "SUCCESS") {
            let _url = "./static" + result.url

            result = await base64(_url)

        }

        ctx.body = await result
    })

    router.get("/qrcode", async ctx => {
        ctx.body = await render("tools/qrcode")
    })

    router.get("/md", async ctx => {
        ctx.body = await render("tools/markdown")
    })

}