<style lang="sass">
*{margin:0;padding:0;}
.imusic_controll {
     position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    height: 110px;
    background-color: rgba(3, 3, 3, .85);
    border-top: 1px solid #000;
}

$w: 250px;
.icontroll {
    width: $w;
    padding-top: 30px;
    text-align: center;
    .icontroll_btn {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }
    .iplay,
    .iprev,
    .inext {
        margin: 10px;
        width: 30px;
        height: 30px;
        background: url(/images/music/icon.png) no-repeat 0 0;
    }
    .istop {
        background-position: 0 -30px;
    }
    .iprev {
        background-position: 0 -90px;
    }
    .inext {
        background-position: 0 -60px;
    }
    .icondition {
        margin-left: 20px;
        width: 20px;
        height: 18px;
    }
    .icondSingle {
        background: url(/images/music/icon.png) no-repeat 0 -202px;
    }
    .icondRandom {
        background: url(/images/music/icon.png) no-repeat 0 -222px;
    }
    .icondList {
        background: url(/images/music/icon.png) no-repeat 0 -182px;
    }
}

.imgBg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: .1;
    overflow: hidden;
    img {
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        width: 100%;
    }
}

.iprocess {
    flex: 1;
    padding: 10px;
    color: #fff;
    .isong_title {
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
    }
    .isong_process_box {
        display: flex;
        margin-top: 5px;
        .isong_start_time,
        .isong_end_time {
            width: 50px;
            font-size: 12px;
            text-align: center;
        }
        .isong_process {
            flex: 1;
            margin-top: 8px;
            height: 2px;
        }
    }
}

.ivolume {
    position: relative;
    width: $w;
    .ivolume_controll {
        display: flex;
        width: 50%;
        margin: 45px auto;
        .ivolume_btn {
            padding: 0 3px;
            width: 20px;
            height: 16px;
            background: url(/images/music/icon.png) no-repeat 0 -296px;
            cursor: pointer;
        }
        .muted {
            background-position: 0 -314px;
        }
        .ivolume_process {
            flex: 1;
            margin-top: 8px;
            height: 2px;
            background: #666;
            em {
                position: relative;
                left: 0;
                top: 0;
                display: block;
                height: 2px;
                width: 100%;
                background: #fff;
            }
            b {
                position: absolute;
                top: 50%;
                right: -5px;
                width: 10px;
                height: 10px;
                transform: translateY(-50%);
                border-radius: 50%;
                background: #fff;
                cursor: pointer;
            }
        }
    }
}
.iplayListIcon {
    position: absolute;
    top: 40px;
    left: 12px;
    width: 25px;
    cursor: pointer;
    span {
        display: block;
        height: 1px;
        background: #fff;
        margin: 5px 0;
        transition: all .5s;
    }
    &.action {
        span:nth-child(1),
        span:nth-child(4) {
            opacity: 0;
        }
        span:nth-child(2) {
            transform: rotateZ(45deg) translateY(4px);
            transform-origin: center;
            width: 28px;
        }
        span:nth-child(3) {
            transform: rotateZ(-45deg) translateY(-5px);
            transform-origin: center;
            width: 28px;
        }
    }
}
</style>

<template>
    <div class="imusic_controll">
    
        <div class="imgBg" v-show="playSong.al && playSong.al.picUrl">
            <img :src="playSong.al && playSong.al.picUrl" />
        </div>
        <audio ref="audio" :loop="condIconIndex == 0" :src="song.url"></audio>
        <div class="icontroll">
            <div class="icontroll_btn iprev" @click="prev"></div>
            <div @click="toggle" class="icontroll_btn iplay" :class="{'istop': playStatus}"></div>
            <div class="icontroll_btn inext" @click="next"></div>
            <div class="icontroll_btn icondition" @click="condIconFn" :title="condIcon[condIconIndex].text" :class="condIcon[condIconIndex].type"></div>
        </div>
        <div class="iprocess">
            <div class="isong_title">{{playSong.name}} {{playSong.name ? "-" : ""}} {{playSong.ar && playSong.ar[0].name}} </div>
            <div class="isong_process_box">
                <div class="isong_start_time">{{audioCurrentTime|timeFormat}}</div>
                <div class="isong_process" ref="isong_process">
                    <process_box :drag="process_drag" :stop="process_stop" :value="process_value" :config="process_config" :processCallBack="processCallBack"></process_box>
                </div>
                <div class="isong_end_time">{{audioDuration|timeFormat}}</div>
            </div>
        </div>
        <div class="ivolume">
            <div class="iplayListIcon" :title="playListShow ? '关闭' : '播放记录'" :class="{'action': playListShow}" @click="showRecord">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="ivolume_controll">
                <div @click="setVolume" class="ivolume_btn" :class="{'muted': muted}"></div>
                <div class="ivolume_process">
                    <process_box :drag="true" :value="process_volume_value" :config="process_config" :processCallBack="processVolumeCallBack"></process_box>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import process_box from "./../../../vue_component/process_box/process_box.vue"

export default {
    data() {
        return {
            hostname: "/cloudmusic/api",
            playList: (localStorage.playList && JSON.parse(localStorage.playList)) || [],
            playListIndex: 0,
            song: {},
            playSong: {},
            playStatus: false,
            playend: false,
            audioCurrentTime: 0,
            audioDuration: 0,
            condIconIndex: localStorage.condIconIndex || 0,
            condIcon: [
                { text: "单曲循环", type: "icondSingle" },
                { text: "随机播放", type: "icondRandom" },
                { text: "列表循环", type: "icondList" }
            ],
            muted: false,
            process_config: {
                c1: "#666",
                c2: "#fff",
                c3: "#fff"
            },
            process_drag: false,
            process_volume_value: 1,
            process_timer: "",
            process_stop: false
        }
    },
    computed: {
        process_value() {
            return this.audioCurrentTime / this.audioDuration || 0
        }
    },
    components: {
        process_box
    },
    filters: {
        timeFormat(data) {
            function zerofill(num) {
                return num < 10 ? "0" + +num : num
            }
            if (data) {
                let time = (data / 60).toFixed(2)
                let temp = time.split('.')

                temp[0] = zerofill(temp[0])
                temp[1] = zerofill(Math.ceil(+("0." + temp[1]) * 59))

                return temp.join(':')
            } else {
                return '00:00'
            }
        }
    },
    methods: {
        processVolumeCallBack(n) {
            if (n <= 0) {
                this.muted = true
            } else {
                this.muted = false
            }
            this.$refs.audio.volume = n
        },
        processCallBack(n, flag) {
            if (flag) {
                this.process_stop = true
                clearTimeout(this.process_timer)
                this.process_timer = setTimeout(() => {
                    this.process_stop = false
                    this.$refs.audio.currentTime = n * this.audioDuration
                }, 250)
            }
        },
        setVolume() {
            let audio = this.$refs.audio

            if (this.muted) {
                audio.volume = this.tempVolume
                this.process_volume_value = this.tempVolume
                this.tempVolume = 0
                this.muted = false
            } else {
                this.tempVolume = audio.volume
                audio.volume = 0
                this.process_volume_value = 0
                this.muted = true
            }
        },
        showRecord() {

        },
        condIconFn() {
            this.condIconIndex = ++this.condIconIndex > this.condIcon.length - 1 ? 0 : this.condIconIndex
            if (this.condIcon[this.condIconIndex].type == "icondSingle") {
                this.$refs.audio.loop = true
            } else {
                this.$refs.audio.loop = false
            }
            localStorage.condIconIndex = this.condIconIndex
        },
        play(obj) {

            if (this.playSong && obj.id != this.playSong.id) {
                this.playStatus = false
                this.playSong = obj
                this.playList.push(obj)
                this.playList = [...new Set([...this.playList])]
                this.playList.forEach((t, i) => {
                    if (t.id == obj.id) {
                        this.playListIndex = i
                    }
                })

                localStorage.playList = JSON.stringify(this.playList)

                axios.get(this.hostname, {
                    params: {
                        type: "id",
                        id: this.playSong.id
                    }
                }).then(result => {
                    this.song = result.data.data[0]
                    this.$nextTick(() => {
                        this.toggle()
                    })
                })
            } else {
                this.toggle()
            }
        },
        toggle() {
            if (this.song.url) {
                if (this.playStatus) {
                    this.$refs.audio.pause()
                    this.playStatus = false
                } else {
                    this.$refs.audio.play()
                    this.playStatus = true
                }
            } else if (this.playList.length) {
                this.randomPlay()
            }
        },
        prev() {
            if (this.playList.length <= 1) return
            this.playListIndex = --this.playListIndex < 0 ? this.playList.length - 1 : this.playListIndex
            this.prevNext()
        },
        next() {
            if (this.playList.length <= 1) return
            this.playListIndex = ++this.playListIndex > this.playList.length - 1 ? 0 : this.playListIndex
            this.prevNext()
        },
        prevNext() {
            this.play(this.playList[this.playListIndex])
        },
        randomPlay() {
            this.playListIndex = Math.round(Math.random() * (this.playList.length - 1))
            this.prevNext()
        },
        init() {
            let refs = this.$refs
            let audioBox = refs.audio

            audioBox.addEventListener('play', e => {
                this.process_drag = true
                this.playStatus = true
                this.playend = false
                this.audioCurrentTime = audioBox.currentTime
            })
            audioBox.addEventListener("durationchange", () => {
                this.audioDuration = audioBox.duration
            })
            audioBox.addEventListener('timeupdate', e => {
                this.audioCurrentTime = audioBox.currentTime
            })
            audioBox.addEventListener('ended', () => {
                let condIcon = this.condIcon[this.condIconIndex]

                this.playStatus = false
                this.playend = true
                this.process_drag = false

                if (condIcon.type == "icondRandom") {
                    this.randomPlay()
                } else if (condIcon.type == "icondList") {
                    this.next()
                }
            })
        }
    },
    mounted() {
        this.init()
    }
}

</script>

