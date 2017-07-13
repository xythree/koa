import Vue from "vue"
import app from "./../../../template/vue/tools/markdown.vue"


let vm = new Vue({
    el: "#markdown",
    render: h => h(app)
})