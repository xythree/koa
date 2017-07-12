module.exports = (router, render) => {


    router.get("/md", async ctx => {


        ctx.body = await render("makedown/index")

    })

}