
<template>
    <div class="article_box">
        <div class="iarticle_content_box">
            <i v-if="false" class="fa fa-arrow-circle-left fa-2x" @click="close"></i>
            <div class="iarticle markdown-body">
                <h3 class="iarticle_title">
                    <i class="fa fa-hashtag"></i> {{info.title}}</h3>
                <div class="iarticle_time_views">
                    <span class="iarticle_time">{{info.create_time | getLastTime}}</span>
                    <span class="iarticle_views">{{info.views}}次浏览</span>
                </div>
                <div class="iarticle_content highlight" v-html="info.content"></div>                
                <div class="isource_box" v-if="false">
                    原文链接:
                    <a :href="href">{{href}}</a>
                </div>
                <div class="loading_box" v-show="loading_box"></div>
            </div>
            <div class="iarticle_prev_next_link">
                <template v-if="prevLink.link">
                    <div class="iarticle_prev_link">
                        <i class="fa fa-angle-double-left"></i>
                        <a :href="prevLink.link" :title="prevLink.title">{{prevLink.title}}</a>
                    </div>
                </template>
                <template v-if="nextLink.link">
                    <div class="iarticle_next_link">
                        <a :href="nextLink.link" :title="nextLink.title">{{nextLink.title}}</a>
                        <i class="fa fa-angle-double-right"></i>
                    </div>
                </template>
            </div>
        </div>
        <div v-show="loading">loading...</div>
        <ul class="icomment_list" ref="icomment_list">
            <template v-if="commentList.length">
                <li v-for="item in commentList">
                    <div class="iportrait">
                        <i class="fa fa-user-o fa-3x"></i>
                    </div>
                    <div class="icomment_list_box">
                        <div class="icomment_list_name">
                            <b>{{item.username}}</b>说
                            <span>{{item.create_time|getLastTime}}</span>
                        </div>
                        <div class="icomment_list_content">{{item.content}}</div>
                    </div>
                </li>
            </template>
            <template v-else>
                <li v-show="commentStatus">暂无评论</li>
            </template>
        </ul>

        <paginationBox :total="total" :index="index" :disready="disready" :paginationCallBack="paginationCallBack"></paginationBox>

        <div class="icomment_box">
            <form @submit="submitFn">
                <div class="icomment_name">
                    <label>*名称:</label>
                    <p>
                        <input type="text" v-model="comment_username" required/>
                    </p>
                </div>
                <div class="icomment_email">
                    <label>*电子邮箱:</label>
                    <p>
                        <input type="email" v-model="comment_email" required />
                    </p>
                </div>
                <div class="icomment_content">
                    <label>*评论内容:</label>
                    <p>
                        <textarea v-model="comment_content" required></textarea>
                    </p>
                </div>
                <div class="icomment_submit">
                    <button type="submit">提交</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>

import axios from "axios"
import xythree from "js/xythree"
import paginationBox from "vue_component/pagination/pagination.vue"

export default {
    props: ["articleList"],
    data() {
        return {
            commentStatus: false,
            loading: false,
            disready: true,
            isBrowser: isBrowser,
            flag: this.$router.history.current.params.id,
            commentList: [],
            comment_username: "",
            comment_email: "",
            comment_content: "",
            total: 0,
            index: 1,
            href: "",
            loading_box: false
        }
    },
    computed: {
        info() {
            if (this.articleList && this.articleList.article.length) {
                this.articleList.article[0].content = this.prism(this.articleList.article[0].content)
                return this.articleList.article[0]
            }
            return {
                title: "",
                content: "",
                create_time: +new Date,
                views: 1
            }
        },
        prevLink() {
            if (this.articleList && this.articleList.prev.length) {
                return {
                    link: "/article/" + this.articleList.prev[0]._id,
                    title: this.articleList.prev[0].title
                }
            }
            return {}
        },
        nextLink() {
            if (this.articleList && this.articleList.next.length) {
                return {
                    link: "/article/" + this.articleList.next[0]._id,
                    title: this.articleList.next[0].title
                }
            }
            return {}
        }
    },
    filters: {
        getLastTime(value) {
            return xythree.getLastTime(+new Date(value))
        }
    },
    components: {
        paginationBox
    },
    methods: {
        prism(value) {
            return value.replace(/<code>/g, "<code class='language-javascript'>")
        },
        close() {
            this.$router.push("/")
        },
        paginationCallBack(ind) {
            this.index = ind
            this.getComment({ skip: ind })
            this.$nextTick(() => {
                document.body.scrollTop = this.$refs.icomment_list.offsetTop
            })
        },
        getComment({ skip, limit = 15 }) {

            return new Promise((resolve, reject) => {
                axios.get("/comment", {
                    params: {
                        flag: this.flag,
                        skip,
                        limit
                    }
                }).then(result => {
                    this.total = result.data.count
                    this.commentList = result.data.result
                    resolve()
                })
            })
        },
        submitFn(e) {
            e.preventDefault()
            axios.post("/comment", {
                flag: this.flag,
                username: this.comment_username,
                email: this.comment_email,
                content: this.comment_content
            }).then(result => {
                if (result.data.result) {
                    this.getComment({ skip: this.index })
                    this.comment_username = this.comment_email = this.comment_content = ""
                }
            })
        }
    },
    mounted() {
        let timer, _t = this
        let doc = document

        doc.addEventListener("scroll", showComment)

        function showComment() {
            clearTimeout(timer)
            timer = setTimeout(() => {
                if (document.body.scrollTop <= _t.$refs.icomment_list.offsetTop) {
                    _t.loading = true
                    _t.getComment({ skip: _t.index }).then(() => {
                        _t.loading = false
                        _t.commentStatus = true
                        doc.removeEventListener("scroll", showComment)
                    })
                }
            }, 300)
        }
        

    }
}

</script>
