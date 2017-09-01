import Vue from "vue"
import axios from "axios"
import _xy from "js/xythree"


let code = _xy.getParams("code")

if (!code) {
    let _href = encodeURIComponent("http://18n1952m73.51mypc.cn/wechat")

    location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd485a65630e9a30e&redirect_uri=${_href}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
}


let vm = new Vue({
    el: "#wechat",
    created() {

        new Promise((resolve, reject) => {
            axios.get("/wechat/code_access_token", {
                params: {
                    code
                }
            }).then(data => {
                let d = data.data
                resolve(d)
            })
        }).then(d => {
            axios.get("/wechat/userinfo", {
                params: {
                    access_token: d.access_token,
                    openid: d.openid
                }
            }).then(data => {
                let d = data.data

                alert(JSON.stringify(d))
            })
        })

    },
    mounted() {

    }
})