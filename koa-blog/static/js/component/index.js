import Vue from "vue"
import VueRouter from "vue-router"

import app from "../../../vue_component/app_component.vue"

Vue.use(VueRouter)


import waveButton from "../../../vue_component/index/waveButton.vue"
import calendar from "../../../vue_component/index/calendar.vue"

let routes = [{
    path: "/waveButton",
    component: waveButton,
    mounted() {
        alert(2)
    }
}, {
    path: "/calendar",
    component: calendar
}]


let router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
    next()
    setTimeout(() => {
        document.querySelectorAll("pre code").forEach(function(t) {
            var texts = t.textContent.replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
            var temp = texts.split(/\n/)
            var code = ""

            temp.forEach(function(_t) {
                code += "<li>" + _t + "</li>"
            })
            t.innerHTML = "<ol>" + code + "</ol>"
            hljs.highlightBlock(t)
        })
    }, 1)

})





let vm = new Vue({
    el: "#component",
    router,
    render: h => h(app)
})