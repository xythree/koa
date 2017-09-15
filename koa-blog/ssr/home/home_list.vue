<template>
    <div class="iarticle_box">
        <ul class="iarticle">
            <template v-if="list.length == 0">
                <li>什么也没有~
                    <br />
                    <br />
                    <br />
                </li>
            </template>
            <template v-else>
                <li v-for="item in list">
                    <div class="ibox_ani_1">
                        <div class="ibox_ani_2">
                            <h5>
                                <a :href="item._id | routerId">
                                    <i class="fa fa-hashtag"></i>{{item.title}}</a>
                            </h5>
                            <p>{{item.text}}</p>
                            <a class="iread_more" :href="item._id | routerId">阅读全文</a>
                        </div>
                    </div>
                </li>
            </template>
        </ul>

        <pagination_box :url="url" :index="index" :total="total" :disready="disready" :paginationCallBack="paginationCallBack"></pagination_box>

    </div>
</template>

<script>

import axios from "axios"
import pagination_box from "vue_component/pagination/pagination.vue"

export default {
    props: ["articleList"],
    data() {
        return {
            disready: true,
            isBrowser: isBrowser,
            skip: 0,
            index: this.articleList.index,
            url: this.articleList.url,
            list: this.articleList.articleList,
            total: this.articleList.count
        }
    },
    filters: {
        routerId(value) {
            return "/article/" + value
        }
    },
    components: {
        pagination_box
    },
    methods: {
        paginationCallBack(ind) {
            this.skip = ind - 1

            axios.get("/article", {
                params: {
                    type: "list",
                    skip: this.skip
                }
            }).then(data => {
                let d = data.data

                this.list = d.articleList
                this.total = d.count
            })
        }
    },
    mounted() {

        applicationCache.addEventListener("updateready", function() {
            //更新本地缓存，只能在onupdateready事件触发时调用  
            applicationCache.update()
            location.reload()
        }, true)

    }
}
</script>
