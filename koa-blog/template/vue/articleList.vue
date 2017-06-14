<template>
    <div class="iarticle_box">
        <ul class="iarticle">
            <template v-if="articleList.length == 0">
                <li>查找无结果~
                    <br />
                    <br />
                    <br />
                </li>
            </template>
            <template v-else>
                <li v-for="item in articleList">
                    <div class="ibox_ani_1">
                        <div class="ibox_ani_2">
                            <h5>
                                <router-link :to="item._id | routerId">
                                    <i class="fa fa-hashtag"></i>{{item.title}}
                                </router-link>
                            </h5>
                            <p>{{item.content.length > 120 ? item.content.substring(0, 120) + "..." : item.content}}</p>
                            <router-link class="iread_more" :to="item._id | routerId">阅读全文</router-link>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <pagination_box :total="total" :paginationCallBack="paginationCallBack"></pagination_box>
    </div>
</template>

<script>

import axios from "axios"
import pagination_box from "./../../vue_component/pagination/pagination.vue"

export default {
    data() {
        
        return {
            
        }
    },
    computed: {
        articleList() {
            return this.$store.state.articleList
        },
        total() {
            return this.$store.state.articleTotal
        }
    },
    filters: {
        routerId(value) {
            return "/article?id=" + value
        }
    },
    components: {
        pagination_box
    },
    methods: {
        paginationCallBack(ind) {
            this.getArticleList(ind)
        },
        getArticleList(skip, limit = 15) {
            this.$store.dispatch("getArticleList", { skip, limit })
        }
    }
}
</script>
