import Vue from "vue"
import app from "./../../../template/vue/music.vue"


let vm = new Vue({
    el: "#music",
    //render: h => h(app)
    components: {
        app
    }
})