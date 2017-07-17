import Vue from "vue"
import axios from "axios"

import app from "../../../template/vue/admin/articleCenter.vue"

let vm = new Vue({
    el: "#articleCenter",
    data: {
        alertBoxStatus: true,
        alertBoxText: ""
    },
    components: {
        app
    },
    methods: {
        removeFn(e, id) {

            this.alertBoxStatus = true
            return
            axios.get("/article/remove-article", {
                params: {
                    id: id
                }
            }).then(data => {
                if (data.data.ok == 1) {
                    let ele = e.target
                    let elePar = ele.parentNode.parentNode

                    elePar.parentNode.removeChild(elePar)
                }
            })
        }
    }
})