module.exports = (router, render) => {


    router.get("/userCenter", async ctx => {

        ctx.body = await render("userCenter/index")

    })


}