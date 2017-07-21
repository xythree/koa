<style lang="sass" >
*{margin:0;padding:0;}

$c1: #eee;
$c2: #ddd;
$c3: #fff;
$c4: #efefef;

.ichat {

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
                <li class="createRoom" @click="joinRoom('')" >+创建房间</li>
                <li v-for="(value, key, index) in roomlist" @click="joinRoom(key)">房间{{key}}</li>
            </ul>
        </div>

        <drag_box :show="dragBoxShow" :dragCallBack="dragCallBack" >
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
            dragBoxShow: false,
            isLogin: false,
            roomlist: {}
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

            window.open("/chatroom/" + _id)
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

    }
}
</script>
