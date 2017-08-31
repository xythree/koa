const request = require("request")

function abc(a, b, c) {
    if (a.length < 2 || b.length < 2 || c.length < 2) {
        return null
    }
    var a = a //经营活动产生的现金流量净额 busscashflownet
    var b = b //资本支出 acquassetcash | mananetr
    var c = c //净利润 netparecompprof | netprofit | compincoamt
    var d = [] //净现金流

    a.forEach((t, i) => {
        d.push(t - b[i])
    })

    var _b = b.reduce((c, p) => {
        return +c + +p
    })

    var _d = d.reduce((c, p) => {
        return +c + +p
    })

    return {
        basic: ((_d / _b) * 100).toFixed(2),
        increase: (((d.shift() - d.pop()) / _b) * 100).toFixed(2)
    }
}

var j = request.jar()


let username = process.argv[2]
let password = process.argv[3]
let code = process.argv[4]
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
    code = (/^6/.test(code) ? "SH" : "SZ") + code
    let _src = `https://xueqiu.com/stock/f10/cfstatement.json?symbol=${code}&page=1&size=35&_=` + +new Date //现金流量表
    let _src2 = `https://xueqiu.com/stock/f10/incstatement.json?symbol=${code}&page=1&size=35&_=` + +new Date //综合损益表

    let a = []
    let b = []
    let c = []

    return new Promise((resolve, reject) => {
        var cookie = request.cookie(j.getCookieString(_src))

        j.setCookie(cookie, _src)

        request({ url: _src, jar: j }, function(err, res, body) {
            let obj = JSON.parse(body)

            if (obj.list) {
                time.forEach((t, i) => {
                    obj.list.forEach((_t, i) => {
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
            request({ url: _src2, jar: j }, function(err, res, body) {
                let obj = JSON.parse(body)

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

            console.log(a)
            console.log(b)
            console.log(c)
            console.log(result)
            process.exit()
        })
    })
})