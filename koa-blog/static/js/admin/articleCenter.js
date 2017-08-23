import Vue from "vue"
import axios from "axios"

let vm = new Vue({
    el: "#articleCenter",
    methods: {
        deleteFn(id) {
            let _confirm = confirm("确定删除吗?")

            if (_confirm) {
                axios.get("/article/remove-article", {
                    params: {
                        id
                    }
                }).then(data => {
                    let d = data.data
                    console.log(d)
                })
            }
        }
    }
})