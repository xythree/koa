const fs = require("fs")
const path = require("path")

module.exports = sql => {

    const obj = {
        async isLogin(ctx) {
            const username = ctx.session.username
            let result = []

            if (username) {
                result = await sql.Users.aggregate().match({ username: username }).project({
                    username: 1,
                    nick: 1,
                    detail_info: 1,
                    age: 1,
                    birth: 1,
                    email: 1,
                    create_time: 1,
                    level: 1,
                    phone: 1
                })
            }

            return result
        },
        async base64(filepath) {
            return await new Promise((resolve, reject) => {
                fs.readFile(filepath, (err, data) => {
                    fs.unlink(filepath)
                    resolve("data:image/" + path.extname(filepath).substr(1) + ";base64," + data.toString("base64"))
                })
            })
        },
        async mkdirsSync(dirname) {
            if (fs.existsSync(dirname)) {
                return true
            } else {
                if (obj.mkdirsSync(path.dirname(dirname))) {
                    fs.mkdirSync(dirname)
                    return true
                }
            }
        }
    }

    return obj
}