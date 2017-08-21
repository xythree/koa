const mon = require("../../service/sql")

const home_ssr = require("../../service/ssr")({
    serverBundle: "home-vue-ssr-server-bundle.json",
    clientManifest: "home-vue-ssr-client-manifest.json"
})

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
        let result = ""

        let list = await getList()

        result = await home_ssr({
            url: ctx.req.url,
            list,
            title: "恨水无伤",
            meta: `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/index.min.css" />
            `
        })

        ctx.body = await result
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/index.min.css" />
                    `
            })

            ctx.body = await result
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

        ctx.body = await result
    })

    router.get("/article/:id", async ctx => {
        let id = ctx.params.id
        let result = ""

        if (id) {

            await mon.article.update({
                _id: id
            }, {
                $inc: {
                    views: 1
                }
            })

            let article = {}

            article.article = await mon.article.findId(id) || []
            article.prev = await mon.article.prev(id) || []
            article.next = await mon.article.next(id) || []

            let title = article.article[0].title

            result = await home_ssr({
                disState: true,
                url: ctx.req.url,
                article,
                title: `${title}|恨水无伤`,
                meta: `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${title}">
    <link rel="stylesheet" href="/css/index.min.css" />
    <link rel="stylesheet" href="/css/github-markdown.min.css">
                `
            })

            ctx.body = await result
        } else {
            ctx.redirect("/404")
        }
    })

    router.post("/comment", async ctx => {
        let params = ctx.request.body
        let result = {}

        result.result = await mon.comment.create({
            aid: params.flag,
            cid: params.cid || "",
            username: params.username,
            email: params.email,
            content: params.content,
            flag: "flag" + Date.now() + Math.round(Math.random() * 9999),
            show: 1
        })

        ctx.body = await result
    })

    router.get("/comment", async ctx => {
        let params = ctx.request.query
        let result = {},
            obj = {}

        if (params.flag) {
            obj = { aid: params.flag }

            if (params.skip) {
                result.result = await mon.comment.find(obj, params.skip - 1, +params.limit)
            } else {
                result.result = await mon.comment.find(obj)
            }
            result.count = await mon.comment.count(obj)
        }

        ctx.body = await result
    })


}