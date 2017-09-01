const mon = require("../model")


module.exports = (router, render) => {


    router.get("/stock", async ctx => {
        let result = {}
        let params = ctx.request.query
        let type = params.type
        let obj = {}
        let limit = +(params.limit || 15)
        let skip = limit * (params.skip || 0)

        switch (type) {
            case "all":
                console.log(skip * limit, limit)
                result.count = await mon.gu.find(obj).count()
                result.data = await mon.gu.find(obj).skip(skip).limit(limit)
                break
            case "filter":
                if (params.basic != void 0) {
                    obj.basic = {
                        $gte: +params.basic
                    }
                }
                if (params.increase != void 0) {
                    obj.increase = {
                        $gte: +params.increase
                    }
                }

                result.count = await mon.gu.find(obj).count()
                result.data = await mon.gu.find(obj).skip(skip).limit(limit)
                break
            case "code":
                obj.code = params.code
                result.count = await mon.gu.find(obj).count()
                result.data = await mon.gu.find(obj).skip(skip).limit(limit)
                break
            default:
                result = await render("stock/index")
        }

        ctx.body = await result

    })

}