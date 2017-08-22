const mon = require("../../service/sql")

const home_ssr = require("../../service/ssr")({
    serverBundle: "articleBox-vue-ssr-server-bundle.json",
    clientManifest: "articleBox-vue-ssr-client-manifest.json"
})

module.exports = router => {


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