const koa = require("koa")
const router = require("koa-router")()
const serve = require("koa-static")
const views = require("co-views")
const bodyparser = require("koa-bodyparser")
const session = require("koa-session2")
const app = new koa()
const config = require("./config")
const fs = require("fs")
const path = require("path")


const mw_request = require("./middleware/request")({
    hostname: "music.163.com",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": "appver=1.5.0.75771",
        "Referer": "http://music.163.com"
    }
})

const render = views("./views", {
    ext: "ejs"
})

app.use(session())

app.use(mw_request)

app.use(bodyparser())

app.use(serve("./static"))

app.use(router.routes())



router.get("/", async ctx => {

    ctx.body = await render("index")

})

router.get("/music", async ctx => {
    ctx.body = await render("/mobile/music/index")
})

require("./service/index")(router)

require("./admin/index")(router, render)


router.get("/m", async ctx => {
    ctx.body = "mobile"
})



//诗词
router.get("/poetry", async ctx => {
    ctx.body = await render("poetry")
})



app.listen(config.port, () => {
    console.log(`running port: ${config.port}`)
})