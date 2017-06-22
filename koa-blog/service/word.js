const sql = require("./model")


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
        return value && unescape(value.replace(/\u/g, "%u").replace(/\"/g, ""))
    }

}