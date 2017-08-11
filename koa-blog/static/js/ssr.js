Vue.component("abc", {
    props: ["b"],
    data() {
        return {

        }
    },
    template: "<div>{{b}}</div>"
})

let vm = new Vue({
    el: "#ssr",
    data: {
        b: 3
    }
})