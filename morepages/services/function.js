



module.exports = function (sql) {

    var sql = sql || require("./sql")
    var models = require("./model")

    return {
        loginTime() {
            var time = this.cookies.get("loginTime")
            if (Date.now() - time > 1000*60*60) {
                return true
            }
            return false
        },
        userFind(obj) {

            return new Promise(function (resolve, reject) {
                try {
                    var result = {
                        status: 0
                    }
                    sql.getModel("Users").find(obj, function (err, doc) {
                        if (err) {
                            console.log("find name err!", err)
                            return
                        }
                        if (doc.length) {
                            result.status = 1
                            doc[0].password = ""                                             
                            result.doc = doc[0]                        
                        }
                        resolve(result)
                    })
                } catch(e) {
                    reject(e)
                }
            })

        },
        userCreate(obj) {

            return new Promise(function (resolve, reject) {
                try {
                    var result = {
                        status: 0
                    }
                    var temp = Object.keys(models.Users)
                    var d = {}
                    for(var i in temp) {
                        d[temp[i]] = ""
                    }
                    Object.assign(d, obj)
                    
                    sql.getModel("Users").create(d, function (err, doc) {
                        if (err) {
                            console.log("create Users err!", err)
                            return
                        }
                        if (doc) {
                            result.status = 1
                            result.doc = doc
                        }
                        resolve(result)
                    })
                } catch(e) {
                    reject(e)
                }
            })
        }
    }

}