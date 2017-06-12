module.exports = function(router) {

    const config = {
        hostname: "http://music.163.com",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "appver=1.5.0.75771",
            "Referer": "http://music.163.com"
        }
    }

    //搜索

    router.post("/music/search", async ctx => {

        const params = ctx.request.body
        const limit = params.limit || 10

        await ctx.post({
            //path: "/api/search/get/web",
            path: config.hostname + "/api/search/pc",
            s: params.s,
            hlpretag: "",
            hlposttag: "",
            type: params.type || 1,
            offset: (params.offset || 0) * limit,
            total: true,
            limit: limit
        }, {
            headers: config.headers,
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })
    })

    //获取歌曲信息    
    router.get("/music/detail", async ctx => {
        const params = ctx.request.query

        await ctx.get({
            path: config.hostname + "/api/song/detail/",
            id: params.id,
            ids: `[${params.id}]`
        }, {
            headers: config.headers,
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