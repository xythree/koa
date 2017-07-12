<template>
    <div id="login_register">
        <div class="login" v-show="this.type == 'login'">
            <p>
                <a href="javascript:;" @click="toggleType('register')">没有帐号,注册?</a>
            </p>
            <p>
                <input type="text" placeholder="用户名" v-model="username">
            </p>
            <p>
                <input type="password" placeholder="密码" @keyup.enter="submit" v-model="password">
            </p>
            <p>
                <button @click="submit">登录</button>
            </p>
        </div>
        <div class="register" v-show="this.type != 'login'">
            <p>
                <a href="javascript:;" @click="toggleType('login')">已有帐号,切换登录</a>
            </p>
            <p>
                <input type="text" placeholder="用户名" v-model="username">
            </p>
            <p>
                <input type="password" placeholder="密码" @keyup.enter="submit" v-model="password">
            </p>
            <p>
                <input type="text" v-model="verify" />
                <img :src="verifyUrl" @click="verifyFn" />
            </p>
            <p>
                <button @click="submit">注册</button>
            </p>
        </div>
    </div>
</template>
<script>
import axios from "axios"
import { getParams } from "./../../static/js/xythree"

export default {
    data() {
        return {
            verify: "",
            verifyUrl: "/verify",
            username: "",
            password: "",
            type: "login"
        }
    },
    methods: {
        verifyFn() {
            this.verifyUrl = "/verify?" + Math.random()
        },
        toggleType(type) {
            this.type = type
        },
        register() {
            axios.post("/register", {
                username: this.username.trim(),
                password: this.password.trim(),
                verify: this.verify.trim()
            }).then(result => {
                if (result.status == 200 && result.data == "ok") {
                    this.redirect()
                } else {
                    this.verifyFn()
                    this.verify = ""
                    alert(result.data.msg)
                }
            })
        },
        login() {
            axios.get("/login", {
                params: {
                    username: this.username.trim(),
                    password: this.password.trim()
                }
            }).then(result => {
                if (result.status == 200 && result.data == "ok") {
                    this.redirect()
                } else {
                    alert(result.data)
                }
            })
        },
        redirect() {
            let url = getParams("url")

            if (url) {
                location.href = url
            } else if (document.referrer) {
                location.href = document.referrer
            } else {
                location.href = "/admin/index"
            }
        },
        submit() {
            this[this.type]()
        }
    }
}
</script>
