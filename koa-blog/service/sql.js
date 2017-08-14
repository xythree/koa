const sql = require("./../service/model")
const md5 = require("md5")
const validator = require("validator")

function _unescape(data) {

    if (data.length) {
        data.forEach(t => {
            t.title = validator.unescape(t.title)
            t.content = validator.unescape(t.content)
        })
    } else if (data && data.title) {
        data.title = validator.unescape(data.title)
        data.content = validator.unescape(data.content)
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

            data = await sql.Article.findOne({ _id: id })

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
        async findTitle(title, skip = 0, limit = 15) {
            let data = ""
            let obj = title ? {
                title: {
                    $regex: title,
                    $options: "i"
                }
            } : {}

            data = await sql.Article.aggregate().skip(skip * limit).limit(limit).match(obj).project({
                author: 1,
                title: 1,
                content: 1,
                create_time: 1,
                views: 1,
                flag: 1
            })

            /*
            if (data.length) {
                data[0].result = _unescape(data[0].result)
                data = data[0]
            } else {
                data = {
                    count: 0,
                    result: []
                }
            }
            */
            return _unescape(data)
        },
        async count(obj) {
            return await sql.Article.find(obj).count()
        },
        async prev(id) {
            let data = ""

            data = await sql.Article.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(1)

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