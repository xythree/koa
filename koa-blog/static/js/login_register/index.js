import Vue from "vue"
import app from "./../../../template/vue/login_register.vue"



let vm = new Vue({
    el: "#app",
    render: h => h(app)
})