import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

import app from "./../../template/vue/index.vue"
import articleBox from "./../../template/vue/articleBox.vue"
import articleList from "./../../template/vue/articleList.vue"
import store from "./store"

let routes = [{
    path: "/",
    component: articleList
}, {
    path: "/article",
    component: articleBox
}]

let router = new VueRouter({
    routes
})


let vm = new Vue({
    el: "#app",
    router,
    store,
    components: {
        app
    }
})