const sql = require("./sql")
const mon = require("./model")
const validator = require("validator")

module.exports = (router, render) => {

    router.get("/", async ctx => {
        ctx.body = await render("index")
    })

    router.get("/article", async ctx => {
        let params = ctx.request.query
        let result = {},
            obj = {}

        if (params.id) {
            //obj = { _id: params.id }
            obj = { aid: global.MgTypes.ObjectId(params.id) }

            await mon.Article.update({ _id: params.id }, {
                $inc: {
                    views: 1
                }
            })

            let _result = await mon.Comment.aggregate().match(obj).lookup({
                from: "articles",
                localField: "flag",
                foreignField: "flag",
                as: "article"
            }).project({
                aid: 1,
                cid: 1,
                title: 1,
                username: 1,
                content: 1,
                flag: 1,
                show: 1,
                article: {
                    author: 1,
                    title: 1,
                    content: 1,
                    create_time: 1,
                    views: 1,
                    flag: 1
                }
            })

            if (!_result.length) {
                _result = await mon.Article.aggregate().match({
                    _id: global.MgTypes.ObjectId(params.id)
                }).project({
                    author: 1,
                    title: 1,
                    content: 1,
                    create_time: 1,
                    views: 1,
                    flag: 1,
                    show: 1
                })
            }

            if (_result.length) {
                _result.forEach(t => {
                    t.title = validator.unescape(t.title)
                    t.content = validator.unescape(t.content)
                })
            }

            //result.comment_list = _result[0].comment_list
            //result.result = _result[0].result
            result.result = _result
                //result.result.push(_result[0])
            result.prev = await sql.article.prev(params.id)
            result.next = await sql.article.next(params.id)

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
            if (result && result[0].result.length) {
                result[0].result.forEach(t => {
                    t.title = validator.unescape(t.title)
                    t.content = validator.unescape(t.content)
                })
            }
            result = (result && result.length) ? result[0] : {}
        } else {
            result.count = await sql.article.count({})
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