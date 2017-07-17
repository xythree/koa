
<template>
    <div class="iword">
    
        <transition name="fade">
            <div class="itip" v-show="!tip">
                本功能主要用于MongoDB练习，单词量为135,115
                <a href="javascript:;" @click="tipFn">X</a>
            </div>
        </transition>
    
        <dl class="iwords_box">
            <dt class="itab_nav">
                <a href="javascript:;" @click="tabsFn(false)" :class="{'showStatus': showStatus}">查单词</a>
                <a href="javascript:;" @click="tabsFn(true)" :class="{'showStatus': !showStatus}">背单词</a>
            </dt>
            <dd v-show="showStatus">
                <input type="text" class="value" ref="refValue" placeholder="输入要查询的英文单词" @keyup.enter="search" @focus="focusFn" @blur="blurFn" v-model="value" />
    
                <div class="ibox">
                    {{empty}}
                    <transition name="fade">
                        <div v-show="docs.length">
                            <div class="iphonogram">
                                英:[{{(this.voice && this.voice.ph_en)}}]
                                <audio preload ref="audio_en" :src="this.voice && this.voice.ph_en_mp3"></audio>
                                <span v-show="this.voice && this.voice.ph_en_mp3" @click="playFn('en')" class="iauido_controls" :class="{'istop': enStatus}"></span>
                                <div v-show="!ua.mobile">
                                    <p v-show="this.voice && this.voice.ph_en_mp3">按
                                        <b>F2</b>可发英音</p>
                                </div>
                            </div>
                            <div class="iphonogram">
                                美:[{{(this.voice && this.voice.ph_am)}}]
                                <audio preload ref="audio_am" :src="this.voice && this.voice.ph_am_mp3"></audio>
                                <span v-show="this.voice && this.voice.ph_am_mp3" @click="playFn('am')" class="iauido_controls" :class="{'istop': amStatus}"></span>
                                <div v-show="!ua.mobile">
                                    <p v-show="this.voice && this.voice.ph_am_mp3">按
                                        <b>F4</b>可发美音</p>
                                </div>
                            </div>
                            <h5>解释:</h5>
                            <ul>
                                <li v-for="item in docs">
                                    <span>{{item.posId|getPos}}</span>
                                    <p>{{item.means}}</p>
                                </li>
                            </ul>
                            <h5>其它形态:</h5>
                            <ul>
                                <li v-for="(value, key) in exchange">
                                    <span>{{key}}:</span>
                                    <p>{{value||"&nbsp;"}}</p>
                                </li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </dd>
            <dd v-show="!showStatus">
                <div class="irecite_box">
                    <div class="inums" v-if="false">
                        <label v-for="item in radioList">
                            <input v-model="radioValue" @click="radioFn(item)" :value="item" type="radio" />每次{{item}}个</label>
                    </div>
    
                    <div class="irecite_word_list_box">
                        <ul class="irecite_word_list" ref="irecite_word_list">
                            <li>
                                <span class="prevGroup" @click="prevGroup">上一组</span>
                                <span class="nextGroup" @click="nextGroup">下一组</span>
                            </li>
                            <li v-for="(item,index) in reciteWordList" :class="{'active': index == reciteIndex}" @click="getWord(index)">{{index+1}}. {{item.word}}</li>
                        </ul>
                        <div class="irecite_wor_right ibox">
                            <div class="itext">
                                <p>按回车键可清空</p>
                                <input type="text" @keyup.enter="textFn" v-model="textValue" :placeholder="placeholderValue" />
                                <a href="javascript:;" @click="nextWord">下一个</a>(可按方向键 → or ↓)
                            </div>
    
                            <div class="iphonogram">
                                英:[{{(this.voice && this.voice.ph_en)}}]
                                <audio preload ref="audio_en" :src="this.voice && this.voice.ph_en_mp3"></audio>
                                <span v-show="this.voice && this.voice.ph_en_mp3" @click="playFn('en')" class="iauido_controls" :class="{'istop': enStatus}"></span>
                                <div v-show="!ua.mobile">
                                    <p v-show="this.voice && this.voice.ph_en_mp3">按
                                        <b>F2</b>可发英音</p>
                                </div>
                            </div>
                            <div class="iphonogram">
                                美:[{{(this.voice && this.voice.ph_am)}}]
                                <audio preload ref="audio_am" :src="this.voice && this.voice.ph_am_mp3"></audio>
                                <span v-show="this.voice && this.voice.ph_am_mp3" @click="playFn('am')" class="iauido_controls" :class="{'istop': amStatus}"></span>
                                <div v-show="!ua.mobile">
                                    <p v-show="this.voice && this.voice.ph_am_mp3">按
                                        <b>F4</b>可发美音</p>
                                </div>
                            </div>
                            <h5>解释:</h5>
                            <ul>
                                <li v-for="item in docs">
                                    <span>{{item.posId|getPos}}</span>
                                    <p>{{item.means}}</p>
                                </li>
                            </ul>
                            <h5>其它形态:</h5>
                            <ul>
                                <li v-for="(value, key) in exchange">
                                    <span>{{key}}:</span>
                                    <p>{{value||"&nbsp;"}}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
    
                </div>
            </dd>
        </dl>
        <alert_box :alertBoxStatus="alertBoxStatus" :alertBoxText="alertBoxText" :alertBoxCallBack="alertBoxCallBack"></alert_box>
    </div>
</template>

<script>
import axios from "axios"
import { cookie } from "./../../static/js/cookie"
import { ua } from "./../../static/js/xythree"
import alert_box from "./../../vue_component/alert/alert.vue"

export default {
    data() {
        return {
            alertBoxStatus: false,
            alertBoxText: "",
            textValue: "",
            showStatus: true,
            radioList: [10, 15, 20, 30, 50],
            skip: 0,
            radioValue: 10,
            reciteWordList: [],
            reciteIndex: 0,
            temp: {},
            tip: cookie.get("tip"),
            value: "",
            docs: [],
            exchange: {},
            voice: {},
            empty: "",
            enStatus: false,
            amStatus: false,
            ua: ua()
        }
    },
    computed: {
        placeholderValue() {
            let w = this.reciteWordList[this.reciteIndex]
            return w && w.word || ""
        }
    },
    components: {
        alert_box
    },
    filters: {
        getPos(value) {
            let result = ""

            pos.forEach((t, i) => {
                if (t.id == value) {
                    result = t.means + " ( " + t.name + " ):"
                }
            })
            return result
        }
    },
    methods: {
        scroll() {
            this.$nextTick(() => {
                let active = document.querySelector(".active"),
                    irecite_word_list = this.$refs.irecite_word_list,
                    t = active.offsetTop, h = irecite_word_list.offsetHeight

                if (t > h) {
                    irecite_word_list.scrollTop = t - h
                } else {
                    irecite_word_list.scrollTop = 0
                }
            })
        },
        getWord(index) {
            this.reciteIndex = index
            this.value = this.reciteWordList[this.reciteIndex].word
            this.textFn()
            this.search()
            this.scroll()
        },
        nextWord() {
            let index = ++this.reciteIndex

            this.reciteIndex = index > this.reciteWordList.length - 1 ? 0 : index
            this.value = this.reciteWordList[this.reciteIndex].word
            this.textFn()
            this.search()
            this.scroll()
        },
        textFn() {
            this.textValue = ""
        },
        prevGroup() {
            if (!this.skip) return
            --this.skip
            this.skip = this.skip < 0 ? 0 : this.skip
            this.getReciteList()
        },
        nextGroup() {
            ++this.skip
            this.getReciteList()
        },
        getReciteList() {
            axios.get("/recite_list", {
                params: {
                    limit: this.radioValue,
                    skip: this.skip
                }
            }).then(result => {
                this.reciteIndex = 0
                this.reciteWordList = result.data.result
                this.value = this.reciteWordList[this.reciteIndex].word
                this.search()
            })
        },
        radioFn(nums, change) {
            
            axios.post("/recite/infoSave", {
                limit: nums,
                skip: this.skip
            }).then(result => {
                if (result.data.code == 1) {
                    this.radioValue = nums
                    this.getReciteList()
                }
            })
        },
        alertBoxCallBack(bool) {
            if (bool) {
                location.href = "/admin/login_register?url=" + location.href
            } else {
                this.alertBoxStatus = false
                this.alertBoxText = ""
            }
        },
        tabsFn(arg) {
            if (arg) {
                axios.get("/recite/info").then(result => {
                    let data = result.data

                    if (data.code == 0) {
                        this.alertBoxStatus = true
                        this.alertBoxText = "请先登录!"
                        this.showStatus = true
                        return
                    }
                    this.radioValue = (data.result && data.result.limit) || 10
                    this.skip = (data.result && data.result.skip) || 0
                    this.getReciteList()
                    this.showStatus = !arg
                })
            } else {
                this.value = ""
                this.docs = []
                this.exchange = {}
                this.voice = {}
                this.showStatus = !arg
            }
        },
        focusFn() {
            try {
                this.$refs.refValue.select()
            } catch (e) { }
        },
        blurFn() {
            if (this.ua.mobile) {
                this.search()
            }
        },
        playFn(str) {
            let refs = this.$refs
            if (str === "en") {
                refs.audio_en.play()
            } else if (str === "am") {
                refs.audio_am.play()
            }
        },
        tipFn() {
            this.tip = true
            cookie.set("tip", true, 0.5)
        },
        search() {
            if (this.value == "") return

            let _temp = this.temp[this.value]

            if (_temp) {
                this.docs = _temp.docs
                this.exchange = _temp.exchange
                this.voice = _temp.voice
                return
            }
            axios.post("/word", {
                value: this.value.trim()
            }).then(data => {
                let d = data.data
                if (d.length) {
                    d = d[0]
                    this.docs = d.docs
                    this.exchange = d.exchange
                    this.voice = d.voice
                    this.empty = ""
                    this.temp[this.value] = {
                        docs: this.docs,
                        exchange: this.exchange,
                        voice: this.voice
                    }
                } else {
                    this.docs = []
                    this.exchange = {}
                    this.voice = {}
                    this.empty = "查找无结果~"
                }
            })
        }
    },
    mounted() {
        let refs = this.$refs

        window.addEventListener("keyup", e => {
            let kc = e.keyCode
            if (kc === 113) {
                if (this.voice && this.voice.ph_en_mp3) {
                    refs.audio_en.play()
                }
            } else if (kc === 115) {
                if (this.voice && this.voice.ph_am_mp3) {
                    refs.audio_am.play()
                }
            } else if (kc == 39 || kc == 40) {
                this.nextWord()
            }
        })

        refs.audio_en.addEventListener("play", () => {
            this.enStatus = true
        })
        refs.audio_en.addEventListener("ended", () => {
            this.enStatus = false
        })

        refs.audio_am.addEventListener("play", () => {
            this.amStatus = true
        })
        refs.audio_am.addEventListener("ended", () => {
            this.amStatus = false
        })
    }
}
</script>