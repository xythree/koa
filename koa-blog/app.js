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



server.listen(config.port, () => {
    console.log(`running port: ${config.port}`)
})