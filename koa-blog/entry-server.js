import { createApp } from './index'


export default context => {
    const { app } = createApp(context)
        //console.log("context.url", context.ctx.req)
    return app
}