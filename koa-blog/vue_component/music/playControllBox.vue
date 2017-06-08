<style lang="sass">


</style>

<template>
    <div class="playControllBox" :class="{playStatus: this.playStatus}" ref="playControllBox">
        <div class="playControllTitleBox">
            <p>{{songsInfo.name}}</p>
            <p>{{songsInfo.artists && songsInfo.artists[0].name}}</p>
        </div>
        <div ref="playControllBoxTop" class="playControllBoxTop">
            <ul class="audioTimeBox">
                <li class="audioLine" ref="audioLine" :style="{width: audioLineWidth}"></li>
                <li class="audioBtn" ref="audioBtn" :style="{left: audioBtnLeft}"></li>
                <li class="audioCurrentTime">{{audioCurrentTime}}</li>
                <li class="audioDuration">{{audioDuration}}</li>
            </ul>
        </div>
        <div class="playControllBoxLeft">
            <div class="cond_icon" :class="condIcon[condIconIndex].type" @click="condIconFn">&nbsp;
                <transition name="fade">
                    <span v-if="show">{{condIcon[condIconIndex].text}}</span>
                </transition>
            </div>
        </div>
        <div class="playControllBoxCenter">
            <div class="audioPrevBtn" @click="prev"></div>
            <div class="audioPlayBtn" @click="audioPlayBtn"></div>
            <div class="audioNextBtn" @click="next"></div>
        </div>
        <div class="playControllBoxRight">
            <play_list_btn></play_list_btn>
        </div>
    </div>
</template>

<script>
import play_list_btn from "./playListBtn.vue"

export default {
    components: {
        play_list_btn
    },
    data() {
        return {
            condIcon: [
                { text: "单曲循环", type: "condSingle" },
                { text: "随机播放", type: "condRandom" },
                { text: "列表循环", type: "condList" }
            ],
            show: false,
            timer: "",
            condIconIndex: 0,
            radius: 0
        }
    },
    computed: {
        songsInfo() {
            return ""//this.$store.state.songsInfo
        },
        playStatus() {
            return false //this.$store.state.playStatus
        },
        val() {
            const _state = this.$store.state
            return (_state.audioCurrentTime / _state.audioDuration) * this.width || 0
        },
        audioLineWidth() {
            return this.val + 'px'
        },
        audioBtnLeft() {
            return -this.radius + this.val + 'px'
        },
        audioCurrentTime() {
            return this.timeFormat(this.$store.state.audioCurrentTime)
        },
        audioDuration() {
            return this.timeFormat(this.$store.state.audioDuration)
        }
    },
    mounted() {
        const ref = this.$refs
        this.radius = ref.audioBtn.offsetWidth / 2
        this.width = ref.playControllBoxTop.offsetWidth
    },
    methods: {
        condIconFn() {
            clearTimeout(this.timer)
            this.condIconIndex = this.condIconIndex >= this.condIcon.length - 1 ? 0 : ++this.condIconIndex
            this.show = true
            this.timer = setTimeout(() => {
                this.show = false
            }, 1500)
        },
        prev() {
            const _state = this.$store.state
            const playList = _state.playList
            let index = _state.playListIndex

            if (!playList.length) return
            if (playList.length == 1) {
                return
            } else {
                index = index == 0 ? playList.length - 1 : --index
            }
            this.toggle(index)
        },
        next() {
            const _state = this.$store.state
            const playList = _state.playList
            let index = _state.playListIndex

            if (!playList.length) return
            if (playList.length == 1) {
                return
            } else {
                index = index >= playList.length - 1 ? 0 : ++index
            }
            this.toggle(index)
        },
        toggle(index) {
            const _store = this.$store

            if (_store.state.playStatus) {
                _store.dispatch("playToggle")
            }
            _store.dispatch("setPlayListIndex", index)
            _store.dispatch("getSong", _store.state.playList[index])
        },
        audioPlayBtn() {
            const _store = this.$store

            if (_store.state.playStatus) {
                _store.dispatch("playToggle")
            } else {
                if (_store.state.playList.length) {
                    _store.dispatch("getSong", _store.state.playList[this.index])
                }
            }
        },
        zerofill(num) {
            return num < 10 ? "0" + +num : num
        },
        timeFormat(data) {
            if (data) {
                let time = (data / 60).toFixed(2)
                let temp = time.split('.')

                temp[0] = this.zerofill(temp[0])
                temp[1] = this.zerofill(Math.ceil(+("0." + temp[1]) * 59))

                return temp.join(':')
            } else {
                return '00:00'
            }
        }
    }
} 
</script>

