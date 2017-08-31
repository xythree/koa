const request = require("request")

var j = request.jar()

module.exports = () => {
    let username = process.argv[2]
    let password = process.argv[3]

    let time = ["20170630"]

    for (let i = 2016; i >= 2008; i--) {
        //time.push(i + "1231")
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
        let timestamp = +new Date
        return obj => {
            let code = (/^6/.test(obj.code) ? "SH" : "SZ") + obj.code
            let page = 1
            let size = 1
            let _src = `https://xueqiu.com/stock/f10/balsheet.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //资产负债表
            let _src2 = `https://xueqiu.com/stock/f10/dailypriceextend.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //当日财务指标

            let a = [] //流动资产 totcurrasset
            let b = [] //总负债 totliab
            let c = [] //总市值 tqQtSkdailyprice.totmktcap
            let d = [] //流通市值 tqQtSkdailyprice.negotiablemv || totmktcap

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
                        let o = obj.list[0]

                        if ("totcurrasset" in o && o.totcurrasset != void 0) {
                            a.push(o.totcurrasset)
                            b.push(o.totliab)
                        } else {
                            reject()
                        }

                    }
                    resolve()
                })
            }).then(() => {

                return new Promise((resolve, reject) => {
                    let cookie = request.cookie(j.getCookieString(_src2))

                    j.setCookie(cookie, _src2)

                    request({ url: _src2, jar: j }, (err, res, body) => {
                        let obj = {}

                        try {
                            obj = JSON.parse(body)
                        } catch (e) {
                            console.log(2, e, body)
                        }

                        if (obj.tqQtSkdailypriceExtend && obj.tqQtSkdailypriceExtend.tqQtSkdailyprice) {
                            c.push(obj.tqQtSkdailypriceExtend.tqQtSkdailyprice.totmktcap)
                            d.push(obj.tqQtSkdailypriceExtend.tqQtSkdailyprice.negotiablemv)
                            resolve()
                        } else {
                            resolve("end")
                        }
                    })
                }).then(s => {
                    if (s != "end") {
                        return { a, b, c, d }
                    }
                })
            }, () => {
                return false
            })

        }
    })
}