const request = require("request")

function abc(a, b, c) {
    if (a.length < 2 || b.length < 2 || c.length < 2) {
        return null
    }
    //a 经营活动产生的现金流量净额 busscashflownet
    //b 资本支出 acquassetcash | mananetr
    //c 净利润 netparecompprof | netprofit
    let d = [] //净现金流

    a.forEach((t, i) => {
        d.push(t - b[i])
    })

    let _b = b.reduce((c, p) => {
        return +c + +p
    })

    let _d = d.reduce((c, p) => {
        return +c + +p
    })

    return {
        basic: ((_d / _b) * 100).toFixed(2),
        increase: (((d.shift() - d.pop()) / _b) * 100).toFixed(2)
    }
}

var j = request.jar()

module.exports = () => {
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
            let _src = `https://xueqiu.com/stock/f10/cfstatement.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //现金流量表
            let _src2 = `https://xueqiu.com/stock/f10/incstatement.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //综合损益表
            let _src3 = `https://xueqiu.com/stock/f10/balsheet.json?symbol=${code}&page=${page}&size=${size}&_=` + timestamp //资产负债表

            let a = [] //经营活动产生的现金流量净额 busscashflownet
            let b = [] //资本支出 acquassetcash | mananetr
            let c = [] //净利润 netparecompprof | netprofit
            let d = [] //所有者权益(或股东权益)合计-净资产 righaggr

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
                                if (t == _t.enddate) {
                                    a.push(_t.busscashflownet || _t.mananetr)
                                    b.push(_t.acquassetcash)
                                }
                            })
                        })
                        resolve()
                    } else {
                        resolve("end")
                    }
                })
            }).then(d => {
                if (d == "end") {
                    return abc(a, b, c)
                }

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

                        if (obj.list) {
                            time.forEach((t, i) => {
                                obj.list.forEach((_t, i) => {
                                    if (t == _t.enddate) {
                                        c.push(_t.netparecompprof || _t.netprofit)
                                    }
                                })
                            })

                        }

                        resolve()
                    })
                }).then(() => {
                    let result = abc(a, b, c)
                    return result
                })
            })

        }
    })
}