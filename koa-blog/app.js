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

const mongoose = require("./service/mongoose")


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


app.use(mw_request())

app.use(bodyparser())

app.use(serve(path.join(__dirname, "static"), {
    maxAge: 1000 * 60 * 60 * 24
}))

app.use(router.routes())

app.use(async(ctx, next) => {

    if (ctx.response.status == 404) {
        ctx.redirect("/404")
    }
    next()
})

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

router.get("/404", async ctx => {
    ctx.body = await render("404")
})

require("./service/index")(router, render)

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

let axios = require("axios")
let LRU = require("lru-cache")
let md5 = require("md5")
let querystring = require("querystring")
let api, _config
if (process.__API__) {
    api = process.__API__
} else {
    api = process.__API__ = {
        api: "http://localhost:8080/api/",
        cached: LRU({
            max: 1000,
            maxAge: 1000 * 60
        }),
        cachedItem: {}
    }
}
_config = api

router.get("/api/lru", async ctx => {
    let params = ctx.request.query
    ctx.body = Math.random()
})

router.post("/lru", async ctx => {
    let data = ctx.request.body
    let url = "lru"
    let result = ""
    const key = md5(url + querystring.stringify(data))

    if (_config.cached && _config.cached.has(key)) {
        result = _config.cached.get(key)
    } else {
        result = await new Promise((resolve, reject) => {
            axios.get(_config.api + url).then(res => {
                if (_config.cached && data.cache) _config.cached.set(key, res.data)
                resolve(res.data)
            })
        })
    }
    ctx.body = await result

})


const Vue = require("vue")
const { createRenderer } = require("vue-server-renderer")

router.get("/ssr", async ctx => {
    let result = ""

    let renderer = await createRenderer({
        template: fs.readFileSync("./template/html/ssr.html", "utf-8")
    })

    result = await new Promise((resolve, reject) => {

        const app = new Vue({
            data: {
                b: 33,
                a: 1,
                title: 1,
                meta: ""
            },
            template: "<div id='ssr'>{{a}} <abc :b='b' /> </div>"
        })

        const context = {
            title: 'hello',
            meta: "",
            scripts: "<script src='/js/vue.js'></script><script src='/js/ssr.js'></script>"
        }

        renderer.renderToString(app, context, (err, html) => {
            resolve(html)
        })
    })

    ctx.body = await result
})


server.listen(config.port, () => {
    console.log(`running port: ${config.port}`)
})