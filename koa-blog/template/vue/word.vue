
<template>
    <div class="iword">
    
        <transition name="fade">
            <div class="itip" v-show="!tip">
                本功能主要用于MongoDB练习，单词量为135,115
                <a href="javascript:;" @click="tipFn">X</a>
            </div>
        </transition>
    
        <input type="text" class="value" ref="refValue" placeholder="输入要查询的英文单词" @keyup.enter="search" @focus="focusFn" @blur="search" v-model="value" />
    
        <div class="ibox">
            {{empty}}
            <transition name="fade">
                <div v-show="docs.length">
                    <div class="iphonogram">
                        英:[{{(this.voice && this.voice.ph_en)|wordFormat}}]
                        <audio preload ref="audio_en" :src="this.voice && this.voice.ph_en_mp3"></audio>
                        <span v-show="this.voice && this.voice.ph_en_mp3" @click="playFn('en')" class="iauido_controls" :class="{'istop': enStatus}"></span>
                        <div v-show="!ua.mobile">
                            <p v-show="this.voice && this.voice.ph_en_mp3">按
                                <b>F2</b>可发英音</p>
                        </div>
                    </div>
                    <div class="iphonogram">
                        美:[{{(this.voice && this.voice.ph_am)|wordFormat}}]
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
                            <p>{{item.means|wordFormat}}</p>
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
    
    </div>
</template>

<script>
import axios from "axios"
import { cookie } from "./../../static/js/cookie"
import { ua } from "./../../static/js/xythree"

export default {
    data() {
        return {
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
    filters: {
        getPos(value) {
            let result = ""

            pos.forEach((t, i) => {
                if (t.id == value) {
                    result = t.means + " ( " + t.name + " ):"
                }
            })
            return result
        },
        wordFormat(value) {
            return value && unescape(value.replace(/\u/g, "%u").replace(/\"/g, ""))
        }
    },
    methods: {
        focusFn() {
            try {
                this.$refs.refValue.select()
            } catch(e) {}
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

            axios.post("/word", {
                value: this.value
            }).then(data => {
                let d = data.data
                if (d.length) {
                    d = d[0]
                    this.docs = d.docs
                    this.exchange = JSON.parse(d.exchange)
                    this.voice = JSON.parse(d.voice)
                    this.empty = ""
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
            if (e.keyCode === 113) {
                if (this.voice && this.voice.ph_en_mp3) {
                    refs.audio_en.play()
                }
            } else if (e.keyCode === 115) {
                if (this.voice && this.voice.ph_am_mp3) {
                    refs.audio_am.play()
                }
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