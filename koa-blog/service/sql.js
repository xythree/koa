const sql = require("./../service/model")
const md5 = require("md5")
const validator = require("validator")

module.exports = {
    article: {
        async update(obj1, obj2) {
            let result = ""

            result = await sql.Article.update(obj1, {
                $set: obj2
            })

            return result
        },
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
        },
        async prev(id) {
            return await sql.Article.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(1)
        },
        async next(id) {
            return await sql.Article.find({ _id: { $gt: id } }).sort({ _id: 1 }).limit(1)
        }
    },
    comment: {
        async create(obj) {
            let result = ""

            obj.username = validator.escape(obj.username)
            obj.email = validator.escape(obj.email)
            obj.content = validator.escape(obj.content)
            obj.create_time = obj.create_time || Date.now()

            result = await sql.Comment.create(obj)

            return result
        },
        async find(obj, skip, limit) {
            let result = ""

            if (skip != undefined) {
                result = await sql.Comment.find(obj).limit(limit).skip(skip * limit)
            } else {
                result = await sql.Comment.find(obj)
            }

            return result
        },
        async count(obj) {
            return await sql.Comment.find(obj).count()
        }
    }
}