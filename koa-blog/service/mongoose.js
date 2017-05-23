const mongoose = require("mongoose")


//防止报错:(node:7664) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise


const db = mongoose.createConnection("localhost", "koa_blog")

//const db = mongoose.connect("mongoodb://localhost/test")


module.exports = {
    mongoose,
    Schema: mongoose.Schema,
    model: mongoose.model,
    db
}