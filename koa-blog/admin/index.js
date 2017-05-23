const sql = require("./../service/model")
const md5 = require("md5")

module.exports = (router, render) => {

    /*
    const isLogin = async(ctx, next) => {
        const username = ctx.cookies.get("username")

        if (!username && ctx.params.category != "login") {
            ctx.redirect("/admin/login")            
        }

        await next()
    }

    router.get("/admin/:category", isLogin)
    
    */


    const isLogin = ctx => {
        const username = ctx.cookies.get("username")
        const category = ctx.params.category

        if (!username && (category != "login" || category != "register")) {
            return false
        }
        return true
    }


    router.get("/admin/index", async ctx => {
        if (!isLogin(ctx)) {
            ctx.redirect("/admin/login")
        }

        ctx.body = await render("/admin/index")
    })


    router.get("/admin/login", async ctx => {
        if (ctx.cookies.get("username")) {
            ctx.redirect("/admin/index")
        }

        ctx.body = await render("/admin/login")
    })


    router.get("/login", async ctx => {
        let params = ctx.request.query
        let result = {}

        if (params.username && params.password) {
            result = await sql.Users.find({
                username: params.username,
                password: md5(params.password)
            })

            if (result.length) {
                ctx.cookies.set("username", params.username)
                result = await "ok"
            } else {
                result = await "用户名或密码不正确"
            }
        } else {
            result = await "用户名或密码不能为空"
        }
        ctx.body = await result
    })


    router.get("/admin/register", async ctx => {

        if (ctx.cookies.get("username")) {
            ctx.redirect("/admin/index")
        }

        ctx.body = await render("/admin/register")

    })


    router.post("/register", async ctx => {
        let params = ctx.request.body
        let result = ""

        if (params.username && params.password) {
            result = await sql.Users.find({ username: params.username })

            if (result.length) {
                result = await "用户名已经存在"
            } else {
                await sql.Users.create({
                    username: params.username,
                    password: md5(params.password)
                })
                ctx.cookies.set("username", params.username)
                result = await "ok"
            }
        } else {
            result = await "用户名或密码不能为空"
        }

        ctx.body = await result
    })


    router.get("/logout", async ctx => {
        ctx.cookies.set("username", "")
        ctx.body = await "logout success"
    })


    router.post("/article/add-edit-article", async ctx => {
        let params = ctx.request.body
        let result = {}

        if (!params.id) {
            result = await sql.Article.create({
                author: ctx.cookies.get("username"),
                title: params.title,
                content: params.content,
                date: Date.now(),
                lastDate: Date.now()
            })
        } else {
            result = await sql.Article.update({
                _id: params.id
            }, {
                $set: {
                    title: params.title,
                    content: params.content,
                    lastDate: Date.now()
                }
            })
        }

        ctx.body = await result
    })


    router.get("/article/remove-article", async ctx => {
        let params = ctx.request.query
        let result = {}

        if (params.id) {
            result = await sql.Article.remove({ _id: params.id })
            ctx.body = await result
        } else {
            ctx.body = await "id不存在"
        }
    })


    router.get("/article/article-info", async ctx => {
        let params = ctx.request.query
        let result = {}

        if (params.id) {
            result = await sql.Article.find({ _id: params.id })
            ctx.body = await result[0]
        } else {
            ctx.body = await "id不存在"
        }
    })


    router.get("/article/article-list", async ctx => {
        let username = ctx.cookies.get("username")
        let params = ctx.request.query
        let result = {}
        let limit = +params.limit || 15
        let skip = params.skip

        skip = skip < 0 ? 0 : skip

        result.count = await sql.Article.find({ author: username }).count()
        result.result = await sql.Article.find({ author: username }).limit(+limit).skip(skip * limit)

        ctx.body = await result
    })




}