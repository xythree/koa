import Vue from "vue"
import axios from "axios"
import word from "./../../../template/vue/word.vue"


let vm = new Vue({
    el: "#word",
    //render: h => h(word)
    components: {
        word
    }
})