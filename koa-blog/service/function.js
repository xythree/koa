module.exports = sql => {

    return {
        async isLogin(ctx) {
            const username = ctx.cookies.get("username")
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
        }
    }
}