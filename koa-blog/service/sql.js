const sql = require("./../service/model")
const md5 = require("md5")
const validator = require("validator")

function _unescape(data) {

    if (data.length) {
        data.forEach(t => {
            if (t.title) {
                t.title = validator.unescape(t.title)
            }
            if (t.content) {
                t.content = validator.unescape(t.content)
            }
        })
    } else if (data && data.title) {
        data.title = validator.unescape(data.title)
        if (data.content) {
            data.content = validator.unescape(data.content)
        }
    }

    return data
}

module.exports = {
    article: {
        async update(obj1, obj2 = {}) {
            let result = ""

            result = await sql.Article.update(obj1, obj2)

            return result
        },
        async find(obj, skip = 0, limit = 15) {
            let data = ""

            data = await sql.Article.find(obj).limit(limit).skip(skip * limit)

            return _unescape(data)
        },
        async findOne(obj) {
            let data = ""

            data = await sql.Article.findOne(obj)

            return _unescape(data)
        },
        async findId(id) {
            let data = ""

            data = await sql.Article.aggregate().project({
                title: 1,
                content: 1,
                create_time: 1,
                views: 1
            }).match({ _id: global.MgTypes.ObjectId(id) })

            return _unescape(data)
        },
        async findArticleComment(id) {
            let data = ""

            data = await sql.Article.aggregate().match({ _id: global.MgTypes.ObjectId(id) }).lookup({
                from: "comments",
                localField: "flag",
                foreignField: "aid",
                as: "comments"
            }).project({
                author: 1,
                title: 1,
                content: 1,
                create_time: 1,
                views: 1,
                flag: 1,
                comments: {
                    aid: 1,
                    cid: 1,
                    title: 1,
                    create_time: 1,
                    username: 1,
                    content: 1,
                    flag: 1,
                    show: 1
                }
            })

            return _unescape(data)
        },
        async findTitle(title, condition = { title: 1, content: 1 }, skip = 0, limit = 15) {
            let data = ""
            let obj = title ? {
                title: {
                    $regex: title,
                    $options: "i"
                }
            } : {}

            data = await sql.Article.aggregate().sort({ _id: -1 }).skip(skip * limit).limit(+limit).match(obj).project(condition)

            return _unescape(data)
        },
        async count(obj) {
            return await sql.Article.find(obj).count()
        },
        async prev(id) {
            let data = ""

            data = await sql.Article.aggregate().match({
                _id: {
                    $lt: global.MgTypes.ObjectId(id)
                }
            }).sort({ _id: -1 }).limit(1).project({
                title: 1
            })

            return _unescape(data)
        },
        async next(id) {
            let data = ""

            data = await sql.Article.find({ _id: { $gt: id } }).sort({ _id: 1 }).limit(1)

            return _unescape(data)
        }
    },
    comment: {
        async create(obj) {
            let data = ""

            obj.username = validator.escape(obj.username)
            obj.email = validator.escape(obj.email)
            obj.content = validator.escape(obj.content)
            obj.create_time = obj.create_time || Date.now()

            data = await sql.Comment.create(obj)

            return _unescape(data)
        },
        async find(obj, skip, limit) {
            let data = ""

            if (skip != void 0) {
                data = await sql.Comment.find(obj).limit(limit).skip(skip * limit)
            } else {
                data = await sql.Comment.find(obj)
            }

            return _unescape(data)
        },
        async count(obj) {
            return await sql.Comment.find(obj).count()
        }
    }
}