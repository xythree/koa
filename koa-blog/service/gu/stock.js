const mon = require("../model")


module.exports = (router, render) => {


    router.get("/stock", async ctx => {
        let result = ""
        let params = ctx.request.query
        let type = params.type
        let obj = {}

        switch (type) {
            case "all":
                result = await mon.gu.find(obj)
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

                result = await mon.gu.find(obj)
                break
            case "code":
                obj.code = params.code
                result = await mon.gu.find(obj)
                break
            default:
                result = await render("stock/index")
        }

        ctx.body = await result

    })

}