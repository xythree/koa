const sql = require("./sql")

module.exports = (router, render) => {

    router.get("/", async ctx => {
        ctx.body = await render("index")
    })

    router.get("/article", async ctx => {
        let params = ctx.request.query
        let result = {},
            limit = params.limit || 15,
            skip = params.skip || 0,
            obj = {}

        if (params.id) {

            await sql.article.update({ _id: params.id }, {
                $inc: {
                    views: 1
                }
            })

            result.data = await sql.article.findArticleComment(params.id)
            result.prev = await sql.article.prev(params.id)
            result.next = await sql.article.next(params.id)

        } else if (params.txt) {

            result.data = await sql.article.findTitle(params.txt, +skip, +limit)

        } else if (params.skip != undefined) {

            result.data = await sql.article.findTitle("", +skip, +limit)

        }

        ctx.body = await result
    })

    router.post("/comment", async ctx => {
        let params = ctx.request.body
        let result = {}

        result.result = await sql.comment.create({
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
                result.result = await sql.comment.find(obj, params.skip - 1, +params.limit)
            } else {
                result.result = await sql.comment.find(obj)
            }
            result.count = await sql.comment.count(obj)
        }

        ctx.body = await result
    })


}