const sql = require("./../service/model")
const md5 = require("md5")
const validator = require("validator")
const fs = require("fs")
const path = require("path")
const { uploadFile } = require("./../service/upload")
const { isLogin } = require("./../service/function")(sql)

module.exports = (router, render) => {

    router.use("/admin/*", async(ctx, next) => {
        let is_login = await isLogin(ctx)
        let _path = ctx.path
        if (!is_login.length && _path != "/admin/login_register" && _path != "/login" && _path != "/register") {
            ctx.redirect("/admin/login_register")
            return
        }
        ctx.session.usernameInfo = is_login[0]
        await next()
    })


    router.get("/admin/", async ctx => {
        ctx.redirect("/admin/index")
    })


    router.get("/admin/index", async ctx => {
        if (ctx.session.usernameInfo && ctx.session.usernameInfo.level != 9) {
            ctx.redirect("/")
            return
        }
        ctx.body = await render("/admin/index")
    })

    router.get("/admin/login_register", async ctx => {
        let is_login = await isLogin(ctx)

        if (is_login.length) {
            ctx.redirect("/admin/index")
            return
        }

        ctx.body = await render("/admin/login_register")
    })

    /*
    router.get("/admin/login", async ctx => {
        let is_login = await isLogin(ctx)

        if (is_login.length) {
            ctx.redirect("/admin/index")
            return
        }

        ctx.body = await render("/admin/login")
    })
    */


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


    /*
    router.get("/admin/register", async ctx => {
        let is_login = await isLogin(ctx)

        if (is_login.length) {
            ctx.redirect("/admin/index")
            return
        }

        ctx.body = await render("/admin/register")
    })
    */


    router.post("/register", async ctx => {
        let params = ctx.request.body
        let result = {}

        if (params.username && params.password) {

            result.result = await sql.Users.findOne({ username: params.username })

            if (result.result && result.result.length) {
                result.code = 2
                result.msg = "用户名已经存在"
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

                result.code = 1
                result.msg = "ok"

            }
        } else {
            result.code = 0
            result.msg = "用户名或密码不能为空"
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

    router.get("/isLogin", async ctx => {
        let is_login = await isLogin(ctx)

        ctx.body = await is_login
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
                let originalPath = "/static/images/upload"
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
                last_modify_time: time,
                flag: "flag" + time + Math.round(Math.random() * 9999)
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