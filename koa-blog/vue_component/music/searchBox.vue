<style lang="sass">

</style>

<template>
    <div class="searchBox" :class="{searchTop: searchTop}">
        <div @click="showSelectItem" class="selectListBox" :class="{showSelectList: showSelectList}">
            <span>{{selectList[selectIndex].value}}</span>
            <ul class="selectItem">
                <li v-for="(item,index) in selectList" v-if="selectIndex != index" @click="selectValFn(item.type, index)">{{item.value}}</li>
            </ul>
        </div>
        <input class="searchInput" @keyup.enter="searchKeyUp" type="text" @focus="searchFocus" v-model="searchVal" />
        <span class="searchBtn" @click="searchKeyUp">搜索</span>
        <div v-show="playStatus" class="musicPlan" @click="musicPlan"></div>
    </div>
</template>

<script>

import axios from "axios"

export default {
    props: ["playStatus", "searchCallBack", "searchFn"],
    data() {
        return {
            searchVal: '',
            selectVal: 1,
            searchTop: true,
            selectIndex: 0,
            showSelectList: false,
            selectList: [
                { value: '歌曲', type: 1 },
                { value: '专辑', type: 10 },
                { value: '歌手', type: 100 },
                { value: '歌单', type: 1000 },
                { value: '用户', type: 1002 },
                { value: 'mv', type: 1004 },
                { value: '歌词', type: 1006 },
                { value: '主播电台', type: 1009 }
            ]
        }
    },
    computed: {
        offset() {
            return this.$store.state.offset
        }
    },
    mounted() {
        document.addEventListener('click', (e) => {
            if (this.$el.contains(e.target)) {
                return false
            }
            this.showSelectList = false
        })

        if (this.$store && this.$store.state && this.$store.state.search) {
            this.$store.state.search = this.search
        }
    },
    methods: {
        musicPlan() {
            //this.$store.dispatch('setMusicBoxStatus', true)
        },
        showSelectItem() {
            this.showSelectList = !this.showSelectList
        },
        selectValFn(val, index) {
            /*
            if (this.selectIndex == index) {
                this.showSelectList = true
            } else {
                this.showSelectList = false
            }
            this.selectIndex = index
            this.selectVal = val
            */
        },
        searchFocus() {
            this.searchTop = true
        },
        searchKeyUp() {
            if (this.searchVal.trim() !== "") {
                this.$store.dispatch("setoffset", 0)
                this.search()
            }
        },
        search() {
            let searchVal = this.searchVal.trim()
            if (searchVal == '') return

            axios.post('/music/search', {
                s: searchVal,
                type: this.selectVal,
                offset: this.offset
            }).then(d => {
                this.searchCallBack && this.searchCallBack(d)
                const data = d.data
                if (data.code == 200) {
                    const result = data.result

                    if (result.songCount && result.songCount > result.songs.length) {

                    } else {

                    }
                }

            }, () => {

            })
        }
    }
}
</script>

