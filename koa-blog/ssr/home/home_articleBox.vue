
<template>
    <div class="article_box">
        <div class="iarticle_content_box" v-if="!isBrowser">
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
                        <a :href="prevLink.link" :title="prevLink.title" >{{prevLink.title}}</a>
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
        <ul class="icomment_list">
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
        </ul>
        <paginationBox :total="total" :paginationCallBack="paginationCallBack"></paginationBox>
        <div class="icomment_box">
            <form ref="icommentForm" @submit="submitFn">
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
        close() {
            this.$router.push("/")
        },
        paginationCallBack(ind) {
            this.index = ind
            //this.getComment({ skip: ind })
        },
        fetchData() {
            this.loading_box = true

            axios.get("/article", {
                params: {
                    id: this.$router.history.current.params.id
                }
            }).then(result => {
                let data = result.data.data[0]
                let prev = result.data.prev
                let next = result.data.next

                this.loading_box = false
                this.time = +new Date(data.create_time)
                this.title = data.title
                this.content = data.content
                this.views = data.views
                this.flag = data.flag
                this.href = location.href
                this.commentList = data.comments

                if (next && next.length) {
                    this.nextLink = {
                        link: "/article/" + next[0]._id,
                        title: next[0].title
                    }
                } else {
                    this.nextLink = {}
                }
                if (prev && prev.length) {
                    this.prevLink = {
                        link: "/article/" + prev[0]._id,
                        title: prev[0].title
                    }
                } else {
                    this.prevLink = {}
                }
                document.body.scrollTop = 0
            })
        },
        getComment({ skip, limit = 15 }) {
            axios.get("/comment", {
                params: {
                    flag: this.flag,
                    skip,
                    limit
                }
            }).then(result => {
                this.total = result.data.count
                this.commentList = result.data.result
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
        this.getComment({ skip: this.index })
        //this.$refs.icommentForm.addEventListener("submit", e => {

        //})
    }
}

</script>
