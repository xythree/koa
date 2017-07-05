import Vue from "vue"


import tree_box from "./../../../vue_component/index/tree.vue"





let vm = new Vue({
    el: "#word",
    //render: h => h(word)
    components: {
        app: tree_box
    }
})