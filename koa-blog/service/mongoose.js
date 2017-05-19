const mongoose = require("mongoose")

const db = mongoose.createConnection("localhost", "koa_blog")

//const db = mongoose.connect("mongoodb://localhost/test")


module.exports = {
    mongoose,
    Schema: mongoose.Schema,
    model: mongoose.model,
    db
}