import Vue from "vue"

import app from "./../../../template/vue/chat/index.vue"



let vm = new Vue({
    el: "#chat",
    render: h => h(app),
    mounted() {

    }
})