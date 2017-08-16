import Vue from 'vue'
import App from './index.vue'
import { createStore } from './store'
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp(context) {
    const { list } = context || {}
    const store = createStore({ abc: 1 })

    const app = new Vue({
        store,
        data() {
            return {
                ab: 1
            }
        },
        // 根实例简单的渲染应用程序组件。
        render: h => h(App, {
            props: {
                list
            }
        })
    })

    return { app }
}