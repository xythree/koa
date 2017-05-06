

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

app.use(mw_request)

app.use(bodyparser())

app.use(serve("./static"))

app.use(router.routes())

const render = views("./views", {
    ext: "ejs"
})




router.get("/", async (ctx, next) => {

    ctx.body = await render("index")
    
})

//搜索
router.post("/music/search", async (ctx) => {

    const params = ctx.request.body
    
    await ctx.post({
        path: "/api/search/get/web",
        s: params.s,
        hlpretag: "",
        hlposttag: "",
        type: params.type || 1,
        offset: params.offset || 0,
        total: true,
        limit: params.limit || 15
    }).then(result => {
        ctx.body = result
    })
})

//获取歌曲信息
router.get("/music/detail", async (ctx) => {
    const params = ctx.request.query
    
    await ctx.get({
        path: "/api/song/detail/",        
        id: params.id,
        ids: `[${params.id}]`
    }).then(result => {
        ctx.body = result
    })

})

//获取歌词
router.get("/music/lyric", async (ctx, next) => {
	const params = ctx.request.query

	await ctx.get({
		path: "/api/song/lyric",
		id: params.id,
		lv: -1,
		kv: -1,
		tv: -1
	}).then(result => {
		ctx.body = result
	})

})





app.listen(config.port, () => {
    console.log(`prot:${config.port} running...`)
})


