const sql = require("./sql")

module.exports = (router, render) => {

    router.get("/", async ctx => {
        ctx.body = await render("index")
    })

    router.get("/article", async ctx => {
        let params = ctx.request.query
        let result = {},
            obj = {}

        if (params.id) {
            obj = { _id: params.id }
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


}