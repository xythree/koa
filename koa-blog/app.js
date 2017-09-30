const koa = require("koa")
const router = require("koa-router")()
const serve = require("koa-static-cache")
const views = require("co-views")
const bodyparser = require("koa-bodyparser")
const session = require("koa-session2")
    //const session = require("koa-session-store")
    //const mongoStore = require("koa-session-mongo")
const app = new koa()
const path = require("path")
const fs = require("fs")
const server = require("http").createServer(app.callback())
const io = require("socket.io")(server)

const config = require("./config")
const mw_request = require("./middleware/request")

const render = views("./views", {
    ext: "ejs"
})


//const mongoose = require("./service/mongoose")
const mon = require("./service/sql")

app.use(session({
    maxAge: 1000 * 60 * 60 * 24,
    key: "SESSIONID" //default "koa:sess" 
}))

/*
app.keys = ["SESSIONID"]
app.use(session({
    store: mongoStore.create({
        db: "koa_blog",
        collection: "sessions",
        maxAge: 60 * 60 * 1000
    })
}))
*/

app.use(require("koa-favicon")(__dirname + '/static/favicon.ico'))

app.use(require("koa-compress")({
    filter: function(content_type) { //配置过滤的压缩文件的类型
        return /text/i.test(content_type)
    },
    threshold: 2048, //要压缩的最小响应字节
    flush: require('zlib').Z_SYNC_FLUSH //同步的刷新缓冲区数据
}))

app.use(mw_request())

app.use(bodyparser())

app.use(serve(path.join(__dirname, "static"), {
    //maxAge: 1000 * 60 * 60 * 24
}))

app.use(router.routes())

app.use(async(ctx, next) => {

        if (ctx.response.status == 404) {
            if (ctx.request.header["content-type"]) {
                ctx.status = 404
                ctx.body = ""
            } else {
                ctx.redirect("/404")
            }
        }
        next()
    })
    /*
    router.use("*", async(ctx, next) => {
        let ua = ctx.header["user-agent"].toLowerCase()
        let match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || []
        
        if (match[1] == "msie" && parseInt(match[2]) < 9) {
            ctx.body = "not support browser"
        } else {
            await next()
        }
    })
    */
router.get("/404", async ctx => {
    ctx.body = await render("404")
})

//require("./service/index")(router, render)

require("./service/cloudmusic")(router, render)

require("./service/component")(router, render)

require("./service/word")(router, render)

require("./service/tools")(router, render)

require("./service/novels")(router, render)

require("./service/verify")(router, render)

require("./service/download")(router, render)

require("./admin/index")(router, render)

require("./userCenter/index")(router, render)

require("./service/chat")(router, render, io)

require("./service/wechat")(router, render)

require("./service/gu/stock")(router, render)



require("./ssr/home/server")(router)
require("./ssr/articleBox/server")(router)

router.get("/m", async ctx => {
    ctx.body = "mobile"
})

router.get("/poetry", async ctx => {
    ctx.body = await render("poetry")
})


router.get("/demo", async ctx => {

    ctx.body = await render("demo")
})

router.post("/demo", async ctx => {
    ctx.body = await "ok"
})


server.listen(config.port, () => {
    console.log(`running port: ${config.port}`)
})