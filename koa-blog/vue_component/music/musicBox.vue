<style lang="sass">

</style>

<template>
    <div class='musicBox' :class='{openMusicBoxStatus: openMusicBoxStatus}'>
        <img class='musicBg' :src='info.album && info.album.picUrl' />
        <div class='opacityBg'></div>
        <div class='playBtnBox'>
            <div :class='{playStatus: playStatus}' class='disc'>
                <div class='musicBoxImg'>
                    <img :style='imgRotate' :src='info.album && info.album.picUrl' />
                </div>
                <div class='needle'></div>
                <div class='playBtn' @click='toggle'></div>
            </div>
        </div>
        <audio style='display:none;' ref='audioBox' :src='info.mp3Url'></audio>
        <span @click='closeMusicBox' class='closeMusicBox'>X</span>
        <div id='lyricBox' ref='lyricBox' class='lyricBox' v-html='lyric'></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            playend: false,
            current: '',
            timerPlay: "",
            timerRotate: '',
            timerScroll: '',
            rotateZ: 0,
            audioBox: ''
        }
    },
    computed: {
        condIconIndex() {
            return this.$store.state.condIconIndex
        },
        condIcon() {
            return this.$store.state.condIcon
        },
        playStatus() {
            return this.$store.state.playStatus
        },
        openMusicBoxStatus() {
            return this.$store.state.openMusicBoxStatus
        },
        closeMusicBoxStatus() {
            return this.$store.state.closeMusicBoxStatus
        },
        imgRotate() {
            return {
                transform: `rotateZ(${this.rotateZ}deg)`
            }
        },
        info() {
            return this.$store.state.songsInfo
        },
        lyric() {
            return this.$store.state.lyric
        }
    },
    mounted() {
        const audioBox = this.$refs.audioBox
        const lyricBox = this.$refs.lyricBox

        this.$store.dispatch('setPlayToggleFn', this.toggle)

        audioBox.addEventListener('play', e => {
            if (this.playend) {
                lyricBox.scrollTop = 0
            }
            this.playend = false
        })
        audioBox.addEventListener('loadstart', e => {
            this.current = ''
        })
        audioBox.addEventListener('durationchange', e => {
            this.$store.dispatch('setAudioDuration', audioBox.duration)
        })
        audioBox.addEventListener('timeupdate', e => {
            const temp = this.$store.state.lyricItem
            for (var i = temp.length - 1; i > 0; i--) {
                if (audioBox.currentTime > temp[i]) {
                    this.current = document.getElementById('lyricId' + temp[i])
                    if (this.current.className != 'lyricCurrent') {
                        const t = document.querySelector('.lyricCurrent')
                        t && t.classList.remove('lyricCurrent')
                        this.current.classList.add('lyricCurrent')
                        this.scrollAni(lyricBox, this.current.offsetTop - 100)
                    }
                    break
                }
            }
            this.$store.dispatch('setAudioCurrentTime', audioBox.currentTime)
        })
        audioBox.addEventListener('ended', () => {
            const _store = this.$store
            const type = this.condIcon[this.condIconIndex].type
            const playList = _store.state.playList

            this.playend = true
            _store.dispatch('setPlayStatus', false)
            clearTimeout(this.timerScroll)
            clearTimeout(this.timerRotate)

            if (type == "condSingle") {
                this.toggle()
            } else if (type == "condRandom") {
                const rd = Math.floor(Math.random() * playList.length)

                _store.dispatch("songsInfo", playList[rd])
            } else if (type == "condList") {
                let index = _store.state.playListIndex

                index = index >= playList.length - 1 ? 0 : ++index
                _store.dispatch("setPlayListIndex", index)
                _store.dispatch("songsInfo", playList[index])
            }

        })
    },
    methods: {
        scrollAni(obj, val, time = 10) {
            clearTimeout(this.timerScroll)
            this.timerScroll = setInterval(() => {
                if (obj.scrollTop != val) {
                    if (obj.scrollTop < val) {
                        obj.scrollTop += 1
                    } else if (obj.scrollTop > val) {
                        obj.scrollTop -= 1
                    }
                }
            }, time)
        },
        closeMusicBox() {
            this.$store.dispatch('setMusicBoxStatus', false)
        },
        play() {
            this.$refs.audioBox.play()
            this.$store.dispatch('setPlayStatus', true)
        },
        pause() {
            this.$refs.audioBox.pause()
            this.$store.dispatch('setPlayStatus', false)
        },
        toggle() {
            const _store = this.$store
            const _state = _store.state

            if (!_state.songsInfo.id) {
                if (!_state.playList.length) {
                    return
                } else {
                    _store.dispatch('songsInfo', _state.playList[0])
                }
            } else {
                setTimeout(() => {
                    if (!this.playStatus) {
                        this.play()

                    } else {
                        this.pause()
                    }
                    this.imgRotateFn()
                }, 100)
            }

        },
        imgRotateFn() {
            clearTimeout(this.timerRotate)
            this.timerRotate = setTimeout(() => {
                this.rotateZ += 1
                if (this.playStatus) {
                    this.imgRotateFn()
                }
            }, 19)
        }
    }
}
</script>

