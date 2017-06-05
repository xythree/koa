import Vue from "vue"
import app from "../../../vue_component/music/app.vue"


let vm = new Vue({
    el: "#music",
    //render: h => h(app)
    components: {
        app
    }
})