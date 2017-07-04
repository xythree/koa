const mysql = require("mysql")

const sql = mysql.createConnection({
    host: "localhost",
    prot: 3306,
    user: "root",
    password: "123456",
    database: "koa_blog"
})


async function _public(_sql, _values) {
    let result = ""

    return await new Promise((resolve, reject) => {
        sql.query({
            sql: _sql,
            values: _values
        }, (err, data) => {
            if (!err) {
                result = data
            }
            resolve(result)
        })
    })
}


module.exports = {
    async delete(str, id) {
        let sql = "delete from " + str + " where id=?"
        let values = [id]

        let result = await _public(sql, values)

        if (result && result.affectedRows) {
            return { code: 1 }
        } else {
            return { code: 0 }
        }
    },
    async count(str) {
        let result = 0

        return await new Promise((resolve, reject) => {
            sql.query("select count(id) from " + str, (err, data) => {
                if (!err) {
                    result = data[0]["count(id)"]
                }
                resolve(result)
            })
        })
    },
    users: {
        async isLoing(ctx) {
            const username = ctx.cookies.get("username")
            let result = []

            return await new Promise((resolve, reject) => {
                if (username) {
                    sql.query({
                        sql: "select * from `users` where username=?",
                        values: [username]
                    }, (err, data) => {
                        if (!err) {
                            result = data
                        }
                        resolve(result)
                    })
                } else {
                    resolve(result)
                }
            })
        },
        async findUsername(username) {
            let sql = "select username from `users` where username=?"
            let values = [username]

            return _public(sql, values)
        },
        async login(username, password) {
            let sql = "select username from `users` where username=? and password=?"
            let values = [username, password]

            return _public(sql, values)
        },
        async resgiter(username, password) {
            let sql = "insert into users(username, password, birth, create_time) values (?,?,?,?)"
            let values = [username, password]

            return _public(sql, values)
        }
    },
    articles: {
        async find(skip = 0, limit = 15) {
            let sql = "select * from articles limit ?,?"
            let values = [skip * limit, limit]

            return _public(sql, values)
        },
        async add(author, title, content) {
            let sql = "insert into articles(author, title, content, create_time, last_modify_time) values(?,?,?,?,?)"
            let values = [author, title, content, new Date, new Date]

            let result = await _public(sql, values)

            if (result && result.affectedRows) {
                return { code: 1 }
            } else {
                return { code: 0 }
            }
        },
        async update(id, title, content) {
            let sql = "update articles set title=? and content=? and last_modify_time=? where id=?"
            let values = [title, content, new Date, id]

            return _public(sql, values)
        }
    }
}