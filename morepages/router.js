




module.exports = function (app, router, render, parse) {

    var sql = require(__dirname + "/sql")
    var fn = require(__dirname + "/function")()
    var validator = require(__dirname + "/controllers/validator")
    var md5 = require("md5")

    router.all("/api/comment",async function () {
        var status = false
        if (fn.loginTime.call(this)) {
            status = true
        }
        this.body = status
    })

    router.all("/api/logout",async function () {
        
        this.cookies.set("username", "", {
            expires: new Date(Date.now() - 1)
        })
       
        this.body = {status: 1}
    })

    router.get("/login",async function () {
        var list = {}
        var username = this.cookies.get("username")        
        if (username) {
            list.isLogin = true
        } else {
            list.isLogin = false
        }

        this.body = await render("login", {list: list})
    })

    router.post("/api/login",async function () {
        var params = await parse(this)
        var result = {
            status: 0,
            msg: ""
        }        
        var username = validator.empty(params.name)
        var password = validator.empty(params.password)

        if (username.status) {
            if (password.status) {
                var d = {
                    name: params.name,
                    password: md5(params.password)
                }
                await fn.userFind(d).then(function (data) {
                    
                    if (data.status === 1) {
                        result.status = 1

                        this.cookies.set("username", data.doc.name, {
                            expires: new Date(Date.now() + 1000*60*60*24),
                            httpOnly: false
                        })
                        this.cookies.set("loginTime", Date.now())
                    }
                }.bind(this)).catch(function (e) {
                    console.log("api/login find", e)
                })

            } else {
                result.msg = password.msg
            }

        } else {
            result.msg = username.msg
        }

        this.body = await result
    })    

    router.get("/register",async function () {
        if (this.cookies.get("username")) {
            this.redirect("/login")
        }        
        this.body = await render("register")
    })

    router.post("/api/register", async function () {
        var params = await parse(this)
        var result = {
            status: 0
        }        
        var findStatus = false, d
        var username = validator.username(params.name)
        var password = validator.password(params.password)

        if (username.status) {

            if (password.status) {
                await fn.userFind({name: params.name}).then(function (data) {            
                    if (data.status === 1) {
                        result.msg = "用户名已存在！"                
                    } else {
                        findStatus = true
                        d = {
                            name: params.name,
                            password: md5(params.password),
                            birth: Date.now()
                        }                
                    }
                }).catch(function (e) {
                    console.log("api/register find", e)
                })
                await (findStatus && fn.userCreate(d).then(function (data) {
                    if (data.status === 1) {
                        result.status = 1
                        result.msg = "创建成功"
                        this.cookies.set("username", data.doc.name, {
                            expires: new Date(Date.now() + 1000*60*60*24),
                            httpOnly: false
                        })                    
                        this.cookies.set("loginTime", Date.now())                        
                    }                                        
                }.bind(this)).catch(function (e) {
                    console.log("api/register create", e)
                }))
            } else {
                result.msg = password.msg
            }
        } else {
            result.msg = username.msg
        }
        
        this.body = await result

    })
}













