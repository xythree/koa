const store = new Vuex.Store({
  state: {
    songsInfo: {},
    lyric: '',
    playList: []
  },
  mutations: {

  },
  getters: {

  },
  actions: {
    addPlayList({state}, data) {
      let flag = false
      state.playList.forEach(t => {
        if (t.id == data.id) flag = true
      })
      if (!flag) {
        state.playList.push(data)
        localStorage.playList = JSON.stringify(state.playList)
      }
    },
    getSong({commit, dispatch}, id) {
      axios.get(`/music/detail?id=${id}`).then(d => {
        const data = d.data
        if (data.code == 200) {
          dispatch('songsInfo', data.songs[0])
        }
      })
      axios.get(`/music/lyric?id=${id}`).then(d => {
        const data = d.data
        if (data.code == 200) {
          dispatch('lyric', data)
        }
      })
    },
    songsInfo({state}, data) {
      state.songsInfo = data
    },
    lyric({state}, data) {
      let lyric = ''
      if (!data.nolyric && data.lrc.lyric) {
        lyric = data.lrc.lyric.replace(/\n/g, '</p>').replace(/\[([\d,\.,:]+)\]/g, "<p id='id$1' data-time='$1'>")
      }
      state.lyric = lyric
    }
  }
})

Vue.component('play-list', {
  props: ['item'],
  template: "<li><a @click='getSong(item)'>{{item.songerName}} - {{item.name}} - {{item.albumName}}</a></li>",
  methods: {
    getSong(item) {
      this.$store.dispatch('getSong', item.id)
    }
  }
})

Vue.component('music-box', {
  data() {
    return {
      videoBox: '',
      toggleText: 'play',
      first: true
    }
  },
  computed: {
    info() {
      return this.$store.state.songsInfo
    },
    lyric() {
      return this.$store.state.lyric
    }
  },
  template: "<div><img :src='info.album && info.album.picUrl'/><button @click='toggle'>{{toggleText}}</button><video ref='videoBox' :src='info.mp3Url' autoplay controls ></video><div v-html='lyric'></div></div>",
  methods: {
    toggle() {
      const pl = this.$store.state.playList

      if (pl.length) {
        if (this.first) {
          this.$store.dispatch('getSong', pl[0].id)
          this.toggleText = 'stop'
          this.first = false
        } else {
          const videoBox = this.$refs.videoBox

          if (videoBox.paused) {
            this.toggleText = 'stop'
            videoBox.play()
          } else {
            this.toggleText = 'play'
            videoBox.pause()
          }
        }
      }
    }
  }
})

Vue.component('todo-item', {
  template: `<li><a @click='getSong(todo)'>{{todo.artists[0].name}} - {{todo.name}} - {{todo.album.name}}</a></li>`,
  props: ['todo', 'index'],
  methods: {
    getSong(item) {
      this.$store.dispatch('getSong', item.id)
      this.$store.dispatch('addPlayList', {
        id: item.id,
        songerName: item.artists[0].name,
        name: item.name,
        albumName: item.album.name
      })
    }
  }
})

const vm = new Vue({
  el: '#search',
  store,
  data: {
    searchVal: '遇见',
    offset: 1,
    selectVal: 1,
    selectList: [
      { value: '歌曲', type: 1 },
    /*
    {value: "专辑", type: 10},
    {value: "歌手", type: 100},
    {value: "歌单", type: 1000},
    {value: "用户", type: 1002},
    {value: "mv", type: 1004},
    {value: "歌词", type: 1006},
    {value: "主播电台", type: 1009}
    */
    ],
    groceryList: []
  },
  computed: {
    playList() {
      let _ls = localStorage
      if (_ls.playList) {
        this.$store.state.playList = JSON.parse(_ls.playList)        
      }
      return this.$store.state.playList
    }
  },
  mounted() {
    this.search({ selectVal: 1 })
  },
  methods: {
    search({ selectVal = 1, offset = 0 }) {
      axios.post('/music/search', {
        s: this.searchVal,
        type: selectVal,
        offset: offset
      }).then(d => {
        const data = d.data
        if (data.code == 200) {
          this.groceryList = data.result.songs
        }
      })
    },
    prev() {
      let offset = this.offset <= 0 ? 0 : this.offset--
      this.search({ offset: offset })
    },
    next() {
      let offset = this.offset++
      this.search({ offset: offset })
    }
  }
})
