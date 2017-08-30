const querystring = require("querystring")
const http = require("http")
const https = require("https")
const url = require("url")

let httpsFlag = false

const request = function(params) {

    let options = {
        port: 80
    }

    Object.assign(options, params)

    const promise = function(options, data) {

        return new Promise((resolve, reject) => {
            let body = [],
                _http = http

            if (httpsFlag) {
                _http = https
                options.port = 443
            }

            try {

                const req = _http.request(options, response => {
                    response.on("data", chunk => {
                        body.push(chunk)
                    }).on("end", () => {
                        body = Buffer.concat(body)
                        resolve(body.toString())
                    })
                })

                data && req.write(data)
                req.end()
            } catch (err) {
                reject(err)
            }
        })
    }

    return {
        post(data = {}, data2 = {}) {

            const obj = {
                method: "POST"
            }
            if (data.path) {
                if (/^https:/i.test(data.path)) {
                    httpsFlag = true
                }
                const _url = url.parse(data.path)
                obj.path = _url.pathname
                obj.hostname = _url.hostname
                delete data.path
            }
            Object.assign(options, obj, data2)

            data = querystring.stringify(data)

            return promise(options, data)
        },
        get(data, data2 = {}) {
            const obj = {
                method: "GET"
            }
            let _url = ""

            if (typeof data == "string") {
                if (/^https:/i.test(data)) {
                    httpsFlag = true
                }
                _url = url.parse(data)
                obj.path = _url.pathname
            } else {
                if (/^https:/i.test(data.path)) {
                    httpsFlag = true
                }
                _url = url.parse(data.path)
                obj.path = _url.pathname
                delete data.path
                obj.path += "?" + querystring.stringify(data)
            }
            obj.hostname = _url.hostname

            Object.assign(options, obj, data2)
            return promise(options, null)
        }
    }
}

module.exports = function(params = {}) {
    const req = request(params)
    return async(ctx, next) => {
        ctx.post = req.post
        ctx.get = req.get
        await next()
    }

}