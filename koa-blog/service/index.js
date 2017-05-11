




module.exports = function (router) {

    //搜索
    
    router.post("/music/search", async ctx => {

        const params = ctx.request.body
        const limit = params.limit || 15

        await ctx.post({
            path: "/api/search/get/web",
            s: params.s,
            hlpretag: "",
            hlposttag: "",
            type: params.type || 1,
            offset: (params.offset || 0) * limit,
            total: true,
            limit: limit
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
            path: "/api/song/detail/",
            id: params.id,
            ids: `[${params.id}]`
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
            path: "/api/song/lyric",
            id: params.id,
            lv: -1,
            kv: -1,
            tv: -1
        }).then(result => {
            ctx.body = result
        }, () => {
            ctx.status = 502
            ctx.body = "fetch error"
        })

    })


}

