const request = require("request")

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

            let a = [] //经营活动产生的现金流量净额 biznetcflow
            let b = [] //资本支出 acquassetcash
            let c = [] //净利润 netprofit

            let d = [] //归属于母公司所有者的净利润 parenetp || 归属于母公司的净利润 netparecompprof

            let e1 = [] //流动资产合计 totcurrasset
            let e2 = [] //固定资产净额 fixedassenet
            let e3 = [] //所有者权益(或股东权益)合计-净资产 righaggr
            let e4 = [] //货币资金 curfds
            let e5 = [] //短期借款 shorttermborr
            let e6 = [] //长期借款 longborr
            let e7 = [] //应付债券 bdspaya


            return new Promise((resolve, reject) => {
                let cookie = request.cookie(j.getCookieString(_src))

                j.setCookie(cookie, _src)

                request({ url: _src, jar: j, json: true }, (err, res, body) => {
                    let obj = body || {}

                    if (obj.list) {
                        time.forEach((t, i) => {
                            obj.list.forEach((_t, j) => {
                                if (t == _t.enddate) {
                                    a.push(_t.mananetr || _t.biznetcflow || _t.busscashflownet)
                                    b.push(_t.acquassetcash)
                                    c.push(_t.netprofit)
                                }
                            })
                        })
                        resolve()
                    } else {
                        resolve("empty")
                    }
                })
            }).then(s => {
                if (s == "empty") {
                    return false
                }

                return new Promise((resolve, reject) => {
                    let cookie = request.cookie(j.getCookieString(_src2))

                    j.setCookie(cookie, _src2)

                    request({ url: _src2, jar: j, json: true }, (err, res, body) => {
                        let obj = body || {}

                        if (obj.list) {
                            time.forEach((t, i) => {
                                obj.list.forEach((_t, i) => {
                                    if (t == _t.enddate) {
                                        d.push(_t.parenetp || _t.netparecompprof)
                                    }
                                })
                            })
                        }
                        resolve()
                    })
                }).then(() => {
                    return new Promise((resolve, reject) => {
                        let cookie = request.cookie(j.getCookieString(_src3))

                        j.setCookie(cookie, _src3)

                        request({ url: _src3, jar: j, json: true }, (err, res, body) => {
                            let obj = body || {}

                            if (obj.list) {
                                time.forEach((t, i) => {
                                    obj.list.forEach((_t, i) => {
                                        if (t == _t.reportdate) {
                                            e1.push(_t.totcurrasset || _t.sharrightotal)
                                            e2.push(_t.fixedassenet)
                                            e3.push(_t.righaggr || _t.totsharequi)
                                            e4.push(_t.curfds || _t.cashanddepocenb)
                                            e5.push(_t.shorttermborr)
                                            e6.push(_t.longborr)
                                            e7.push(_t.bdspaya)
                                        }
                                    })
                                })
                            }
                            resolve()
                        })
                    }).then(() => {

                        return {
                            a,
                            b,
                            c,
                            d,
                            e1,
                            e2,
                            e3,
                            e4,
                            e5,
                            e6,
                            e7
                        }
                    })
                })
            })

        }
    })
}