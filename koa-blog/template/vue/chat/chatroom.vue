<style lang="sass" >
*{margin:0;padding:0;}

$h: 35px;

$c1: #eee;
$c2: #ddd;
$c3: #fff;

.ilist_box {
    padding: 10px 10px $h 10px;
    overflow: auto;
}

.isay_box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: $h;
    background: $c3;
    border-top: 1px solid $c2;
    display: flex;

    .isay_ipt {
        flex-grow: 10;
        $mgv: 3px;
        text-indent: $mgv;
        height: $h;
        line-height: $h;
        border: none;
        outline: none;
    }
    .isend_btn {
        display: inline-block;
        width: 80px;
        height: $h;
        line-height: $h;
        text-align: center;
        background: $c3;
        border-left: 1px solid $c2;
        cursor: pointer;
    }
}

.info {
    position: fixed;
    width: 95%;
    top: 0;
    left: 0;
    padding-top: 10px;
    padding-bottom: 5px;
    padding-left: 10px;
    font-size: 12px;
    background: $c3;
    z-index: 999;

    .iall_list {
        position: absolute;
        right: 10px;
        cursor: pointer;
    }
}
.iall_list_box {
    position: fixed;
    width: 97%;
    top: 30px;
    left: 0;
    max-height: 600px;
    background: $c3;
    font-size: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 999;

    ul {
        width: 100%;
        border-top: 1px dotted $c2;
        border-bottom: 1px dotted $c2;
        padding-bottom: 30px;
        overflow: hidden;

        li {
            padding: 2px;
            list-style: none;
            float: left;
            margin-left: 10px;
        }
    }
}

.ilist {
    margin-top: 20px;

    li {
        list-style: none;
    }

    .ispeak_list {
        display: flex;
        margin: 10px 0;

        .iportrait {
            $w: 50px;
            width: $w;
            height: $w;
            background: $c1;
            border-radius: 3px;
        }
        .ispeak_box {
            flex-grow: 2;
            margin-left: 15px;
            font-size: 14px;

            .iname {
                font-size: 12px;
                padding-left: 2px;
                border-left: 3px solid $c1;
            }
            .ispeak {
                position: relative;
                display: inline-block;
                $pdv: 5px;
                padding:$pdv;
                margin-top: $pdv;
                background: $c1;
                border-radius: 5px;
                word-wrap: break-word;
                word-break: normal;
                word-break:break-all;

                &:after {
                    position: absolute;
                    content: "";
                    font-size: 0;
                    height: 0;
                    width: 0;
                    top: 7px;
                    left: -12px;
                    border-width: 7px;
                    border-style: solid;
                    border-color: transparent $c1 transparent transparent;
                }
            }
        }
    }
    .iself {
        .ispeak_box {
            margin-right: 15px;
            margin-left: 0;
            text-align: right;

            .ispeak {

                &:after{
                    left: auto;
                    right: -12px; 
                    border-color: transparent transparent transparent $c1;
                }
            }
        }
    }
    .itip {
        margin: 3px 0;
        font-size: 12px;
        color: $c2;
        text-align: center;
    }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s
}
.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>


<template>
    <div class="ichatroom">
        <div class="ilist_box" ref="ilist_box">
            <div class="info">
                当前在线人数：{{rooms.length}}

                <span class="iall_list" @click="showAllListFn" >在线人数列表</span>
            </div>
            <transition name="fade">
            <div class="iall_list_box" v-show="showAllListStatus">
                <ul>
                    <li v-for="item in rooms">{{item}}</li>
                </ul>
            </div>
            </transition>
            <ul class="ilist" ref="ilist">
                <li v-for="item in records" :class="{'iself': item.username == username}">
                    <transition name="fade">
                        <div v-if="item.type == 'join' && item.username != username" class="itip">
                            {{item.username}} 进入了房间
                        </div>
                        <div v-else-if="item.type == 'leave' && item.username != username" class="itip">
                            {{item.username}} 离开了房间
                        </div>
                        <div class="ispeak_list" v-else-if="!item.type && item.username == username">
                            <div class="ispeak_box">
                                <div class="ispeak">{{item.value}}</div>
                            </div>
                            <div class="iportrait"></div>
                        </div>
                        <div v-else-if="item.value" class="ispeak_list">
                            <div class="iportrait"></div>
                            <div class="ispeak_box">
                                <p class="iname">{{item.username}}</p>
                                <div class="ispeak">{{item.value}}</div>
                            </div>
                        </div>
                    </transition>
                </li>
            </ul>
        </div>
        <div class="isay_box">
            <input class="isay_ipt" placeholder="to say something..." @keyup.enter="say" type="text" v-model="value" />
            <a class="isend_btn" @click="say">发送</a>
        </div>
    </div>
</template>


<script>

import axios from "axios"
import io from "socket.io-client"
import darg_box from "vue_component/drag_box/drag_box.vue"
import login_register from "./../login_register.vue"

const socket = io()

export default {
    data() {
        return {
            showAllListStatus: false,
            rooms: [],
            isLogin: false,
            wh: 0,
            h: 0,
            value: "",
            records: [],
            username: ""
        }
    },
    methods: {
        showAllListFn() {
            this.showAllListStatus = !this.showAllListStatus
        },
        say() {
            if (this.username) {
                if (!this.value) return
                socket.emit("message", {
                    username: this.username,
                    value: this.value
                })
                this.value = ""
            } else {
                this.getUsername()
            }
        },
        init() {
            let refs = this.$refs

            this.wh = window.innerHeight
            this.h = this.wh - 80

            refs.ilist_box.style.height = this.h + "px"
        },
        getUsername() {
            this.username = window.prompt("请输入昵称")
        }
    },
    filters: {
        formatTime(time) {
            let d = new Date(time)

            return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
        }
    },
    created() {
        axios.get("/isLogin").then(data => {
            if (data.data.length) {
                this.isLogin = true
                this.username = data.data[0].username
                socket.emit("join", this.username)
            }
        })
    },
    mounted() {

        this.init()

        //this.getUsername()

        socket.on("join", (data, rooms) => {
            this.records = data
            this.rooms = rooms
        })

        socket.on("leave", (data, rooms) => {
            this.records = data
            this.rooms = rooms
        })

        socket.on("message", data => {
            this.records = data

            this.$nextTick(() => {
                let refs = this.$refs
                refs.ilist_box.scrollTop = refs.ilist.offsetHeight
            })
        })

    }
}
</script>
