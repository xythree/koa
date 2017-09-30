const request = require("request")
const cheerio = require("cheerio")


let j = request.jar()

new Promise((resolve, rejct) => {
    request.post({
        url: "https://xueqiu.com/snowman/login",
        form: {
            remember_me: true,
            username: username,
            password: password
        },
        jar: j
    }, (err, res, body) => {
        resolve()
    })
}).then(() => {

    request({
        url: "https://news.futunn.com/"
    }, (err, res, body) => {
        let $ = cheerio.load(body)

        let src = $(".bannerBox ul li a").attr("href")

        let cookie = request.cookie(j.getCookieString(_src))

        j.setCookie(cookie, src)

        request({
            url: src,
            jar: j
        })

    })
})