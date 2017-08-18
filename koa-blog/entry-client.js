import Vue from "vue"
import { createApp } from "./index"
// 客户端特定引导逻辑……
const { app } = createApp()
    // 这里假定 App.vue 模板中根元素具有 `id="app"`

import Router from 'vue-router'

Vue.use(Router)

let routes = [{
    path: "/abc",
    component: {
        template: "<div>abc</div>"
    }
}]

let router = new Router({
    routes
})

let vm = new Vue({
    el: "#router",
    router
}).$mount("#app")


//app.$mount('#app')