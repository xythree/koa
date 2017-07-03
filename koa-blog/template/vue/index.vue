<template>
    <div id="ibody" class="ibody" :class="{'showMenu': showMenu}">
    
        <div class="ileft">
            <div class="ihead">
                <img src="/images/qq.jpg" />
            </div>
            <ul class="inav">
                <li>
                    <a href="/">
                        <span></span>
                        <i class="fa fa-home"></i>首页</a>
                </li>
                <li>
                    <a href="/music">
                        <span></span>
                        <i class="fa fa-music"></i>音乐</a>
                </li>
                <li>
                    <a href="/poetry" target="_blank">
                        <span></span>
                        <i class="fa fa-heart"></i>诗·词·曲</a>
                </li>
                <li>
                    <a href="/component/">
                        <span></span>
                        <i class="fa fa-navicon"></i>vue2.0组件</a>
                </li>
                <li>
                    <a href="/word" target="_blank">
                        <span></span>
                        <i class="fa fa-file-word-o"></i>单词</a>
                </li>
                <li>
                    <a href="/tools">
                        <span></span>
                        <i class="fa fa-wrench"></i>工具</a>
                </li>
                <!--
                <li>
                    <a href="javascript:;">
                        <span></span>
                        <i class="fa fa-tags"></i>标签</a>
                </li>
                <li>
                    <a href="javascript:;">
                        <span></span>
                        <i class="fa fa-user"></i>关于</a>
                </li>
                -->
            </ul>
            <div class="long_white"></div>
            <div class="icopy">
                <p>Copyright © 2017-2020 All Rights Reserved!</p>
                <p>Powered by koa2 & xythree</p>
            </div>
        </div>
        <div class="iright">
            <div class="imenuBg" v-show="showMenu" @click="menuFn(1)"></div>
            <div class="imenu" @click="menuFn">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="isearch_box">
                <div class="isearch_btn" @click="search">
                    <i class="fa fa-search"></i>
                </div>
                <div class="isearch_input">
                    <input type="text" :class="{'active_ipt': active_ipt}" @focus="focusFn" @blur="blurFn" @keyup.enter="search" v-model="searchVal" />
                </div>
            </div>
            <div class="irouter_view">
                <router-view></router-view>
            </div>
        </div>
        <repload></repload>
        <backTop></backTop>
    </div>
</template>

<script>

import axios from "axios"
import repload from "./../../vue_component/repload/repload.vue"
import backTop from "./backTop.vue"

export default {
    components: {
        repload,
        backTop
    },
    data() {
        return {
            searchVal: this.$store.state.searchVal,
            active_ipt: false,
            showMenu: false
        }
    },
    computed: {

    },
    methods: {
        menuFn(time) {
            setTimeout(() => {
                this.showMenu = !this.showMenu
            }, time)
        },
        search() {
            const dispatch = this.$store.dispatch

            dispatch("setSearchVal", this.searchVal)
            dispatch("search", { skip: 0 })
            this.$router.push("/")
        },
        focusFn() {
            this.active_ipt = true
        },
        blurFn() {
            if (!this.searchVal) {
                this.active_ipt = false
            }
        },
    },
    mounted() {
        //axios.get("http://gank.io/api/data/%E7%A6%8F%E5%88%A9/10/1")
    }
}
</script>