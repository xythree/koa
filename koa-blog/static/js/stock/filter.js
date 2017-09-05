import Vue from "vue"

import app from "@vue/stock/filter.vue"


let vm = new Vue({
    el: "#filter",
    render: h => h(app)
})