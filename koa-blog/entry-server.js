import { createApp } from './index'


export default context => {
    const { app } = createApp(context)
    return app
}