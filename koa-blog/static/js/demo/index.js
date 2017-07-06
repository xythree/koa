import Vue from "vue"


import app from "./../../../vue_component/index/dragBox.vue"


let vm = new Vue({
    el: "#word",
    //render: h => h(word)
    components: {
        app
    }
})