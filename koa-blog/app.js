

const koa = require("koa")
const router = require("koa-router")()
const serve = require("koa-static")
const views = require("co-views")
const bodyparser = require("koa-bodyparser")
const app = new koa()
const config = require("./config")


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

app.use(mw_request)

app.use(bodyparser())

app.use(serve("./static"))

app.use(router.routes())



router.get("/", async ctx => {

    ctx.body = await render("index")

})



require("./service/index")(router)



app.listen(config.port, () => {
    console.log(`prot:${config.port} running...`)
})


