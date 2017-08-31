import Vue from "vue"

import app from "@vue/stock/index.vue"


let vm = new Vue({
    el: "#stock",
    render: h => h(app)
})