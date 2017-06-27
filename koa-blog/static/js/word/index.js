import Vue from "vue"
import word from "./../../../template/vue/word.vue"


let vm = new Vue({
    el: "#word",
    //render: h => h(word)    
    components: {
        word
    }
})