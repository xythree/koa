const mon = require("../../service/sql")

const home_ssr = require("../../service/ssr")({
    serverBundle: "home-vue-ssr-server-bundle.json",
    clientManifest: "home-vue-ssr-client-manifest.json"
})

module.exports = router => {

    router.get("/", async ctx => {
        let result = ""

        let list = await mon.article.findTitle("")

        result = await home_ssr({
            url: ctx.req.url,
            list,
            title: "恨水无伤",
            meta: `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/index.min.css" />
            `
        })

        ctx.body = await result
    })

    router.get("/article/:id", async ctx => {
        let id = ctx.params.id
        let result = ""

        if (id) {
            let article = await mon.article.findId(id)

            result = await home_ssr({
                url: ctx.req.url,
                article,
                title: `恨水无伤|${article.title}`,
                meta: `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/index.min.css" />
                `
            })

            ctx.body = await result
        } else {
            ctx.redirect("/404")
        }
    })

}