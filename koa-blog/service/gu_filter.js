const gu = require("./gu")()
const mon = require("./model")

let codeList = ""
let goods = []

new Promise((resolve, reject) => {
    mon.gu.find({ sign: "sz" }).then((data, err) => {
        resolve(data)
    })
}).then(async data => {
    codeList = data
    let index = 0

    function getResult(obj) {
        if (index < codeList.length) {
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
        } else {
            console.log("end")
            console.log("goods:", goods)
            process.exit()
        }
    }
    getResult(codeList[0])

})