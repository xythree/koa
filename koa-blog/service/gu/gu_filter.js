const gu = require("./gu")()
const mon = require("../model")
const roe = require("./roe")()
const jjgz = require("./jjgz")()
const gu_data = require("./gu_data")()

let codeList = ""
let goods = []

new Promise((resolve, reject) => {
    mon.gu.find().skip(+(process.argv[5] || 0)).then((data, err) => {
        resolve(data)
    })

}).then(async data => {
    codeList = data
    let index = 0

    let time = ["20170630"]

    for (let i = 2016; i >= 2008; i--) {
        time.push(i + "1231")
    }

    function getResult(obj) {
        if (index < codeList.length) {
            let s = process.argv[4]
            if (s == "gu") {
                gu.then(f => {
                    f(obj).then(d => {
                        console.log(index, obj.name, obj.code, d)
                        if (d) {
                            if (parseFloat(d.increase) >= 20) {
                                goods.push(d)
                            }

                            mon.gu.update({ code: obj.code }, {
                                $set: {
                                    basic: d.basic,
                                    increase: d.increase
                                }
                            }).then(() => {
                                getResult(codeList[++index])
                            })

                        } else {
                            getResult(codeList[++index])
                        }
                    })
                })
            } else if (s == "roe") {
                roe.then(f => {
                    f(obj).then(d => {
                        console.log(index, obj.name, obj.code, "roe")
                        if (d) {
                            if (d.a.length && d.b.length && d.c.length) {
                                mon.gu.update({ code: obj.code }, {
                                    $set: {
                                        roe1: d.a,
                                        roe2: d.b,
                                        nir: +d.c[0].split(":")[1] || 0
                                    }
                                }).then(() => {
                                    getResult(codeList[++index])
                                })
                            } else {
                                getResult(codeList[++index])
                            }
                        } else {
                            getResult(codeList[++index])
                        }
                    })
                })
            } else if (s == "jjgz") {
                jjgz.then(f => {
                    f(obj).then(d => {
                        console.log(index, obj.name, obj.code, "jjgz")
                        if (d) {
                            mon.gu.update({ code: obj.code }, {
                                $set: {
                                    totcurrasset: d.a[0],
                                    totliab: d.b[0],
                                    totmktcap: d.c[0],
                                    negotiablemv: d.d[0]
                                }
                            }).then(() => {
                                getResult(codeList[++index])
                            })

                        } else {
                            getResult(codeList[++index])
                        }
                    })
                }, () => {
                    getResult(codeList[++index])
                })
            } else if (s == "data") {
                gu_data.then(f => {
                    f(obj).then(d => {
                        console.log(index, obj.name, obj.code, "data")
                        if (d) {

                            /*
                            let nums = 0

                            time.forEach((t, i) => {
                                mon.stockData.create({
                                    pid: obj.code,
                                    name: obj.name,
                                    time: t,
                                    biznetcflow: d.a[i],
                                    acquassetcash: d.b[i],
                                    netprofit: d.c[i],
                                    parenetp: d.d[i],
                                    totcurrasset: d.e1[i],
                                    fixedassenet: d.e2[i],
                                    righaggr: d.e3[i],
                                    curfds: d.e4[i],
                                    shorttermborr: d.e5[i],
                                    longborr: d.e6[i],
                                    bdspaya: d.e7[i]
                                }).then(() => {
                                    ++nums
                                    if (nums == time.length - 1) {
                                        getResult(codeList[++index])
                                    }
                                })
                            })
                            */
                            Promise.all(time.map((t, i) => {
                                return new Promise((resolve, reject) => {
                                    mon.stockData.create({
                                        pid: obj.code,
                                        name: obj.name,
                                        time: t,
                                        biznetcflow: d.a[i],
                                        acquassetcash: d.b[i],
                                        netprofit: d.c[i],
                                        parenetp: d.d[i],
                                        totcurrasset: d.e1[i],
                                        fixedassenet: d.e2[i],
                                        righaggr: d.e3[i],
                                        curfds: d.e4[i],
                                        shorttermborr: d.e5[i],
                                        longborr: d.e6[i],
                                        bdspaya: d.e7[i]
                                    }).then(() => {
                                        resolve()
                                    })
                                })
                            })).then(() => {
                                getResult(codeList[++index])
                            })
                        } else {
                            getResult(codeList[++index])
                        }
                    })
                }, () => {
                    getResult(codeList[++index])
                })
            }
        } else {
            console.log("end")
            console.log("goods:", goods)
            process.exit()
        }
    }
    getResult(codeList[0])

})