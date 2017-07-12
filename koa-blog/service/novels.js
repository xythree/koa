const sql = require("./model")

module.exports = (router, render) => {


    router.get("/novels", async ctx => {
        let result = await sql.novels.find().limit(15).skip(0)

        ctx.body = await render("novels/index", { list: result })
    })

    router.get("/novels/:id", async ctx => {
        let params = ctx.request.query
        let id = ctx.params.id
        let obj = {
            pid: id
        }
        if (params.chapter) {
            obj.chapter = +params.chapter
        }

        let result = {}
        1
        result.data = await sql.novelContents.findOne(obj)

        if (result.data) {
            result.novels = await sql.novels.findOne({ _id: id })
            result.count = await sql.novelContents.find({ pid: id }).count()

            ctx.body = await render("novels/chapter", { content: result })
        } else {
            ctx.redirect("/404")
        }

    })

}