const koa = require("koa")
const router = require("koa-router")()
const serve = require("koa-static")
const views = require("co-views")
const bodyparser = require("koa-bodyparser")
const session = require("koa-session2")
const app = new koa()
const fs = require("fs")
const path = require("path")

const config = require("./config")
const mw_request = require("./middleware/request")

const render = views("./views", {
    ext: "ejs"
})

app.use(session({
    key: "SESSIONID" //default "koa:sess" 
}))

app.use(mw_request())

app.use(bodyparser())

app.use(serve("./static"))

app.use(router.routes())




router.get("/", async ctx => {

    ctx.body = await render("index")

})

router.get("/music", async ctx => {
    //ctx.body = await render("/mobile/music/index")
    ctx.body = await render("/music/index")
})

require("./service/music")(router)

require("./service/component")(router, render)

require("./service/tools")(router)

require("./admin/index")(router, render)



router.get("/m", async ctx => {
    ctx.body = "mobile"
})


router.get("/tools", async ctx => {
    ctx.body = await render("tools")
})


//诗词
router.get("/poetry", async ctx => {
    ctx.body = await render("poetry")
})


router.post("/upload", async ctx => {
    ctx.body = "ok"
})


app.listen(config.port, () => {
    console.log(`running port: ${config.port}`)
})