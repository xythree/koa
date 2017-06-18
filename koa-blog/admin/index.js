const sql = require("./../service/model")
const md5 = require("md5")
const validator = require("validator")
const { uploadFile } = require("./../service/upload")



module.exports = (router, render) => {


    const isLogin = async ctx => {
        const username = ctx.cookies.get("username")
        let result = ""

        if (username) {
            result = await sql.Users.find({ username: username })
            if (result.length) return true
        }
        return false
    }

    router.use("/admin/*", async(ctx, next) => {
        let is_login = await isLogin(ctx)
        let _path = ctx.path
        if (!is_login && _path != "/admin/login" && _path != "/admin/register" && _path != "/login" && _path != "/register") {
            ctx.redirect("/admin/login")
        }
        await next()
    })


    router.get("/admin/", async ctx => {
        ctx.redirect("/admin/index")
    })


    router.get("/admin/index", async ctx => {
        ctx.body = await render("/admin/index")
    })


    router.get("/admin/login", async ctx => {
        let is_login = await isLogin(ctx)

        if (ctx.request.query.haha == "911") {
            if (is_login) {
                ctx.redirect("/admin/index")
            }

            ctx.body = await render("/admin/login")
        } else {
            ctx.redirect("/404")
        }
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
                ctx.cookies.set("username", params.username, {
                    //expires: new Date(Date.now() + 60 * 60 * 1000)
                    maxAge: 60 * 60 * 1000
                })

                result = "ok"
            } else {
                result = "用户名或密码不正确"
            }
        } else {
            result = "用户名或密码不能为空"
        }

        ctx.body = await result
    })


    router.get("/admin/register", async ctx => {
        let is_login = await isLogin(ctx)

        if (ctx.request.query.haha == "911") {
            if (is_login) {
                ctx.redirect("/admin/index")
            }

            ctx.body = await render("/admin/register")
        } else {
            ctx.redirect("/404")
        }
    })


    router.post("/register", async ctx => {
        let params = ctx.request.body
        let result = ""

        if (params.username && params.password) {

            result = await sql.Users.find({ username: params.username })

            if (result.length) {
                result = "用户名已经存在"
            } else {

                await sql.Users.create({
                    username: params.username,
                    password: md5(params.password),
                    create_time: Date.now()
                })

                ctx.cookies.set("username", params.username, {
                    //expires: new Date(Date.now() + 60 * 60 * 1000)
                    maxAge: 60 * 60 * 1000
                })

                result = "ok"
            }
        } else {
            result = "用户名或密码不能为空"
        }

        ctx.body = await result
    })


    router.get("/logout", async ctx => {
        ctx.cookies.set("username", "", {
            //expires: new Date(Date.now() - 1)
            maxAge: -1
        })
        ctx.body = await "logout success"
    })

    router.get("/admin/add-editor", async ctx => {
        ctx.body = await render("/admin/add-editor")
    })

    router.all("/ueditor/controller", async ctx => {
        let params = ctx.request.query
        let config = await fs.readFileSync("./ueditor/config.json")
        let result = ""

        switch (params.action) {
            case "config":
                result = JSON.parse(config.toString().replace(/\/\*[\s\S]+?\*\//g, ""))
                break
            case "uploadimage":
                result = { state: false }
                let originalPath = "/static/images/upload-files"
                let serverFilePath = path.join(__dirname, originalPath)

                // 上传文件事件
                result = await uploadFile(ctx, {
                    fileType: "common", // common or album
                    path: serverFilePath,
                    originalPath: originalPath
                })

                break
        }

        ctx.body = result
    })


    router.post("/article/add-edit-article", async ctx => {
        let params = ctx.request.body
        let result = {},
            time = Date.now()

        params.title = validator.escape(params.title)
        params.content = validator.escape(params.content)

        if (!params.id) {
            result = await sql.Article.create({
                author: ctx.cookies.get("username"),
                title: params.title,
                content: params.content,
                create_time: time,
                last_modify_time: time
            })
        } else {
            result = await sql.Article.update({
                _id: params.id
            }, {
                $set: {
                    title: params.title,
                    content: params.content,
                    last_modify_time: time
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
        } else {
            result = "id不存在"
        }

        ctx.body = await result
    })


    router.get("/article/article-info", async ctx => {
        let params = ctx.request.query
        let result = {}

        if (params.id) {
            result = await sql.Article.find({ _id: params.id })
            if (result.length) {
                result.forEach(t => {
                    t.title = validator.unescape(t.title)
                    t.content = validator.unescape(t.content)
                })
            }
            result = result[0]
        } else {
            result = "id不存在"
        }
        ctx.body = await result
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
        if (result.result.length) {
            result.result.forEach(t => {
                t.title = validator.unescape(t.title)
                t.content = validator.unescape(t.content)
            })
        }

        ctx.body = await result
    })




}