<template>
    <div class="poetry-box" :class="{'showMenu': showMenu}">
        <div class="poetry-list-box" :style="poetryListStyle">
            <div class="poetry-search-box">
                <input type="text" placeholder="名称/作者" v-model="search.val" @keyup="searchFn" />
                <span @click="empty">X</span>
            </div>
            <ol class="poetry-list">
                <li v-if="!search.status">
                    <p>每日精选诗词</p>
                    <ul>
                        <li class="poetry-list-title" @click="menuFn(500);showInfo(choice)">
                            <span>{{choice[5]}}</span>
                            <span>{{choice[2]}}</span>
                        </li>
                    </ul>
                </li>
                <li v-for="(item,index) in info">
                    <div v-if="!search.status && item[4].length">
                        <p v-text="item[0]"></p>
                        <ul>
                            <li class="poetry-list-title" v-for="item2 in item[4]" @click="menuFn(500);showInfo(item2)">
                                <span>{{item2[5]}}</span>
                                <span>{{item2[2]}}</span>
                            </li>
                        </ul>
                    </div>
                </li>
                <li v-if="search.status" class="poetry-list-title" v-for="item in search.info" @click="menuFn(500); showInfo(item)">
                    <span>{{item[5]}}</span>
                    <span>{{item[2]}}</span>
                </li>
    
            </ol>
        </div>
        <transition name="fade">
            <div class="poerty-info" v-show="poertyInfoShow">
                <div class="imenuBg" v-show="showMenu" @click="menuFn(1)"></div>
                <div class="imenuBox">
                    <div class="imenu" @click="menuFn(1)">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <h3 v-text="details.title"></h3>
                <h5 v-text="details.name"></h5>
                <p v-html="details.content"></p>
                <p v-html="details.explain"></p>
            </div>
        </transition>
        <div class="loading-box" v-show="loadingBoxShow"></div>
    </div>
</template>

<script>

import axios from "axios"
import { cookie } from "./../../static/js/cookie"

export default {
    data() {
        return {
            loadingBoxShow: true,
            search: {
                timer: "",
                val: "",
                status: false,
                info: []
            },
            choice: [],
            info: [],
            tang: [],
            tangInfo: [],
            details: {
                title: "",
                name: "",
                content: "",
                explain: ""
            },
            poertyInfoShow: false,
            poetryListStyle: {
                height: window.innerHeight + "px"
            },
            showMenu: false
        }
    },
    methods: {
        menuFn(time) {
            setTimeout(() => {
                this.showMenu = !this.showMenu
            }, time)
        },
        empty() {
            this.search.val = ""
            this.searchFn()
        },
        searchFn(e) {
            let disabledArr = [37, 38, 39, 40]
            if (e && disabledArr.indexOf(e.keyCode) != -1) return
            this.search.status = true
            if (!this.search.val) {
                this.search.status = false
            }
            this.search.info = []
            clearTimeout(this.search.timer)
            this.search.timer = setTimeout(() => {
                this.info.forEach(t => {
                    t[4].forEach(_t => {
                        let val = this.search.val
                        if (_t[5].indexOf(val) != -1 || _t[2].indexOf(val) != -1) {
                            this.search.info.push(_t)
                        }
                    })
                })
            }, 100)
        },
        showInfo(data) {
            this.poertyInfoShow = false

            setTimeout(() => {
                this.details.title = data[5]
                this.details.name = data[2]
                this.details.content = data[0].replace(/\r\n/g, "<br />")
                this.details.explain = data[1].replace(/\r\n/g, "<br />")
                this.poertyInfoShow = true
            }, 300)
        }
    },
    mounted() {
        window.addEventListener("resize", () => {
            this.poetryListStyle = {
                height: window.innerHeight + "px"
            }
        })

        axios.get("/json/tang.json").then(result => {
            this.tang = result.data.rows

            axios.get("/json/tangInfo.json").then(result => {
                this.tangInfo = result.data.rows
                this.loadingBoxShow = false
                this.tang.forEach(t1 => {
                    t1[4] = []
                    this.tangInfo.forEach(t2 => {
                        if (t1[0] == t2[3]) {
                            t1[4].push(t2)
                        }
                    })
                })

                this.info = this.tang

                let choiceNum = cookie.get("choice")

                if (choiceNum == "") {
                    let date = new Date()
                    let timestamp = +new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 1)

                    choiceNum = Math.round(Math.random() * this.tangInfo.length)
                    cookie.set("choice", choiceNum, timestamp)
                }

                this.choice = this.tangInfo[choiceNum]
                this.showInfo(this.choice)
            })
        })
    }
}
</script>