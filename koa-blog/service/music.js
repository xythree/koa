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
            //"Cookie": "appver=1.5.6",
            "Cookie": "os=uwp; osver=10.0.10586.318; appver=1.2.1;",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
        }
    }

    router.get("/music", async ctx => {
        //ctx.body = await render("/mobile/music/index")

        ctx.body = await render("/music/index")
    })

    router.get("/music/api", async ctx => {

        const params = ctx.request.query
        const limit = params.limit || 15
        const obj = {
            //path: config.hostname + "/weapi/cloudsearch/get/web",
            path: config.hostname + "/api/search/pc",
            s: params.s,
            type: 1,
            offset: (params.offset || 0) * limit,
            limit: limit
        }
        let cryptoResult = crypto(obj)
        let result = {}

        /*
        result.result = await ctx.post({
            path: obj.path,
            params: cryptoResult.params,
            encSecKey: cryptoResult.encSecKey
        }, {
            headers: config.headers
        })
        */
        result.result = await ctx.post(obj, {
            headers: config.headers
        })
        result.result = JSON.parse(result.result)
        ctx.body = await result
    })


    router.post("/music/search", async ctx => {

        const params = ctx.request.body
        const limit = params.limit || 15
        const obj = {
            path: config.hostname + "/weapi/cloudsearch/get/web",
            s: params.s,
            type: params.type || 1,
            offset: (params.offset || 0) * limit,
            limit: limit,
            csrf_token: ""
        }

        let cryptoResult = crypto(obj)

        await ctx.post({
            path: obj.path,
            params: cryptoResult.params,
            encSecKey: cryptoResult.encSecKey
        }, {
            headers: config.headers
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })
    })

    //获取歌曲信息    
    router.post("/music/detail", async ctx => {
        const params = ctx.request.body
        const obj = {
            //path: config.hostname + "/api/song/detail/",
            path: config.hostname + "/weapi/v3/song/detail",
            //path: "http://api.imjad.cn/cloudmusic",
            //c: JSON.stringify([{
            //  id: params.id
            //}]),
            //id: params.id,
            //ids: `[${params.id}]`,
            c: `[{id: ${params.id}}]`,
            csrf_token: ""
        }

        let cryptoResult = crypto(obj)

        await ctx.post({
            path: obj.path,
            params: cryptoResult.params,
            encSecKey: cryptoResult.encSecKey
        }, {
            headers: config.headers
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })

    })

    router.post("/music/song", async ctx => {
        const params = ctx.request.body
        const obj = {
            path: config.hostname + "/weapi/song/enhance/player/url",
            ids: [params.id],
            br: 128000,
            csrf_token: ""
        }

        let cryptoResult = crypto(obj)

        await ctx.post({
            path: obj.path,
            params: cryptoResult.params,
            encSecKey: cryptoResult.encSecKey
        }, {
            headers: config.headers
        }).then(result => {
            console.log(result)
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })

    })

    router.get("/music/id", async ctx => {
        const params = ctx.request.query

        await ctx.get({
            path: config.hostname + "/api/album/" + params.id + "/"
        }, {
            headers: config.headers
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })

    })

    //获取歌词
    router.get("/music/lyric", async ctx => {
        const params = ctx.request.query

        await ctx.get({
            path: config.hostname + "/api/song/lyric",
            id: params.id,
            lv: -1,
            kv: -1,
            tv: -1
        }, {
            headers: config.headers,
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })

    })


}