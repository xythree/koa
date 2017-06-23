const sql = require("./sql")
const mon = require("./model")

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
                /*
                sql.article.update(obj, {
                    $inc: {
                        "views": 1
                    }
                })
                */
                //result.result = await sql.article.find(obj)

            /*
            await mon.Article.update(obj, {
                $inc: {
                    views: 1
                }
            })
            */

            result = await mon.Article.aggregate([{
                $match: {
                    _id: params.id
                }
            }, {
                $project: {
                    author: 1,
                    title: 1,
                    content: 1,
                    create_time: 1,
                    views: 1
                }
            }, {
                $group: {
                    _id: "$_id",
                    count: {
                        $sum: 1
                    }
                }
            }])

            //result.prev = await sql.article.prev(params.id)
            //result.next = await sql.article.next(params.id)

        } else if (params.txt) {
            obj = { title: { $regex: params.txt, $options: "i" } }
            result.result = await sql.article.find(obj, params.skip - 1, +params.limit)
            result.count = await sql.article.count(obj)
        } else if (params.skip) {
            //result.count = await sql.article.count(obj)
            //result.result = await sql.article.find(obj, params.skip - 1, +params.limit)

            result = await mon.Article.aggregate([{
                $match: obj
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    create_time: 1,
                    views: 1
                }
            }, {
                $group: {
                    _id: null,
                    result: {
                        $addToSet: {
                            _id: "$_id",
                            title: "$title",
                            content: "$content",
                            create_time: "$create_time"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            }])
            result = result.length ? result[0] : {}
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