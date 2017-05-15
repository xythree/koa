const store = new Vuex.Store({
    state: {
        loadBoxStatue: false,
        songsInfo: {},
        lyric: '',
        lyricItem: [],
        openMusicBoxStatus: false,
        playList: [],
        offset: 0,
        searchVal: '',
        selectVal: 1,
        groceryList: [],
        playToggleFn: '',
        playStatus: false,
        showPage: false,
        playListStatus: false,
        audioCurrentTime: '',
        audioDuration: ''
    },
    mutations: {

    },
    getters: {

    },
    actions: {
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
        search({ state, dispatch }) {
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
        playToggle({ state }) {
            state.playToggleFn && state.playToggleFn()
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
        getSong({ commit, dispatch }, id) {
            dispatch('setLoadBoxStatue', true)
            axios.get(`/music/detail?id=${id}`).then(d => {
                const data = d.data
                if (data.code == 200) {
                    dispatch('songsInfo', data.songs[0])
                }
                dispatch('setLoadBoxStatue', false)
            })
            axios.get(`/music/lyric?id=${id}`).then(d => {
                const data = d.data
                if (data.code == 200) {
                    dispatch('lyric', data)
                }
            })
        },
        songsInfo({ state, dispatch }, data) {
            //data.mp3Url = '/3374401185703022.mp3'
            state.songsInfo = data
            dispatch('playToggle')
        },
        lyric({ state }, data) {
            let lyric = '暂无歌词'
            state.lyricItem = []
            if (!data.nolyric && data.lrc && data.lrc.lyric) {
                lyric = data.lrc.lyric.replace(/\n/g, '</p>').replace(/\[([\d,\.,:]+)\]/g, function(a, b) {
                    const temp = b.split(':')
                    const time = +temp[0] * 60 + +temp[1]
                    state.lyricItem.push(time)
                    return `<p id='lyricId${time}'>`
                })
            }
            state.lyric = lyric
        },
        setAudioCurrentTime({ state }, data) {
            state.audioCurrentTime = data
        },
        setAudioDuration({ state }, data) {
            state.audioDuration = data
        }
    }
})

Vue.component('play-list-btn', {
    computed: {
        playListShow() {
            return this.$store.state.playListStatus
        }
    },
    template: '<div class="playListIcon" :class="{playListShow: playListShow}" @click="toggle"><span></span><span></span><span></span></div>',
    methods: {
        toggle() {
            const _store = this.$store
            _store.dispatch('setPlayListStatus', !_store.state.playListStatus)
        }
    }
})

Vue.component('play-list', {
    computed: {
        playListStatus() {
            return this.$store.state.playListStatus
        },
        playList() {
            return this.$store.state.playList
        }
    },
    template: '<div class="playListBox" v-show="playListStatus"><h5>播放列表:</h5><div class="scrollBox"><ol class="listBox"><list-box v-for="item in playList" :todo="item"></list-box></ol></div></div>',
    methods: {
        getSong(item) {
            this.$store.dispatch('getSong', item.id)
        }
    }
})

Vue.component('play-controll-box', {
    data() {
        return {
            radius: 0
        }
    },
    computed: {
        playStatus() {
            return this.$store.state.playStatus
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
    template: '<div class="playControllBox" :class="{playStatus: this.playStatus}" ref="playControllBox"><div ref="playControllBoxTop" class="playControllBoxTop"><ul class="audioTimeBox"><li class="audioLine" ref="audioLine" :style="{width: audioLineWidth}"></li><li class="audioBtn" ref="audioBtn" :style="{left: audioBtnLeft}"></li><li class="audioCurrentTime">{{audioCurrentTime}}</li><li class="audioDuration">{{audioDuration}}</li></ul></div><div class="playControllBoxLeft">&nbsp;</div><div class="playControllBoxCenter"><div class="audioPrevBtn"></div><div class="audioPlayBtn" @click="audioPlayBtn"></div><div class="audioNextBtn"></div></div><div class="playControllBoxRight"><play-list-btn></play-list-btn></div></div>',
    mounted() {
        const ref = this.$refs
        this.radius = ref.audioBtn.offsetWidth / 2
        this.width = ref.playControllBoxTop.offsetWidth
    },
    methods: {
        audioPlayBtn() {
            this.$store.dispatch('playToggle')
        },
        timeFormat(data) {
            if (data) {
                let time = (data / 60).toFixed(2)
                let temp = time.split('.')

                temp[0] = temp[0] < 10 ? '0' + temp[0] : temp[0]
                return temp.join(':')
            } else {
                return '00:00'
            }
        }
    }
})

Vue.component('music-box', {
    data() {
        return {
            playend: false,
            current: '',
            timerRotate: '',
            timerScroll: '',
            rotateZ: 0,
            audioBox: ''
        }
    },
    computed: {
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
    template: "<div class='musicBox' :class='{openMusicBoxStatus: openMusicBoxStatus}'><img class='musicBg' :src='info.album && info.album.picUrl'/><div class='opacityBg'></div><div class='playBtnBox'><div :class='{playStatus: playStatus}' class='disc'><div class='musicBoxImg'><img :style='imgRotate' :src='info.album && info.album.picUrl'/></div><div class='needle'></div><div class='playBtn' @click='toggle'></div></div></div><audio style='display:none;' ref='audioBox' :src='info.mp3Url'></audio><span @click='closeMusicBox' class='closeMusicBox'>X</span><div id='lyricBox' ref='lyricBox' class='lyricBox' v-html='lyric'></div></div>",
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
            this.playend = true
            this.$store.dispatch('setPlayStatus', false)
            clearTimeout(this.timerScroll)
            clearTimeout(this.timerRotate)
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
            // this.$refs.audioBox.pause()
            // this.$store.dispatch("setPlayStatus", false)
            this.$store.dispatch('setMusicBoxStatus', false)
                // this.rotateZ = 0
        },
        toggle() {
            const audioBox = this.$refs.audioBox
            setTimeout(() => {
                if (!audioBox.currentSrc) return
                if (!this.playStatus) {
                    audioBox.play()
                    this.$store.dispatch('setPlayStatus', true)
                } else {
                    audioBox.pause()
                    this.$store.dispatch('setPlayStatus', false)
                }
                this.imgRotateFn()
            }, 100)
        },
        imgRotateFn() {
            this.timerRotate = setTimeout(() => {
                this.rotateZ += 1
                if (this.playStatus) {
                    this.imgRotateFn()
                }
            }, 19)
        }
    }
})

Vue.component('list-box', {
    template: `<li><a @click='getSong(todo)'>{{todo.artists[0].name}} - {{todo.name}} - {{todo.album.name}}</a></li>`,
    props: ['todo'],
    methods: {
        getSong(item) {
            this.$store.dispatch('getSong', item.id)
            this.$store.dispatch('addPlayList', item)
        }
    }
})

Vue.component('touch-move-prevent', {
    computed: {
        style() {
            return {
                position: 'absolute',
                height: window.innerHeight + 'px',
                width: window.innerWidth + 'px'
            }
        }
    },
    template: '<div ref="touchMovePrevent" :style="style"></div>',
    mounted() {
        document.addEventListener('touchmove', e => {
            if (this.$el.contains(e.target)) {
                e.preventDefault()
            }
        })
    }
})

Vue.component('search-box', {
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
    template: '<div class="searchBox" :class="{searchTop: searchTop}"><div @click="showSelectItem" class="selectListBox" :class="{showSelectList: showSelectList}"><span>{{selectList[selectIndex].value}}</span><ul class="selectItem"><li v-for="(item,index) in selectList" v-if="selectIndex != index" @click="selectValFn(item.type, index)">{{item.value}}</li></ul></div><input class="searchInput" type="text" @focus="searchFocus" v-model="searchVal" /><span class="searchBtn" @click="search">搜索</span><div v-show="this.$store.state.playStatus" class="musicPlan" @click="musicPlan"></div></div>',
    mounted() {
        document.addEventListener('click', (e) => {
            if (this.$el.contains(e.target)) {
                return false
            }
            this.showSelectList = false
        })
        this.search()
    },
    methods: {
        musicPlan() {
            this.$store.dispatch('setMusicBoxStatus', true)
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
            if (this.searchVal.trim() == '') {
                const _store = this.$store

                _store.dispatch('setGroceryList', [])
                _store.dispatch('setShowPage', false)
            } else {
                this.search()
            }
        },
        search() {
            const _store = this.$store

            _store.dispatch('setSearchVal', this.searchVal)
            _store.dispatch('search')
            _store.dispatch('setPlayListStatus', false)
        }
    }
})

Vue.component('search-list-box', {
    computed: {
        showPage() {
            return this.$store.state.showPage
        },
        groceryList() {
            return this.$store.state.groceryList
        }
    },
    template: '<div class="searchListBox"><div class="scrollBox" ref="scrollBox"><ol class="listBox"><list-box v-for="item in groceryList" :todo="item"></list-box></ol></div><div class="pageBox" v-show="showPage"><a href="javascript:;" @click="prev">上一页</a><a href="javascript:;" @click="next">下一页</a></div></div>',
    methods: {
        scrollBack() {
            this.$refs.scrollBox.scrollTop = 0
        },
        prev() {
            let offset = this.$store.state.offset

            offset = offset <= 0 ? 0 : --offset
            this.$store.dispatch('setOffset', offset)
            this.$store.dispatch('search')
            this.scrollBack()
        },
        next() {
            let offset = this.$store.state.offset

            this.$store.dispatch('setOffset', ++offset)
            this.$store.dispatch('search')
            this.scrollBack()
        }
    }
})

Vue.component('load-box', {
    computed: {
        loadBoxStatue() {
            return this.$store.state.loadBoxStatue
        }
    },
    template: "<div v-show='loadBoxStatue' class='loadBox'></div>"
})

const vm = new Vue({
    el: '#music',
    store,
    data: {},
    mounted() {
        window.addEventListener('resize', this.resize)
        this.resize()

        let _ls = localStorage
        if (_ls.playList) {
            this.$store.dispatch('setPlayList', JSON.parse(_ls.playList))
        }
    },
    methods: {
        resize() {
            document.body.style.height = window.innerHeight + 'px'
        }
    }
})