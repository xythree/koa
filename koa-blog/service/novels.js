const sql = require("./model")

module.exports = (router, render) => {


    router.get("/novels", async ctx => {
        let result = await sql.novels.find().limit(15).skip(0)

        ctx.body = await render("novels", { list: result, content: [] })
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

        let result = await sql.novelContents.findOne(obj)

        ctx.body = await render("novels", { list: [], content: result })
    })

}