const store = new Vuex.Store({
    state: {
        loadBoxStatue: false,
        lyric: '',
        lyricItem: [],
        openMusicBoxStatus: false,
        songsInfo: {},
        playList: [],
        playListIndex: 0,
        offset: 0,
        searchVal: '',
        selectVal: 1,
        groceryList: [],
        playToggleFn: '',
        playStatus: false,
        showPage: false,
        playListStatus: false,
        audioCurrentTime: '',
        audioDuration: '',
        alertBoxStatus: false,
        alertBoxFn: "",
        alertBoxText: "",
        condIconIndex: 0,
        condIcon: [
            { text: "单曲循环", type: "condSingle" },
            { text: "随机播放", type: "condRandom" },
            { text: "列表循环", type: "condList" }
        ]
    },
    mutations: {

    },
    getters: {

    },
    actions: {
        setCondIconIndex({ state }, data) {
            state.condIconIndex = data
        },
        setAlertBoxStatus({ state }, data) {
            state.alertBoxStatus = data
        },
        setAlertBoxText({ state }, data) {
            state.alertBoxText = data
        },
        setAlertBoxFn({ state }, fn) {
            state.alertBoxFn = fn
        },
        alertBoxSure({ state, dispatch }) {
            dispatch("setAlertBoxStatus", false)
            state.alertBoxFn && state.alertBoxFn()
        },
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
        playToggle({ state }, data) {
            state.playToggleFn && state.playToggleFn(data)
        },
        removePlayList({ state }, data) {
            state.playList.splice(data, 1)
            localStorage.playList = JSON.stringify(state.playList)
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
        setPlayListIndex({ state }, data) {
            state.playListIndex = data
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
    template: '<div class="playListBox" v-show="playListStatus"><h5>播放列表:</h5><div class="scrollBox"><ol class="listBox"><list-box v-for="(item,index) in playList" :index="index" :todo="item"></list-box></ol></div></div>',
    methods: {
        getSong(item) {
            this.$store.dispatch('getSong', item.id)
        }
    }
})

Vue.component('play-controll-box', {
    data() {
        const _state = this.$store.state
        return {
            show: false,
            timer: "",
            index: _state.condIconIndex,
            radius: 0,
            condIcon: _state.condIcon
        }
    },
    computed: {
        condIconIndex() {
            return this.$store.state.condIconIndex
        },
        songsInfo() {
            return this.$store.state.songsInfo
        },
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
    template: '<div class="playControllBox" :class="{playStatus: this.playStatus}" ref="playControllBox"><div class="playControllTitleBox"><p>{{songsInfo.name}}</p><p>{{songsInfo.artists && songsInfo.artists[0].name}}</p></div><div ref="playControllBoxTop" class="playControllBoxTop"><ul class="audioTimeBox"><li class="audioLine" ref="audioLine" :style="{width: audioLineWidth}"></li><li class="audioBtn" ref="audioBtn" :style="{left: audioBtnLeft}"></li><li class="audioCurrentTime">{{audioCurrentTime}}</li><li class="audioDuration">{{audioDuration}}</li></ul></div><div class="playControllBoxLeft"><div class="cond_icon" :class="condIcon[condIconIndex].type" @click="condIconFn">&nbsp;<transition name="fade"><span v-if="show">{{condIcon[condIconIndex].text}}</span></transition></div></div><div class="playControllBoxCenter"><div class="audioPrevBtn" @click="prev"></div><div class="audioPlayBtn" @click="audioPlayBtn"></div><div class="audioNextBtn" @click="next"></div></div><div class="playControllBoxRight"><play-list-btn></play-list-btn></div></div>',
    mounted() {
        const ref = this.$refs
        this.radius = ref.audioBtn.offsetWidth / 2
        this.width = ref.playControllBoxTop.offsetWidth
    },
    methods: {
        condIconFn() {
            clearTimeout(this.timer)
            this.index = this.index >= this.condIcon.length - 1 ? 0 : ++this.index
            this.$store.dispatch("setCondIconIndex", this.index)
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
            _store.dispatch("getSong", _store.state.playList[index].id)
        },
        audioPlayBtn() {
            const _store = this.$store

            if (_store.state.playStatus) {
                _store.dispatch("playToggle")
            } else {
                if (_store.state.playList.length) {
                    _store.dispatch("getSong", _store.state.playList[this.index].id)
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
})

Vue.component('music-box', {
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
            // this.$refs.audioBox.pause()
            // this.$store.dispatch("setPlayStatus", false)
            this.$store.dispatch('setMusicBoxStatus', false)
                // this.rotateZ = 0
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
    template: '<li><a @click="getSong(todo)">{{todo.artists[0].name}} - {{todo.name}} - {{todo.album.name}}</a> <template v-if="index != undefined"><span @click="remove(index)" class="playListRemove"></span></template></li>',
    props: ['todo', 'index'],
    methods: {
        getSong(item) {
            this.$store.dispatch('getSong', item.id)
            this.$store.dispatch('addPlayList', item)
        },
        remove(index) {
            const _store = this.$store

            _store.dispatch("setAlertBoxFn", () => {
                _store.dispatch("removePlayList", index)
            })
            _store.dispatch("setAlertBoxStatus", true)
            _store.dispatch("setAlertBoxText", "确定删除吗?")

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

Vue.component("alert-box", {
    computed: {
        alertBoxStatus() {
            return this.$store.state.alertBoxStatus
        },
        alertBoxText() {
            return this.$store.state.alertBoxText
        }
    },
    template: "<div class='alertBox' v-show='alertBoxStatus' ><div class='alertBoxContent' v-show='alertBoxStatus'><h3>提示<span @click='close'>X</span></h3><div class='alertBoxText'>{{alertBoxText}}</div><div class='alertBoxBtn'><a href='javascript:;' @click='close'>取消</a><a href='javascript:;' @click='sure'>确定</a></div></div></div>",
    methods: {
        close() {
            this.$store.dispatch("setAlertBoxStatus", false)
        },
        sure() {
            this.$store.dispatch("alertBoxSure")
        }
    }
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