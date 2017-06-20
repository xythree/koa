/* mode:
 ** same-origin: 只在请求同域中资源时成功，其他请求将被拒绝。
 ** cors: 允许请求同域及返回CORS响应头的域中的资源。
 ** cors-with-forced-preflight:在发出实际请求前执行preflight检查。
 ** no-cors: 针对的是向其他不返回CORS响应头的域中的资源发出的请求（响应类型为“opaque”），但如前所述，目前在页面脚本代码中不起作用。
 */

/*

let url = ""

fetch(url, {
    mode: "cors"
}).then(response => {

    response.json().then(data => {
        console.log(data)
    })

})

*/

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function format(response) {
    let temp = ""

    try {
        //temp = response.json()
    } catch (e) {
        temp = response.text()
    }

    return response
}

function objStringify(obj) {
    let result = []

    for (let i in obj) {
        result.push(i + "=" + obj[i])
    }
    return result.join("&")
}

function _fetch(params, options = {}) {
    let url = "",
        obj = {}

    if (typeof params === "string") {
        url = params
    } else {
        url = params.url

        if (options.method === "post") {
            obj.method = options.method
            delete options.method
            obj.headers = {
                "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
            }
            obj.body = objStringify(params.data)
        } else {
            url += "?" + objStringify(params.data)
        }
    }
    Object.assign(obj, options)

    return fetch(url, obj).then(status).then(format)
}

module.exports = {
    post(params, options = {}) {
        options.method = "post"

        return _fetch(params, options)
    },
    get(params, options = {}) {
        return _fetch(params, options)
    }
}