let store = new Vuex.Store({
    state: {
        articleInfo: {
            id: "",
            title: "",
            content: ""
        },
        pagination: {
            total: 0, //分页总条数
            index: 1
        },
        articleList: [], //分页列表内容
        loadBoxStatus: false, //加载loading状态
        alertBoxStatus: false, //弹出框状态
        alertBoxSureCallBack: "", // 弹出框确定按钮的回调
        alertBoxText: "", //弹出框文本
        articleBoxStatus: false, //内容组件状态
        articleBoxInfo: {}, //内容组件信息
        addEditArtilcleStatus: false //添加编辑组件状态
    },
    getter: {},
    actions: {
        setArticle({ state, dispatch }, data) {
            state.articleInfo.id = data.id
            dispatch("setArticleContent", data)
        },
        setArticleContent({ state }, data) {
            state.articleInfo.title = data ? data.title : ""
            state.articleInfo.content = data ? data.content : ""
        },
        setTotal({ state }, data) { //设置分页总条数
            state.pagination.total = data
        },
        "pagination-change" ({ state, dispatch }, data) {
            let index = data - 1
            dispatch("getArticleList", index)
            state.pagination.index = index
        },
        removeArticleList({ state }, data) {
            state.articleList.splice(data, 1)
        },
        setArticleList({ state }, data) {
            state.articleList = data
        },
        getArticleList({ state, dispatch }, skip = 0, limit = 15) {

            axios.get("/article/article-list", {
                params: {
                    skip,
                    limit
                }
            }).then(result => {
                dispatch("setTotal", result.data.count)
                dispatch("setArticleList", result.data.result)
            })

        },
        setLoadBoxStatus({ state }, data) {
            state.loadBoxStatus = data
        },
        setAlertBoxStatus({ state }, data) {
            state.alertBoxStatus = data
        },
        setAlertBoxSureCallBack({ state }, callback) {
            state.alertBoxSureCallBack = callback
        },
        alertBoxSure({ state }) {
            state.alertBoxStatus = false
            state.alertBoxSureCallBack && state.alertBoxSureCallBack()
        },
        setAlertBoxText({ state }, data) {
            state.alertBoxText = data
        },
        removeArticle({ state }, data) {
            return new Promise((resolve, reject) => {
                axios.get("/article/remove-article?id=" + data).then(result => {
                    resolve(result)
                }, () => {
                    reject()
                })
            })
        },
        getArticleInfo({ state }, data) {
            return new Promise((resolve, reject) => {
                axios.get("/article/article-info?id=" + data).then(result => {
                    resolve(result)
                }, () => {
                    reject()
                })
            })
        },
        setArticleBox({ state }, data) {
            state.articleBoxStatus = data.status
            state.articleBoxInfo = data.info || {}
        },
        setAddEditArtilcleStatus({ state }, data) {
            state.addEditArtilcleStatus = data
        },
        editArticle({ state, dispatch }, id) {

            dispatch("setLoadBoxStatus", true)
            dispatch("getArticleInfo", id).then(result => {
                dispatch("setLoadBoxStatus", false)
                if (result.status == 200) {
                    const data = result.data
                    dispatch("setAddEditArtilcleStatus", true)
                    dispatch("setArticle", {
                        id: data._id,
                        title: data.title,
                        content: data.content
                    })
                }
            })
        }
    }
})



Vue.component("article-list", {
    props: ["list", "index"],
    template: `
        <li>
            <p @click="show(list._id)">{{list.title}}</p>
            <span class="article-delete" @click="remove(list._id, index)">删除</span>
            <span class="article-edit" @click="edit(list._id)">编辑</span>
        </li>`,
    methods: {
        show(id) {
            const dispatch = this.$store.dispatch

            dispatch("setLoadBoxStatus", true)
            dispatch("getArticleInfo", id).then(result => {
                dispatch("setLoadBoxStatus", false)
                if (result.status == 200) {
                    dispatch("setArticleBox", {
                        status: true,
                        info: result.data
                    })
                }
            })
        },
        edit(id) {
            this.$store.dispatch("editArticle", id)
        },
        remove(id, index) {
            const _store = this.$store
            const dispatch = _store.dispatch

            dispatch("setAlertBoxStatus", true)
            dispatch("setAlertBoxText", "确定删除吗?")
            this.submitAfter(id, index)
        },
        submitAfter(id, index) {
            const dispatch = this.$store.dispatch

            dispatch("setAlertBoxSureCallBack", () => {
                dispatch("removeArticle", id).then(result => {
                    if (result.data.ok == 1) {
                        dispatch("removeArticleList", index)
                        dispatch("getArticleList", this.$store.state.pagination.index)
                    }
                })
            })
        }
    }
})



Vue.component("pagination-box", {
    props: ["colnum", "index", "total"],
    data() {
        return {
            ind: this.index || 1,
            count: 2
        }
    },
    computed: {
        _colnum() {
            return this.colnum || 15
        },
        _total() {
            return this.total
        },
        arr() {
            let temp = []
            for (var i = 0, len = Math.ceil(this._total / this._colnum); i < len; i++) {
                temp.push(i + 1)
            }
            return temp
        },
        prevPageArr() {
            let n = this.ind - this.count - 1
            return this.arr.slice(n < 0 ? 0 : n, this.ind - 1)
        },
        nextPageArr() {
            return this.arr.slice(this.ind, this.ind + this.count)
        }
    },
    template: `
        <div>
            <div class="paginationBox">
                <span v-if="ind > 1" @click="prev">《</span>
                <a v-if="ind > count + 2" @click="jump(1)">1</a>
                <em v-if="ind > count + 1">...</em>
                <template v-for="item in prevPageArr">
                    <a href="javascript:;" @click="jump(item)">{{item}}</a>
                </template>
                <b class="paginationAction" >{{ind}}</b>
                <template v-for="item in nextPageArr" >
                    <a href="javascript:;" @click="jump(item)" >{{item}}</a>
                </template>
                <em v-if="ind + count < arr.length">...</em>
                <a v-if="arr.length > 1 && ind + count < arr.length" @click="jump(arr.length)" >{{arr.length}}</a>
                <span v-if="ind != arr.length && _total > _colnum" @click="next">》</span>
            </div>
        </div>`,
    methods: {
        jump(ind) {
            this.ind = ind
            this.$store.dispatch("pagination-change", ind)
        },
        prev() {
            this.jump(--this.ind)
        },
        next() {
            this.jump(++this.ind)
        }
    }
})



Vue.component("add-edit-article", {
    data() {
        return {
            ue: ""
        }
    },
    computed: {
        articleInfo() {
            return this.$store.state.articleInfo
        },
        addEditArtilcleStatus() {
            return this.$store.state.addEditArtilcleStatus
        }
    },
    template: `
        <div class="add-edit-article" v-show="addEditArtilcleStatus">
            <div class="add-edit-article-close"><span @click="close">关闭</span></div>
            <p class="add-edit-article-title" ><input type="text" v-model="articleInfo.title" /></p>
            <div class="add-edit-article-content" >
                <div class="container-box">
                    <div id="container" name="content" type="text/plain"></div>
                </div>
            </div>
            <p class="add-edit-article-btn" >
                <button @click="submit" class="add-edit-article-sure" >确定</button>
                <button class="add-edit-article-empty" @click="empty" >清空</button>
            </p>
        </div>
    `,
    mounted() {

        this.$watch("addEditArtilcleStatus", (newVal, oldVal) => {
            if (newVal) {
                if (window.UE) {
                    if (!this.ue) {
                        this.ue = window.UE.getEditor('container')
                        this.ue.ready(() => {
                            this.ue.setHeight(400)
                        })
                    }

                    this.ue.ready(() => {
                        this.ue.setContent(this.articleInfo.content || "")
                    })
                }
            } else {
                this.ue.setContent("")
            }
        })

    },
    methods: {
        close() {
            const dispatch = this.$store.dispatch

            dispatch("setAddEditArtilcleStatus", false)
            dispatch("setArticle", {})
        },
        tip(txt) {
            const _store = this.$store
            const dispatch = _store.dispatch

            dispatch("setAlertBoxStatus", true)
            dispatch("setAlertBoxText", txt)
        },
        empty() {
            this.tip("确定清空吗?")
            this.submitAfter()
        },
        submit() {
            this.articleInfo.content = this.ue.getContent()
            if (!this.articleInfo.title || !this.articleInfo.content) {
                this.tip("请输入内容!")
            } else {
                this.addArticle({
                    id: this.articleInfo.id,
                    title: this.articleInfo.title,
                    content: this.articleInfo.content
                })
            }
        },
        submitAfter() {
            const dispatch = this.$store.dispatch

            dispatch("setAlertBoxSureCallBack", () => {
                dispatch("setArticleContent")
            })
        },
        addArticle(d) {
            axios.post("/article/add-edit-article", d).then(result => {
                const _store = this.$store

                if (result.status == 200) {
                    this.tip("提交成功!")
                    _store.dispatch("getArticleList", _store.state.pagination.index - 1)
                }

            })
        }
    }
})



Vue.component("article-box", {
    computed: {
        articleBoxStatus() {
            return this.$store.state.articleBoxStatus
        },
        articleBoxInfo() {
            return this.$store.state.articleBoxInfo
        }
    },
    template: `
        <div class="article-box" v-show="articleBoxStatus">
            <h3 class="article-box-title">{{articleBoxInfo.title}}</h3>
            <p class="article-box-time">{{new Date(articleBoxInfo.last_modify_time).toLocaleString()}}</p>
            <div class="article-box-edit" @click="edit(articleBoxInfo._id)">编辑</div>
            <div class="article-box-close">
                <span @click="close">关闭</span>
            </div>
            <div class="article-box-content" v-html="articleBoxInfo.content" ></div>
        </div>
    `,
    methods: {
        close() {
            this.$store.dispatch("setArticleBox", {
                status: false
            })
        },
        edit(id) {
            this.close()
            this.$store.dispatch("editArticle", id)
        }
    }
})



Vue.component('load-box', {
    computed: {
        loadBoxStatus() {
            return this.$store.state.loadBoxStatus
        }
    },
    template: "<div v-show='loadBoxStatus' class='loadBox'></div>"
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



let vm = new Vue({
    el: "#admin",
    store,
    data: {

    },
    computed: {
        total() {
            return this.$store.state.pagination.total
        },
        articleList() {
            return this.$store.state.articleList
        }
    },
    methods: {
        articleAdd() {
            this.$store.dispatch("setAddEditArtilcleStatus", true)
        },
        changUser() {
            axios.get("/logout").then(result => {
                if (result.status == 200 && result.data == "logout success") {
                    location.href = "/admin/login"
                }
            })
        }
    },
    mounted() {
        this.$store.dispatch("getArticleList")
    }
})