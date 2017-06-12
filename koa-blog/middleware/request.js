const querystring = require("querystring")
const http = require("http")
const url = require("url")

const request = function(params) {

    let options = {
        port: 80
    }

    Object.assign(options, params)

    const promise = function(options, data) {

        return new Promise((resolve, reject) => {
            let body = []
            try {
                const req = http.request(options, response => {
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
            const _url = url.parse(data.path)

            obj.path = _url.pathname
            obj.hostname = _url.hostname
            delete data.path

            Object.assign(options, obj, data2)

            data = querystring.stringify(data)

            return promise(options, data)
        },
        get(data, data2 = {}) {
            const obj = {
                method: "GET"
            }

            if (typeof data == "string") {
                const _url = url.parse(data)
                obj.path = _url.path
            } else {
                const _url = url.parse(data.path)
                obj.path = _url.pathname
                obj.hostname = _url.hostname
                delete data.path
                obj.path += "?" + querystring.stringify(data)
            }

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