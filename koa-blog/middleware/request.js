

const querystring = require("querystring")
const http = require("http")

const request = function (params) {

    let options = {
        hostname: "",
        port: 80
    }

    Object.assign(options, params)

    const promise = function (options, data) {
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
        post(data = {}) {
            const obj = {
                method: "POST",
                path: data.path
            }
            delete data.path

            Object.assign(options, obj)

            data = querystring.stringify(data)

            return promise(options, data)
        },
        get(data) {         
            const obj = {
                method: "GET"                
            }

            if (typeof data == "string") {                
                obj.path = data
            } else {                
                obj.path = data.path
                delete data.path
                obj.path += "?" + querystring.stringify(data)
            }

            Object.assign(options, obj)

            return promise(options, null)            
        }
    }    
}

module.exports = function (params = {}) {
	const req = request(params)
	return async (ctx, next) => {
		ctx.post = req.post
		ctx.get = req.get
		await next()
	}
	
}





