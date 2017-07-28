<style lang="sass" >
*{margin:0;padding:0;}

$c1: #eee;
$c2: #ddd;
$c3: #fff;
$c4: #efefef;

.ichat {
    .ichat_box {
        float: left;
        margin-top: 50px;
        margin-left: 250px;
        width: 600px;
        height: 700px;
        iframe {
            border: 1px solid $c2;
        }
    }
}

.ichatroom_list_box {
    position: fixed;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    background: $c1;
    overflow-y: auto;
    overflow-x: hidden;

    .ichatroom_list {
        width: 200px;

        $h: 35px;
        li {
            list-style: none;
            margin-top: 5px;
            height: $h;
            line-height: $h;
            text-align: center;
            border-top: 1px dotted $c2;
            border-bottom: 1px dotted $c2;
            cursor: pointer;
            transition: all .5s;

            &:hover {
                background: $c2;
            }
        }
        .createRoom {
            background: $c4;
        }
    }
}

</style>


<template>
    <div class="ichat">
        <div class="ichatroom_list_box">
            <h5>房间列表：</h5>
            <ul class="ichatroom_list">
                <li class="createRoom" @click="joinRoom('')">+创建临时房间</li>
                <li v-for="(value, key, index) in roomlist" @click="joinRoom(key)">{{key}}</li>
            </ul>
        </div>
        <ul style="margin-left: 200px;">
            <li v-for="item in avatar">
                <img :src="item" />
            </li>
        </ul>
        <div class="ichat_box">
            <iframe v-show="src" :src="src" width="100%" height="100%" frameborder="0"></iframe>
        </div>
    
        <drag_box :show="dragBoxShow" :dragCallBack="dragCallBack">
            <login_register :loginRegisterCallBack="loginRegisterCallBack" />
        </drag_box>
    </div>
</template>


<script>

import axios from "axios"
import drag_box from "./../../../vue_component/drag_box/drag_box.vue"
import login_register from "./../login_register.vue"
import io from "socket.io-client"

const socket = io()

export default {
    data() {
        return {
            src: "",
            dragBoxShow: false,
            isLogin: false,
            roomlist: {},
            avatar: []
        }
    },
    components: {
        drag_box,
        login_register
    },
    methods: {
        getRoomId() {
            let id = Math.random().toFixed(6).substr(2).toString(16)

            if (this.roomlist[id]) {
                return this.getRoomId()
            }
            return id
        },
        loginRegisterCallBack(data) {
            this.isLogin = true
            this.dragBoxShow = false
        },
        dragCallBack() {
            this.dragBoxShow = false
        },
        joinRoom(id) {
            if (!this.isLogin) {
                this.dragBoxShow = true
                return
            }
            let _id = id || this.getRoomId()

            //window.open("/chatroom/" + _id)
            this.src = "/chatroom/" + _id
        },
        init() {
            axios.get("/chat/roomlist").then(data => {
                this.roomlist = data.data
            })
        }
    },
    created() {
        axios.get("/isLogin").then(data => {
            if (data.data.length) {
                this.isLogin = true
            }
        })
    },
    mounted() {

        this.init()

        socket.on("rooms", data => {
            this.roomlist = data
        })

        axios.get("/json/avatar.json").then(data => {
            this.avatar = data.data.headerImg
        })

        window.a = function (s) {
            var len = s.length;
            var stack = [];
            if (len === 0 || len % 2 !== 0) {
                return false;
            }
            s = s.replace(/\(/g, "1");
            s = s.replace(/\)/g, "4");
            s = s.replace(/\[/g, "2");
            s = s.replace(/\]/g, "5");
            s = s.replace(/\{/g, "3");
            s = s.replace(/\}/g, "6");
            console.log(s);
            stack.push(s[0]);
            for (var i = 1; i < len; i++) {
                if (parseInt(s[i]) - stack[stack.length - 1] === 3) {
                    stack.pop();
                } else {
                    stack.push(s[i]);
                }
            }
            console.log(stack);
            if (stack.length === 0)
                return true;
            else
                return false;
        }

    }
}
</script>
