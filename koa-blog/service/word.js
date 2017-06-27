const sql = require("./model")
const { isLogin } = require("./function")(sql)

module.exports = (router, render) => {

    router.get("/word", async ctx => {
        let pos = await sql.pos.find({}, { _id: 0 })

        ctx.body = await render("word", { pos })
    })

    router.post("/word", async ctx => {
        let params = ctx.request.body
        let reg = new Function("return /^" + params.value + "$/i")()
        let result = await sql.words.aggregate([{
                $match: {
                    word: {
                        $regex: reg
                    }
                }
            },
            {
                $lookup: {
                    from: "means",
                    localField: "id",
                    foreignField: "wordId",
                    as: "docs"
                }
            },
            {
                $project: {
                    _id: 0,
                    word: 1,
                    exchange: 1,
                    voice: 1,
                    docs: {
                        wordId: 1,
                        posId: 1,
                        means: 1
                    }
                }
            }
        ])

        if (result.length) {
            let r = result[0]

            r.voice = JSON.parse(r.voice)
            r.voice.ph_en = wordFormat(r.voice.ph_en)
            r.voice.ph_am = wordFormat(r.voice.ph_am)
            r.exchange = JSON.parse(r.exchange)

            if (r.docs.length) {
                r.docs.forEach((t, i) => {
                    t.means = wordFormat(t.means)
                })
            }
        }

        ctx.body = await result
    })

    function wordFormat(value) {
        return value && unescape(value.replace(/(\u)([\w+\d+,\d])/g, "%$1$2").replace(/\"/g, "")).replace(/\%\u/g, "u")
    }

    router.get("/recite_list", async ctx => {
        let is_Login = await isLogin(ctx)
        let params = ctx.request.query
        let result = {}
        let limit = +(params.limit || 10)
        let skip = params.skip * limit

        if (is_Login.length) {
            result.code = 1
            result.result = await sql.words.find({}).limit(limit).skip(skip)

            await sql.recite.update({
                uid: is_Login[0]._id
            }, {
                $set: {
                    uid: is_Login[0]._id,
                    username: is_Login[0].username,
                    limit: +params.limit,
                    skip: +params.skip
                }
            }, {
                upsert: true
            })
        } else {
            result.code = 0
            result.msg = "未登录"
        }

        ctx.body = await result
    })

    router.get("/recite/info", async ctx => {
        let is_Login = await isLogin(ctx)
        let result = {}

        if (is_Login.length) {
            result.code = 1
            result.result = await sql.recite.findOne({
                uid: is_Login[0]._id
            })

            if (!result.result) {
                result.result = {
                    limit: 0,
                    skip: 0
                }
            }
        } else {
            result.code = 0
            result.msg = "未登录"
        }

        ctx.body = await result
    })

    router.post("/recite/infoSave", async ctx => {
        let is_Login = await isLogin(ctx)
        let params = ctx.request.body
        let result = {}

        if (is_Login.length) {
            result.code = 1
            result.result = await sql.recite.update({
                uid: is_Login[0]._id
            }, {
                $set: {
                    uid: is_Login[0]._id,
                    username: is_Login[0].username,
                    limit: +params.limit,
                    skip: +params.skip
                }
            }, {
                upsert: true
            })
        } else {
            result.code = 0
            result.msg = "未登录"
        }

        ctx.body = await result
    })

}