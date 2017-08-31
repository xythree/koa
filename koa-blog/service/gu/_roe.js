const request = require("request")

var j = request.jar()

//module.exports = () => {
function abc() {
    let username = process.argv[2]
    let password = process.argv[3]

    let time = ["20170630"]

    for (let i = 2016; i >= 2008; i--) {
        time.push(i + "1231")
    }

    return new Promise((resolve, reject) => {
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
        return obj => {
            let code = (/^6/.test(obj.code) ? "SH" : "SZ") + obj.code
            let timestamp = +new Date
            let page = 1
            let size = 35
            let _src = `https://xueqiu.com/stock/f10/finmainindex.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //主要财务指标
            let _src2 = `https://xueqiu.com/stock/f10/dailypriceextend.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //当日财务指标


            let a = [] // dilutedroe(摊薄)
            let b = [] // weightedroe(加权)

            return new Promise((resolve, reject) => {
                let cookie = request.cookie(j.getCookieString(_src))

                j.setCookie(cookie, _src)

                request({ url: _src, jar: j }, (err, res, body) => {
                    let obj = {}

                    try {
                        obj = JSON.parse(body)
                    } catch (e) {
                        console.log(1, e, body)
                    }

                    if (obj.list) {
                        time.forEach((t, i) => {
                            obj.list.forEach((_t, j) => {
                                if (t == _t.reportdate) {
                                    a.push(`${t}:${_t.dilutedroe}`)
                                    b.push(`${t}:${_t.weightedroe}`)
                                }
                            })
                        })
                        resolve()
                    }
                    resolve()
                })
            }).then(() => {
                return { "ROE(摊薄)": a, "ROE(加权)": b }
            })

        }
    })
}

let _a = abc()

_a.then(f => {
    f({ code: process.argv[4] }).then(d => {
        console.log(d)
    })
})