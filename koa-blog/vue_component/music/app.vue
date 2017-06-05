
<style lang="sass">

</style>


<template>
    <div id="app">
        <touch_move_prevent></touch_move_prevent>
        <search_box :offset="offset" :playStatus="playStatus" :searchCallBack="searchCallBack"></search_box>
        <search_list_box :total="total" :showPage="showPage" :groceryList="groceryList" :searchListBoxCallBack="searchListBoxCallBack"></search_list_box>
    
        <alert_box :alertBoxStatus="alertBoxStatus" :alertBoxText="alertBoxText" :alertBoxCallBack="alertBoxCallBack"></alert_box>
    </div>
</template>

<script>

import Vue from "vue"
import Vuex from "vuex"
import touch_move_prevent from "./touchMovePrevent.vue"
import search_box from "./searchBox.vue"
import search_list_box from "./searchListBox.vue"
import alert_box from "../alert_box/alert_box.vue"

Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        total: 0,
        offset: 0,
        search() { },
        alertBox: {
            alertBoxStatus: false,
            alertBoxText: ""
        }

    },
    actions: {
        settotal({ state }, data) {
            state.total = data
        },
        setoffset({ state }, data) {
            state.offset = data
        },
        search({ state }) {
            state.search()
        },
        setalertbox({ state }, data) {
            state.alertBox.alertBoxStatus = data.alertBoxStatus
            state.alertBox.alertBoxText = data.alertBoxText
        }
    }
})

export default {
    store,
    data() {
        let state = this.$store.state
        return {
            search: "",
            offset: state.offset,
            total: state.total,
            showPage: true,
            groceryList: []
        }
    },
    computed: {
        alertBoxStatus() {
            return this.$store.state.alertBox.alertBoxStatus
        },
        alertBoxText() {
            return this.$store.state.alertBox.alertBoxText
        }
    },
    mounted() {
        this.$store.dispatch("setalertbox", {
            alertBoxStatus: true,
            alertBoxText: 123
        })
    },
    components: {
        touch_move_prevent,
        search_box,
        search_list_box,
        alert_box
    },
    methods: {
        alertBoxCallBack(arg) {
            let flag = false, txt = ""
            
            this.$store.dispatch("setalertbox", {
                alertBoxStatus: flag,
                alertBoxText: txt
            })
        },
        searchCallBack(d) {
            const data = d.data

            if (data.code == 200) {
                const result = data.result

                //dispatch("setTotal", result.songCount)
                //dispatch('setGroceryList', result.songs)
                this.total = result.songCount
                this.groceryList = result.songs

                if (result.songCount && result.songCount > result.songs.length) {
                    //dispatch('setShowPage', true)
                } else {
                    //dispatch('setShowPage', false)
                }
            }
        },
        searchListBoxCallBack(arg) {
            const _dispatch = this.$store.dispatch

            _dispatch("setoffset", arg - 1)
            _dispatch("search")

        }
    }
}
</script>