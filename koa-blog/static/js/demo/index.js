import Vue from "vue"
import scroll_box from "./../../../vue_component/scroll_box/scroll_box.vue"


let vm = new Vue({
    el: "#word",
    //render: h => h(word)
    components: {
        scroll_box
    }
})