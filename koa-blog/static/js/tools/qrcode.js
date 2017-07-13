import Vue from "vue"
import app from "./../../../template/vue/tools/qrcode.vue"


let vm = new Vue({
    el: "#qrcode",
    render: h => h(app)
})