<style lang="sass" scoped>
.article_box {
    padding: 0 30px 30px;
    min-height: 600px;
    font-size: 16px;
    margin-bottom: 150px;

    .fa-arrow-circle-left {
        cursor: pointer;
        transition: all .5s ease-out;

        &:hover {
            transform: translateX(-5px);
        }
    }
}
.iarticle_content_box {
    padding: 0 30px 30px;
    word-wrap: break-word; 
    word-break: normal; 
    $h: 50px;
    .iarticle_title {
        padding: 5px 0;
        font-size: 24px;
        color: #333;
    }
    .iarticle_time_views {
        height: $h/2;
        line-height: $h/2;
        margin: 10px 0 20px;
        color: #999;
        font-size: 12px;
        border-bottom: 1px dotted #ddd;

        .iarticle_views {
            float: right;
        }
    }
    .iarticle_content {
        min-height: 350px;
    }
}
.icomment_box {
    padding: 30px 0;
    $h: 35px;
    $c: #ddd;
    $r: 3px;
    label {
        margin-top: 10px;
        display: block;
        padding: 5px 0;
    }
    p {
        width: 100%;
        input {
            width: 98%;
            height: $h;
            line-height: $h;
            padding: 0 1%;
            border: 1px solid $c;
            border-radius: $r;
        }
        textarea {
            width: 98%;
            height: 150px;
            padding: 1%;
            border: 1px solid $c;
            border-radius: $r;
        }
    }
    .icomment_submit {
        margin-top: 15px;
        button {
            display: block;
            width: 100%;
            height: $h;
            line-height: $h;
            text-align: center;
            color: #fff;
            background: #333;
            border-radius: $r;
            transition: all .5s ease-out;

            &:hover {
                opacity: .8;
            }
        }
    }
}
.icomment_list {
    padding: 30px;
    $h: 60px;
    $c: #e1e1e1;
    $c1: #ddd;
    li {
        position: relative;
        margin: 10px 0;
        border-bottom: 1px solid $c;
        overflow: hidden;

        .iportrait {
            position: absolute;
            width: $h;
            height: $h;
            background: $c;
            border-radius: 5px;

            i {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
            }
        }
        .icomment_list_box {
            margin-left: $h + 10px;
        }
        .icomment_list_name {
            padding: 10px 0;
            border-bottom: 1px dotted $c1;
            b {
                font-weight: bold;
                margin-right: 5px;
            }
            span {
                color: $c1;
            }
        }
        .icomment_list_content {
            padding: 10px 0;
        }
    }

}
.isource_box {
    margin: 30px 0 15px;
    font-size: 12px;
    a {
        color: #999;
    }
}
.iarticle_prev_next_link {
    margin: 15px 0;
    padding: 15px 0;
    overflow: hidden;
    border-top: 1px dotted #ddd;
    border-bottom: 1px dotted #ddd;

    .iarticle_prev_link {
        float: left;
    }
    .iarticle_next_link {
        float: right;
        i {
            margin-left: 5px;
        }
    }
    .iarticle_prev_link,
    .iarticle_next_link {
        max-width: 45%;
    }
    a {
        display: inline-block;
        vertical-align: top;
        color: #333;
        max-width: 88%;
        white-space: nowrap; 
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all .5s ease-out;

        &:hover {
            color: #999;
        }
    }
    
}
.iarticle {
    position: relative;

    .loading_box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff url(/images/load.gif) no-repeat center;
    }
}
@media screen and (max-width: 1000px) {
    
    .article_box {
        padding: 0 0 30px;
        
        .fa-arrow-circle-left {
            margin-left: 30px;
        }

    }
    .iarticle_content_box {
        padding: 0;
    }

    .iarticle_prev_next_link,
    .icomment_box {
        margin: 0 30px;
    }
}
</style>

<template>
    <div class="article_box">
        <div class="iarticle_content_box">
            <i class="fa fa-arrow-circle-left fa-2x" @click="close"></i>
            <div class="iarticle">
                <h3 class="iarticle_title">{{title}}</h3>
                <div class="iarticle_time_views">
                    <span class="iarticle_time" v-if="false">{{time | getLastTime}}</span>
                    <span class="iarticle_views" v-if="false">{{views}}次浏览</span>
                </div>
                <div class="iarticle_content" v-html="content"></div>
                <div class="isource_box">
                    原文链接:
                    <a :href="href">{{href}}</a>
                </div>    
                <div class="loading_box" v-show="loading_box"></div>    
            </div>
            <div class="iarticle_prev_next_link">
                <template v-if="prevLink.link">
                    <div class="iarticle_prev_link">
                        <i class="fa fa-angle-double-left"></i>
                        <router-link :to="prevLink.link">
                            {{prevLink.title}}
                        </router-link>
                    </div>
                </template>
                <template v-if="nextLink.link">
                    <div class="iarticle_next_link">
                        <router-link :to="nextLink.link">
                            {{nextLink.title}}
                        </router-link>
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
                    <label>名称:</label>
                    <p>
                        <input type="text" v-model="comment_username" required/>
                    </p>
                </div>
                <div class="icomment_email">
                    <label>电子邮箱:</label>
                    <p>
                        <input type="email" v-model="comment_email" required />
                    </p>
                </div>
                <div class="icomment_content">
                    <label>评论内容:</label>
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
import xythree from "./../../static/js/xythree"
import paginationBox from "./../../vue_component/pagination/pagination.vue"

export default {
    data() {
        return {
            id: this.$route.query.id,
            flag: "",
            title: "",
            content: "",
            commentList: [],
            comment_username: "",
            comment_email: "",
            comment_content: "",
            total: 0,
            time: 0,
            views: 0,
            index: 1,
            href: "",
            prevLink: {},
            nextLink: {},
            loading_box: false
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
    watch: {
        "$route": "fetchData"
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
                    id: this.$route.query.id
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

                if (next.length) {
                    this.nextLink = {
                        link: "/article?id=" + next[0]._id,
                        title: next[0].title
                    }
                } else {
                    this.nextLink = {}
                }
                if (prev.length) {
                    this.prevLink = {
                        link: "/article?id=" + prev[0]._id,
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
        this.fetchData()

        //this.$refs.icommentForm.addEventListener("submit", e => {
            
        //})
    }
}
</script>
