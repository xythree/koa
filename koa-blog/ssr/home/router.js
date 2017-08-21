import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)


import home_list from "./home_list.vue"
import home_articleBox from "./home_articleBox.vue"

export function createRouter() {
    return new Router({
        mode: "history",
        routes: [{
            path: "/",
            //component: resolve => require(["./home_list.vue"], resolve)
            component: home_list
        }, {
            path: "/page/:id",
            //component: resolve => require(["./home_list.vue"], resolve)
            component: home_list
        }, {
            path: "/article/:id",
            //component: resolve => require(["./home_articleBox.vue"], resolve)
            component: home_articleBox
        }]
    })
}