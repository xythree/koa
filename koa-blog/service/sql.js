const sql = require("./../service/model")
const md5 = require("md5")
const validator = require("validator")

module.exports = {
    article: {
        async find(obj, skip, limit) {
            let result = ""

            if (skip != undefined) {
                result = await sql.Article.find(obj).limit(limit).skip(skip * limit)
            } else {
                result = await sql.Article.find(obj)
            }

            if (result.length) {
                result.forEach(t => {
                    t.title = validator.unescape(t.title)
                    t.content = validator.unescape(t.content)
                })
            }
            return result
        },
        async count(obj) {
            return await sql.Article.find(obj).count()
        }
    }
}