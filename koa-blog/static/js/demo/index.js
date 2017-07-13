import Vue from "vue"
import axios from "axios"

//import app from "./../../../vue_component/index/dragLayout.vue"
import app from "./../../../template/vue/music/controll.vue"

let vm = new Vue({
    el: "#word",
    //render: h => h(word)
    components: {
        app
    }
})