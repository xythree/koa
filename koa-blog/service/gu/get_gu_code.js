const cheerio = require("cheerio")
const iconv = require("iconv-lite")
const request = require("request")
const mon = require("./model")

let code = process.argv[2]
let _src = "http://quote.eastmoney.com/stocklist.html"





request({
    encoding: null,
    url: _src
}, (err, res, body) => {
    let _data = iconv.decode(body, "gb2312")
    let $ = cheerio.load(_data, { decodeEntities: false })

    let sltit = $(".sltit")

    let sh = sltit.eq(0).next().next()
    let li = sh.find("li")
    let len = li.length

    let code = []

    for (let i = 0; i < len; i++) {
        let text = li.eq(i).text().replace(")", "").split("(")
        if (text[1].charAt(0) == 6) {
            code.push({ sign: "sh", name: text[0], code: text[1], basic: 0, increase: 0 })
        }
    }

    sh = sltit.eq(1).next().next()
    li = sh.find("li")
    len = li.length

    for (let i = 0; i < len; i++) {
        let text = li.eq(i).text().replace(")", "").split("(")
        if (text[1].charAt(0) == 0 || text[1].charAt(0) == 3) {
            code.push({ sign: "sz", name: text[0], code: text[1], basic: 0, increase: 0 })
        }
    }

    code.forEach((t, i) => {
        mon.gu.create(t)
    })


})