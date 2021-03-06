const Store = require("./store.js")

module.exports = (opts = {}) => {
    opts.key = opts.key || "koa:sess"
    opts.store = opts.store || new Store()

    return (ctx, next) => {
        //获得cookie
        let id = ctx.cookies.get(opts.key, opts)

        let promise = Promise.resolve()
        let old = {}

        if (id) {
            promise = opts.store.get(id).then(session => {
                ctx.session = session
                    // check session should be a no-null object
                if (typeof ctx.session != "object" || ctx.session == null) {
                    ctx.session = {}
                }
            })
        } else {
            ctx.session = {}
        }

        return promise.then(() => {
            old = JSON.stringify(ctx.session)
            return next()
        }).then(() => {
            // no modify
            if (old == JSON.stringify(ctx.session)) return

            return Promise.resolve().then(() => {
                // destory old session
                if (id) {
                    id = null
                    return opts.store.destroy(id)
                }
            }).then(() => {

                if (ctx.session && Object.keys(ctx.session).length) {
                    // set new session
                    return opts.store.set(ctx.session, Object.assign({}, opts, { sid: id })).then(sid => {
                        //创建cookie
                        ctx.cookies.set(opts.key, sid, opts)
                    })
                }
            })
        })
    }
}