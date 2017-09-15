const mon = require("../../service/sql")

const home_ssr = require("../../service/ssr")({
    serverBundle: "home-vue-ssr-server-bundle.json",
    clientManifest: "home-vue-ssr-client-manifest.json"
})
const minify = require('html-minifier').minify

module.exports = router => {

    async function getList(skip = 0, limit = 15) {
        let list = {}

        list.articleList = await mon.article.findTitle("", {
            title: 1,
            text: 1
        }, skip, limit)

        list.count = await mon.article.count({})

        let nums = 360

        list.articleList.forEach(t => {
            if (t.text && t.text.length > nums) {
                t.text = t.text.substr(0, nums) + "..."
            }
        })

        return list
    }

    router.get("/", async ctx => {
        console.time("首页打开速度")
        let result = ""
        let list = await getList()

        result = await home_ssr({
            url: ctx.req.url,
            list,
            //manifest: "manifest=/manifest/home.manifest",
            title: "恨水无伤",
            meta: `
    <meta name="description" content="恨水无伤的小站,前端学习笔记分享！" />
    <link rel="stylesheet" href="/css/index.min.css" />    
            `
        })

        ctx.body = minify(result, {
            removeComments: true, //去除注释
            minifyJS: true,
            minifyCSS: true,
            collapseWhitespace: true
        })

        console.timeEnd("首页打开速度")
    })

    router.get("/page/:id", async ctx => {
        let id = +ctx.params.id
        let result = ""

        if (/^\d$/.test(id) && id > 0) {
            id = id < 1 ? 1 : id

            let list = await getList(--id)

            list.index = id + 1
            list.url = "/page/"

            result = await home_ssr({
                url: ctx.req.url,
                list,
                title: "恨水无伤",
                meta: `
    <link rel="stylesheet" href="/css/index.min.css" />
    <meta name="description" content="恨水无伤的小站,前端学习笔记分享！" />
                    `
            })

            ctx.body = minify(result, {
                removeComments: true, //去除注释
                minifyJS: true,
                minifyCSS: true,
                collapseWhitespace: true
            })
        } else {
            ctx.redirect("/404")
        }
    })

    router.get("/article", async ctx => {
        let params = ctx.request.query
        let result = ""

        if (params.type == "list") {
            result = await getList(params.skip)
        }

        ctx.body = result
    })



}