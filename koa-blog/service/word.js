const sql = require("./model")


module.exports = (router, render) => {

    router.get("/word", async ctx => {

        let pos = await sql.pos.find({}, { _id: 0 })

        ctx.body = await render("word", { pos })
    })

    router.post("/word", async ctx => {
        let params = ctx.request.body

        let result = await sql.words.aggregate([{
            $match: {
                word: params.value
            }
        }, {
            $lookup: {
                from: "means",
                localField: "id",
                foreignField: "wordId",
                as: "docs"
            }
        }, {
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
        }])

        ctx.body = await result
    })

}