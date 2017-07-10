const crypto = require("./crypto")

module.exports = (router, render) => {

    const config = {
        hostname: "http://music.163.com",
        headers: {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "http://music.163.com",
            "Host": "music.163.com",
            "Cookie": "os=uwp; osver=10.0.10586.318; appver=1.2.1;",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
        }
    }

    router.get("/music", async ctx => {
        ctx.body = await render("/music/index")
    })

    router.get("/cloudmusic/api", async ctx => {
        const params = ctx.request.query
        let obj = {},
            fetchType = "post",
            fetchObj = {},
            cryptoResult = ""

        switch (params.type) {
            case "search":
                const limit = params.limit || 15
                obj = {
                    path: config.hostname + "/weapi/cloudsearch/get/web",
                    s: params.s,
                    type: params.search_type || 1,
                    offset: (params.offset || 0) * limit,
                    total: true,
                    limit: limit,
                    csrf_token: ""
                }
                break
            case "detail":
                obj = {
                    path: config.hostname + "/weapi/v3/song/detail",
                    c: `[{id: ${params.id}}]`,
                    csrf_token: ""
                }
                break
            case "id":
                obj = {
                    path: config.hostname + "/weapi/song/enhance/player/url",
                    ids: [params.id],
                    br: params.br || 128000,
                    csrf_token: ""
                }
                break
            case "lyric":
                fetchType = "get"
                fetchObj = {
                    path: config.hostname + "/api/song/lyric",
                    id: params.id,
                    lv: -1,
                    kv: -1,
                    tv: -1
                }
                break
        }

        if (fetchType == "post") {
            cryptoResult = crypto(obj)
            fetchObj = {
                path: obj.path,
                params: cryptoResult.params,
                encSecKey: cryptoResult.encSecKey
            }
        }

        await ctx[fetchType](fetchObj, {
            headers: config.headers
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })
    })

}