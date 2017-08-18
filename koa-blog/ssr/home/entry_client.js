import Vue from "vue"
import { createApp } from "./home"
//import { createRouter } from "./router"

import repload from "vue_component/repload/repload.vue"
import backTop from "@vue/backTop.vue"


//const router = createRouter()

/*
let vm = new Vue({
    //el: "#ibody",
    //router,
    components: {
        repload,
        backTop
    }
}).$mount("#ibody")
*/

Vue.component("repload", repload)
Vue.component("backTop", backTop)

const { app, router, store } = createApp({})
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

app.$mount("#home")