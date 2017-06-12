
<style lang="sass">

</style>


<template>
    <div id="app">
        <touch_move_prevent></touch_move_prevent>
        <search_box :offset="offset" :playStatus="playStatus" :searchCallBack="searchCallBack"></search_box>
        <search_list_box :total="total" :showPage="showPage" :groceryList="groceryList" :searchListBoxCallBack="searchListBoxCallBack"></search_list_box>
        <play_controll_box></play_controll_box>
        <alert_box :alertBoxStatus="alertBoxStatus" :alertBoxText="alertBoxText" :alertBoxCallBack="alertBoxCallBack"></alert_box>
        <music_box></music_box>
        <play_list></play_list>
        <load_box></load_box>
    </div>
</template>

<script>

import Vue from "vue"
import Vuex from "vuex"
import touch_move_prevent from "./touchMovePrevent.vue"
import search_box from "./searchBox.vue"
import search_list_box from "./searchListBox.vue"
import alert_box from "../alert_box/alert_box.vue"
import play_controll_box from "./playControllBox.vue"
import music_box from "./musicBox.vue"
import axios from "axios"

Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        total: 0,
        offset: 0,
        search() { },
        alertBox: {
            alertBoxStatus: false,
            alertBoxText: ""
        },
        audioCurrentTime: '',
        audioDuration: '',
        loadBoxStatue: false,
        lyric: '',
        lyricItem: [],
        openMusicBoxStatus: false,
        songsInfo: {},
        playList: [],
        playListIndex: 0,
        offset: 0,
        searchVal: '',
        selectVal: 1,
        total: 0,
        groceryList: [],
        playToggleFn: '',
        playStatus: false,
        showPage: false,
        playListStatus: false,
        audioCurrentTime: '',
        audioDuration: '',
        alertBoxStatus: false,
        alertBoxFn: "",
        alertBoxText: "",
        condIconIndex: 0,
        condIcon: [
            { text: "单曲循环", type: "condSingle" },
            { text: "随机播放", type: "condRandom" },
            { text: "列表循环", type: "condList" }
        ],
        pagationCallBack: [],
        pagationIndex: 1

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
        },
        setaudiocurrenttime({ state }, data) {
            state.audioCurrentTime = data
        },
        setaudioduration({ state }, data) {
            state.audioDuration = data
        },
        setCondIconIndex({ state }, data) {
            state.condIconIndex = data
        },
        setAlertBoxStatus({ state }, data) {
            state.alertBoxStatus = data
        },
        setAlertBoxText({ state }, data) {
            state.alertBoxText = data
        },
        setAlertBoxFn({ state }, fn) {
            state.alertBoxFn = fn
        },
        alertBoxSure({ state, dispatch }) {
            dispatch("setAlertBoxStatus", false)
            state.alertBoxFn && state.alertBoxFn()
        },
        setPlayStatus({ state }, data) {
            state.playStatus = data
        },
        setMusicBoxStatus({ state }, data) {
            state.openMusicBoxStatus = data
        },
        setPlayListStatus({ state }, data) {
            state.playListStatus = data
        },
        setLoadBoxStatue({ state }, data) {
            state.loadBoxStatue = data
        },
        search2({ state, dispatch }) {
            let searchVal = state.searchVal.trim()
            if (searchVal == '') return
            dispatch('setLoadBoxStatue', true)
            axios.post('/music/search', {
                s: searchVal,
                type: state.selectVal,
                offset: state.offset
            }).then(d => {
                const data = d.data
                if (data.code == 200) {
                    const result = data.result

                    dispatch("setTotal", result.songCount)
                    dispatch('setGroceryList', result.songs)

                    if (result.songCount && result.songCount > result.songs.length) {
                        dispatch('setShowPage', true)
                    } else {
                        dispatch('setShowPage', false)
                    }
                }
                dispatch('setLoadBoxStatue', false)
            }, () => {
                dispatch('setLoadBoxStatue', false)
            })
        },
        setPaginationIndex({ state, dispatch }, data) {
            state.offset = data - 1
            state.pagationIndex = data
        },
        setTotal({ state }, data) {
            state.total = data
        },
        setOffset({ state }, data) {
            state.offset = data
        },
        setSearchVal({ state }, data) {
            state.searchVal = data
        },
        setGroceryList({ state }, data) {
            state.groceryList = data
        },
        setShowPage({ state }, data) {
            state.showPage = data
        },
        setPlayToggleFn({ state }, fn) {
            state.playToggleFn = fn
        },
        playToggle({ state }, data) {
            state.playToggleFn && state.playToggleFn(data)
        },
        removePlayList({ state }, data) {
            state.playList.splice(data, 1)
            localStorage.playList = JSON.stringify(state.playList)
        },
        setPlayList({ state }, data) {
            state.playList = data
        },
        addPlayList({ state }, data) {
            let flag = false
            state.playList.forEach(t => {
                if (t.id == data.id) flag = true
            })
            if (!flag) {
                state.playList.push(data)
                localStorage.playList = JSON.stringify(state.playList)
            }
        },
        setPlayListIndex({ state }, data) {
            state.playListIndex = data
        },
        getSong({ commit, dispatch }, data) {
            dispatch('songsInfo', data)
            axios.get(`/music/lyric?id=${data.id}`).then(d => {
                const data = d.data
                if (data.code == 200) {
                    dispatch('lyric', data)
                }
            })
        },
        songsInfo({ state, dispatch }, data) {
            state.songsInfo = data
            dispatch('playToggle')
        },
        lyric({ state }, data) {
            let lyric = '暂无歌词'
            state.lyricItem = []
            if (!data.nolyric && data.lrc && data.lrc.lyric) {
                lyric = data.lrc.lyric.replace(/\n/g, '</p>').replace(/\[([\d,\.,:]+)\]/g, function (a, b) {
                    const temp = b.split(':')
                    const time = +temp[0] * 60 + +temp[1]
                    state.lyricItem.push(time)
                    return `<p id='lyricId${time}'>`
                })
            }
            state.lyric = lyric
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

    },
    components: {
        touch_move_prevent,
        search_box,
        search_list_box,
        play_controll_box,
        alert_box,
        music_box,
        load_box: {
            computed: {
                loadBoxStatue() {
                    return this.$store.state.loadBoxStatue
                }
            },
            template: "<div v-show='loadBoxStatue' class='loadBox'></div>"
        },
        play_list: {
            computed: {
                playListStatus() {
                    return this.$store.state.playListStatus
                },
                playList() {
                    return this.$store.state.playList
                }
            },
            template: '<div class="playListBox" v-show="playListStatus"><h5>播放列表:</h5><div class="scrollBox"><ol class="listBox"><list_box v-for="(item,index) in playList" :index="index" :todo="item"></list_box></ol></div></div>',
            methods: {
                getSong(item) {
                    this.$store.dispatch('getSong', item)
                }
            }
        }
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