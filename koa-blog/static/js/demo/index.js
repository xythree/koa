import Vue from "vue"
import app from "./../../../vue_component/demo.vue"


let vm = new Vue({
    el: "#word",
    //render: h => h(word)
    components: {
        app
    }
})