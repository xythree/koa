const koa = require("koa")
const router = require("koa-router")()
const serve = require("koa-static")
const views = require("co-views")
const bodyparser = require("koa-bodyparser")
const session = require("koa-session2")
const app = new koa()
const fs = require("fs")
const path = require("path")


const sql = require("./service/sql")
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

router.get("/article", async ctx => {
    let params = ctx.request.query
    let result = {},
        obj = {}

    if (params.id) {
        obj = { _id: params.id }
        result.count = await sql.article.count(obj)
        result.result = await sql.article.find(obj)
        result.prev = await sql.article.prev(params.id)
        result.next = await sql.article.next(params.id)
        sql.article.update(obj, { views: result.result[0].views + 1 })
    } else if (params.txt) {
        obj = { title: { $regex: params.txt, $options: "i" } }
        result.result = await sql.article.find(obj, params.skip - 1, +params.limit)
        result.count = await sql.article.count(obj)
    } else if (params.skip) {
        result.count = await sql.article.count(obj)
        result.result = await sql.article.find(obj, params.skip - 1, +params.limit)
    } else {
        result.count = await sql.article.count({})
    }
    ctx.body = await result
})

router.post("/comment", async ctx => {
    let params = ctx.request.body
    let result = {}

    result.result = await sql.comment.create({
        aid: params.id,
        cid: params.cid || "",
        username: params.username,
        email: params.email,
        content: params.content
    })

    ctx.body = await result
})

router.get("/comment", async ctx => {
    let params = ctx.request.query
    let result = {},
        obj = {}


    if (params.aid) {
        obj = { aid: params.aid }

        if (params.skip) {
            result.result = await sql.comment.find(obj, params.skip - 1, +params.limit)
        } else {
            result.result = await sql.comment.find(obj)
        }
        result.count = await sql.comment.count(obj)
    }


    ctx.body = await result
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