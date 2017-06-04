import Vue from "vue"
import VueRouter from "vue-router"

import app from "../../../vue_component/app_component.vue"

Vue.use(VueRouter)


import pagination from "../../../vue_component/index/pagination.vue"
import selectBox from "../../../vue_component/index/selectBox.vue"
import selectList from "../../../vue_component/index/selectList.vue"
import waveButton from "../../../vue_component/index/waveButton.vue"
import calendar from "../../../vue_component/index/calendar.vue"
import calendarSelect from "../../../vue_component/index/calendarSelect.vue"

let routes = [{
    path: "/",
    component: {
        template: "<div>空~囧~</div>"
    }
}, {
    path: "/pagination",
    component: pagination
}, {
    path: "/selectBox",
    component: selectBox
}, {
    path: "/selectList",
    component: selectList
}, {
    path: "/calendar",
    component: calendar
}, {
    path: "/calendarSelect",
    component: calendarSelect
}, {
    path: "/waveButton",
    component: waveButton
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