module.exports = (router, render) => {


    router.get("/component/", async ctx => {
        let category = ctx.params.category
        let result = ""

        ctx.body = await render("component")
    })

}