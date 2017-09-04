import Vue from "vue"
import axios from "axios"
import _xy from "js/xythree"


let code = _xy.getParams("code")

alert("code:" + code)

if (!code) {
    let _href = "https://www.xythree.com/wechat"

    location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd485a65630e9a30e&redirect_uri=${_href}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
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
            axios.get("/wechat/auth", {
                params: {
                    access_token: d.access_token,
                    openid: d.openid
                }
            }).then(data => {
                let d = data.data

                alert(JSON.stringify(d))
            })
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
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '1', // 分享标题
                link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: '', // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    alert("cancel")
                }
            })
        })
    }
})