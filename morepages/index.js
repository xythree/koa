


var config = require("./config")
var koa = require('koa')
var logger = require("koa-logger")
var router = require("koa-router")()
var serve = require("koa-static")
var path = require("path")
var views = require("co-views")
var parse = require("co-body")
var cors = require("koa-cors")
var http = require("http")
var https = require("https")
var md5 = require("md5")
var app = new koa()



app.use(cors())
app.use(logger())






app.use(serve(__dirname + "/static"))

var render = views(path.join(__dirname+"/views"), {
    ext: "ejs"
})


app.use(router.routes())



require(__dirname + "/routers/router")(app, router, render, parse)




app.listen(config.port)





module.exports = app



































