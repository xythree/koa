import Vue from "vue"

import app from "./../../../template/vue/chat/chatroom.vue"




let vm = new Vue({
    el: "#chatroom",
    render: h => h(app)
})