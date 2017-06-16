module.exports = (router, render) => {

    router.get("/tools", async ctx => {
        ctx.body = await render("tools")
    })

}