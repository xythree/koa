
<template>
    <div class="icontent">
        <div class="ihead clearfix" ref="ihead">
            <div class="ilogo">
                <a href="/"></a>
            </div>
            <div class="isearch_box">
                <div class="isearch_input">
                    <span @click="getSongList"></span>
                    <input type="text" @keyup.enter="search" v-model="searchVal" />
                </div>
            </div>
        </div>
        <div class="ibody" ref="ibody">
            <div class="ileft">
                <ul class="ileft_list">
                    <li class="irecord" :class="{'action': playListShow}" @click="showRecord">
                        <span></span>播放记录</li>
                </ul>                
                <div class="ps">
                    数据来源:<br />
                    <a target="_blank" href="https://api.imjad.cn/cloudmusic/index.html">https://api.imjad.cn/cloudmusic/index.html</a>
                </div>
                <div class="isentence">{{sentence}}</div>
            </div>
            <div class="icenter">
                <div class="isong_list_box iplay_list_box " v-show="playListShow">
                    <div class="isong_list_content" ref="iplay_list_content">
                        <ul class="isong_title" v-show="playList.length">
                            <li>歌曲</li>
                            <li>演唱者</li>
                            <li>专辑</li>
                        </ul>
                        <div v-show="!playList.length">空~</div>
                        <ol class="isong_list">
                            <li v-for="(item, index) in playList" :class="{'action': index == playListIndex && playStatus}">
                                <p>
                                    {{index + 1}}.
                                    <a @click="play(item)" href="javascript:;">{{item.name}}</a>
                                </p>
                                <p>{{item.ar[0].name}}</p>
                                <p>{{item.al.name}}</p>
                            </li>
                        </ol>
                    </div>
                </div>
                <div class="isong_list_box" v-show="songListShow">
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
                                <p>{{item.ar[0].name}}</p>
                                <p>{{item.al.name}}</p>
                            </li>
                        </ol>
                    </div>
                    <pagination_box :total="total" :paginationCallBack="paginationCallBack"></pagination_box>
                </div>
            </div>
            <div class="iright">
                <div class="ilyric_box">
                    <img v-show="playSong.al && playSong.al.picUrl" :src="playSong.al && playSong.al.picUrl" />
                    <div class="ilyric" ref="ilyric" v-html="lyricHtml"></div>
                </div>
            </div>
        </div>
        <div class="ifoot" ref="ifoot">
            <div class="imgBg" v-show="playSong.al && playSong.al.picUrl">
                <img :src="playSong.al && playSong.al.picUrl" />
            </div>
            <audio ref="audio" autoplay :loop="condIconIndex == 0" :src="song.url"></audio>
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
                        <em :style="{'width': setSongProcess}">
                            <b></b>
                        </em>
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
                        <em :style="{'width': volumeVal}">
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
        let temp = ["遇见", "没那么简单", "情非得已", "回梦游仙"]
        return {
            hostname: "https://api.imjad.cn/cloudmusic/", //https://api.imjad.cn/cloudmusic/index.html
            searchVal: temp[Math.round(Math.random() * (temp.length - 1))],
            songList: [],
            playList: (localStorage.playList && JSON.parse(localStorage.playList)) || [],
            playListIndex: 0,
            playListShow: false,
            playSong: {},
            song: {},
            songListShow: true,
            playStatus: false,
            playend: false,
            lyricHtml: "",
            lyricItem: [],
            timerScroll: "",
            total: 0,
            offset: 0,
            limit: 15,
            audioCurrentTime: 0,
            audioDuration: 0,
            setSongProcess: 0,
            tempVolume: 1,
            muted: false,
            volumeVal: "100%",
            condIconIndex: localStorage.condIconIndex || 0,
            condIcon: [
                { text: "单曲循环", type: "icondSingle" },
                { text: "随机播放", type: "icondRandom" },
                { text: "列表循环", type: "icondList" }
            ],
            sentence: ""
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
        showRecord() {
            this.playListShow = !this.playListShow
            this.songListShow = !this.songListShow
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
        setVolume() {
            let audio = this.$refs.audio

            if (this.muted) {
                audio.volume = this.tempVolume
                this.tempVolume = 0
                this.muted = false
            } else {
                this.tempVolume = audio.volume
                audio.volume = 0
                this.muted = true
            }
            this.setVolumeVal(audio.volume)
        },
        setVolumeVal(num) {
            this.volumeVal = num * 100 + "%"
        },
        zerofill(num) {
            return num < 10 ? "0" + +num : num
        },
        songProcess() {
            return (this.audioCurrentTime / this.audioDuration) * this.$refs.isong_process.offsetWidth || 0
        },
        paginationCallBack(ind) {
            if (this.searchVal != "") {
                this.offset = ind - 1
                this.getSongList()
            }
        },
        ready() {
            let refs = this.$refs
            let h = window.innerHeight - refs.ihead.offsetHeight - refs.ifoot.offsetHeight

            refs.ilyric.style.height = h - 290 + "px"
            refs.isong_list_content.style.maxHeight = h - 100 + "px"
            refs.iplay_list_content.style.maxHeight = h - 100 + "px"
            refs.ibody.style.height = Math.max(h, 600) + "px"
        },
        search() {
            if (this.searchVal == "") return
            this.offset = 0
            this.songListShow = true
            this.playListShow = false
            this.getSongList()
        },
        getSongList(searchVal, offset, limit) {
            axios.get(this.hostname, {
                params: {
                    type: "search",
                    s: searchVal || this.searchVal,
                    offset: offset || this.offset,
                    limit: limit || this.limit
                }
            }).then(result => {
                this.total = result.data.result.songCount
                this.songList = result.data.result.songs || []
            })
        },
        getLyric() {
            axios.get(this.hostname, {
                params: {
                    type: "lyric",
                    id: this.playSong.id
                }
            }).then(result => {
                this.lyricHtml = this.lyricFormat(result.data)
                this.scrollAni(this.$refs.ilyric, 0)
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
                this.getLyric()
            })

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
            if (!this.playList.length) return
            this.playListIndex = --this.playListIndex < 0 ? this.playList.length - 1 : this.playListIndex
            this.prevNext()
        },
        next() {
            if (!this.playList.length) return
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
        scrollAni(obj, val, time = 10) {
            clearTimeout(this.timerScroll)
            this.timerScroll = setTimeout(() => {
                if (obj.scrollTop != val) {
                    if (obj.scrollTop < val) {
                        obj.scrollTop += 1
                    } else if (obj.scrollTop > val) {
                        obj.scrollTop -= 1
                    }
                    this.scrollAni(obj, val)
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
            this.playStatus = true
            this.playend = false
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

            let condIcon = this.condIcon[this.condIconIndex]
            
            if (condIcon.type == "icondRandom") {
                this.randomPlay()
            } else if (condIcon.type == "icondList") {
                this.next()
            }
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


        axios.get("/json/sentence.json").then(result => {
            let r = result.data.sentence

            this.sentence = r[Math.round(Math.random() * r.length) - 1]
        })
    }
}    
</script>