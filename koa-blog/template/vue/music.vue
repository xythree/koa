
<template>
    <div class="icontent">
        <div class="ihead clearfix" ref="ihead">
            <div class="ilogo">
                <a href="/"></a>
            </div>
            <div class="isearch_box">
                <div class="isearch_input">
                    <span></span>
                    <input type="text" @keyup.enter="getSongList" v-model="searchVal" />
                </div>
            </div>
        </div>
        <div class="ibody" ref="ibody">
            <div class="ileft"></div>
            <div class="icenter">
    
                <div class="isong_list_box">
                    <div class="isong_list_content" ref="isong_list_content">
                        <ul class="isong_title" v-show="songList.length">
                            <li>歌曲</li>
                            <li>演唱者</li>
                            <li>专辑</li>
                        </ul>
                        <ol class="isong_list">
                            <li v-for="(item, index) in songList">
                                <p>
                                    {{index + 1}}.
                                    <a @click="play(item)" href="javascript:;">{{item.name}}</a>
                                </p>
                                <p>{{item.artists[0].name}}</p>
                                <p>{{item.album.name}}</p>
                            </li>
                        </ol>
                    </div>
                    <pagination_box :total="total" :paginationCallBack="paginationCallBack"></pagination_box>
                </div>
            </div>
            <div class="iright">
                <div class="ilyric_box">
                    <img v-show="playSong.album && playSong.album.picUrl" :src="playSong.album && playSong.album.picUrl" />
                    <div class="ilyric" ref="ilyric" v-html="lyricHtml"></div>
                </div>
            </div>
        </div>
        <div class="ifoot" ref="ifoot">
            <audio ref="audio" autoplay :src="playSong.mp3Url"></audio>
            <div class="icontroll">
                <div class="icontroll_btn iprev"></div>
                <div @click="toggle" class="icontroll_btn iplay" :class="{'istop': playStatus}"></div>
                <div class="icontroll_btn inext"></div>
                <div class="icontroll_btn icondition"></div>
            </div>
            <div class="iprocess">
                <div class="isong_title">{{playSong.name}} {{playSong.name ? "-" : ""}} {{playSong.artists && playSong.artists[0].name}} </div>
                <div class="isong_process_box">
                    <div class="isong_start_time">{{audioCurrentTime|timeFormat}}</div>
                    <div class="isong_process" ref="isong_process">
                        <em :style="{'width': setSongProcess}">
                            <b></b>
                        </em>
                    </div>
                    <div class="isong_end_time">{{audioDuration|timeFormat}}</div>
                </div>
            </div>
            <div class="ivolume">
                <div class="iplayListIcon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="ivolume_controll">
                    <div @click="setVolume" class="ivolume_btn" :class="{'muted': muted}"></div>
                    <div class="ivolume_process">
                        <em>
                            <b></b>
                        </em>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import pagination_box from "./../../vue_component/pagination/pagination.vue"
export default {
    data() {
        return {
            searchVal: "",
            songList: [],
            playList: [],
            playSong: {},
            playStatus: false,
            playend: false,
            lyricHtml: "",
            lyricItem: [],
            timerScroll: "",
            total: 0,
            offset: 0,
            audioCurrentTime: 0,
            audioDuration: 0,
            setSongProcess: 0,
            tempVolume: 0,
            muted: false
        }
    },
    components: {
        pagination_box
    },
    computed: {

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
        setVolume() {
            let audio = this.$refs.audio
            if (this.muted) {
                this.tempVolume = 0
                audio.volume = this.tempVolume
                this.muted = false
            } else {
                this.tempVolume = audio.volume
                audio.volume = 0
                this.muted = true
            }
        },
        zerofill(num) {
            return num < 10 ? "0" + +num : num
        },
        songProcess() {
            return (this.audioCurrentTime / this.audioDuration) * this.$refs.isong_process.offsetWidth || 0
        },
        paginationCallBack(ind) {
            this.offset = ind
            this.getSongList()
        },
        ready() {
            let refs = this.$refs
            let h = window.innerHeight - refs.ihead.offsetHeight - refs.ifoot.offsetHeight

            refs.ilyric.style.height = h - 290 + "px"
            refs.isong_list_content.style.maxHeight = h - 100 + "px"
            refs.ibody.style.height = Math.max(h, 600) + "px"
        },
        getSongList() {
            axios.post("/music/search", {
                s: this.searchVal,
                offset: this.offset
            }).then(result => {
                this.total = result.data.result.songCount
                this.songList = result.data.result.songs
            })
        },
        getLyric() {
            axios.get("/music/lyric", {
                params: {
                    id: this.playSong.id
                }
            }).then(result => {
                this.lyricHtml = this.lyricFormat(result.data)
            })
        },
        lyricFormat(data) {
            let lyric = '暂无歌词'
            this.lyricItem = []

            if (!data.nolyric && data.lrc && data.lrc.lyric) {
                lyric = data.lrc.lyric.replace(/\n/g, '</p>').replace(/\[([\d,\.,:]+)\]/g, (a, b) => {
                    const temp = b.split(':')
                    const time = +temp[0] * 60 + +temp[1]
                    this.lyricItem.push(time)
                    return `<p id='lyricId${time}'>`
                })
            }
            return lyric
        },
        play(obj) {
            this.playStatus = true
            this.playSong = obj
            this.playList.push(obj)
            this.getLyric()
        },
        toggle() {
            if (this.playSong.mp3Url) {
                if (this.playStatus) {
                    this.$refs.audio.pause()
                    this.playStatus = false
                } else {
                    this.$refs.audio.play()
                    this.playStatus = true
                }
            }
        },
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
        }
    },
    mounted() {
        this.ready()

        window.addEventListener("resize", this.ready, false)

        let refs = this.$refs,
            audioBox = refs.audio,
            ilyric = refs.ilyric

        audioBox.addEventListener('play', e => {
            if (this.playend) {
                ilyric.scrollTop = 0
            }
            this.audioCurrentTime = refs.audio.currentTime
            this.audioDuration = refs.audio.duration
        })
        audioBox.addEventListener('timeupdate', e => {
            const temp = this.lyricItem

            for (var i = temp.length - 1; i > 0; i--) {
                if (audioBox.currentTime > temp[i]) {
                    this.current = document.getElementById('lyricId' + temp[i])
                    if (this.current.className != 'lyricCurrent') {
                        const t = document.querySelector('.lyricCurrent')
                        t && t.classList.remove('lyricCurrent')
                        this.current.classList.add('lyricCurrent')
                        this.scrollAni(ilyric, this.current.offsetTop - 570)
                    }
                    break
                }
            }
            this.audioCurrentTime = refs.audio.currentTime
            this.setSongProcess = this.songProcess() + "px"
        })
        audioBox.addEventListener('ended', () => {
            this.playStatus = false
            this.playend = true
        })

        let tempClassName = ""
        document.querySelector(".ilogo a").addEventListener("mouseenter", function (e) {
            let _t = this, w = _t.offsetWidth, h = _t.offsetHeight
            let x = (e.pageX - _t.offsetLeft - (w / 2)) * (w > h ? (h / w) : 1)
            let y = (e.pageY - _t.offsetTop - (h / 2)) * (h > w ? (w / h) : 1)
            let direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4
            let dir_name = ["top", "right", "bottom", "left"]

            if (tempClassName) {
                _t.classList.remove(tempClassName)
            }
            tempClassName = dir_name[direction]
            _t.classList.add(tempClassName)
        }, false)
        document.querySelector(".ilogo").addEventListener("mouseleave", function (e) {
            this.getElementsByTagName("a")[0].classList.remove(tempClassName)
        }, false)
    }
}    
</script>