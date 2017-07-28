import Vue from "vue"

import app from "./../../../template/vue/chat/robot.vue"


let vm = new Vue({
    el: "#robot",
    render: h => h(app)
})