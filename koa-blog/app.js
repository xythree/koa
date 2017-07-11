const koa = require("koa")
const router = require("koa-router")()
const serve = require("koa-static")
const views = require("co-views")
const bodyparser = require("koa-bodyparser")
const session = require("koa-session2")
const app = new koa()
const path = require("path")
const fs = require("fs")

const config = require("./config")
const mw_request = require("./middleware/request")

const render = views("./views", {
    ext: "ejs"
})


app.use(session({
    maxAge: 1000 * 60 * 60 * 24,
    key: "SESSIONID" //default "koa:sess" 
}))


app.use(mw_request())

app.use(bodyparser())

app.use(serve("./static"))

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

require("./admin/index")(router, render)

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


app.listen(config.port, () => {
    console.log(`running port: ${config.port}`)
})