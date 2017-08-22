import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)


import articleBox from "./articleBox.vue"

export function createRouter() {
    return new Router({
        mode: "history",
        routes: [{
            path: "/article/:id",
            //component: resolve => require(["./home_articleBox.vue"], resolve)
            component: articleBox
        }]
    })
}