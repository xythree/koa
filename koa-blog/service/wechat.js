const crypto = require("crypto")
const LRU = require("lru-cache")
const md5 = require("md5")
const querystring = require("querystring")
const parseString = require("xml2js").parseString //引入xml2js包
const msg = require("./msg")
const request = require("request")

const config = {
    token: "wechat",
    appid: "wxd485a65630e9a30e",
    secret: "58bc49b4adef181233bf161e4685528f",
    signature: "",
    apiDomain: "https://api.weixin.qq.com/"
}

const access_token = md5("access_token")
const web_access_token = md5("web_access_token")
const web_refresh_token = md5("web_refresh_token")

module.exports = (router, render) => {

    let api = {
        api: "token",
        cached: LRU({
            //max: 1000,
            maxAge: 1000 * 60 * 60 * 2
        })
    }

    let refresh_token = {
        api: "refresh_token",
        cached: LRU({
            maxAge: 1000 * 60 * 60 * 24 * 30
        })
    }

    function get_access_token(cache = true) {
        if (cache && api.cached && api.cached.has(access_token)) {
            return api.cached.get(access_token)
        } else {
            return new Promise((resolve, reject) => {

                request.get({
                    url: config.apiDomain + `cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`,
                    json: true
                }, (err, res, data) => {

                    if (data.access_token) {
                        if (api.cached) {
                            api.cached.set(access_token, data.access_token)
                        }
                        resolve(data.access_token)
                    } else {
                        get_access_token(cache)
                    }
                })
            }).catch(() => {
                console.log("get_access_token error")
                return ""
            })
        }
    }

    function get_web_access_token(code) {
        if (api.cached && refresh_token.cached.has(web_access_token)) {
            return refresh_token.cached.get(web_access_token)
        } else {

            if (refresh_token.cached && refresh_token.cached.has(web_refresh_token)) {
                let _refresh_token = refresh_token.cached.get(web_refresh_token)

                return new Promise((resolve, reject) => {
                    request.get({
                        url: config.apiDomain + `sns/oauth2/refresh_token?appid=${config.appid}&refresh_token=${_refresh_token}&grant_type=refresh_token`,
                        json: true
                    }, (err, res, data) => {

                        if (data.access_token) {
                            if (api.cached) {
                                api.cached.set(web_access_token, data.access_token)
                            }
                        }

                        resolve(data)
                    })
                }).catch(() => {
                    console.log("get_web_refresh_token error")
                    return {}
                })
            } else {

                return new Promise((resolve, reject) => {
                    request.get({
                        url: config.apiDomain + `sns/oauth2/access_token?appid=${config.appid}&secret=${config.secret}&code=${code}&grant_type=authorization_code`,
                        json: true
                    }, (err, res, data) => {

                        if (data.access_token) {
                            if (refresh_token.cached) {
                                api.cached.set(web_access_token, data.access_token)
                                refresh_token.cached.set(web_refresh_token, data.refresh_token)
                            }
                        }
                        console.log("web_access_token", data)
                        resolve(data)
                    })
                }).catch(() => {
                    console.log("get_web_access_token error")
                    return {}
                })

            }
        }
    }

    router.get("/wechat/code_access_token", async ctx => {
        let params = ctx.request.query

        let result = {}

        if (params.code) {
            result = await get_web_access_token(params.code)
        } else {
            result = ""
        }

        ctx.body = result

    })

    router.get("/wechat/auth", async ctx => {
        let params = ctx.request.query

        let result = {}

        if (params.access_token && params.openid) {
            result.data = await new Promise((resolve, reject) => {
                request.get({
                    url: config.apiDomain + `/sns/auth?access_token=${params.access_token}&openid=${params.openid}`,
                    json: true
                }, (err, res, data) => {
                    console.log("auth", data)
                    resolve(data)

                })
            }).catch(() => {
                return {}
            })
        }

        ctx.body = result
    })

    router.get("/wechat/userinfo", async ctx => {
        let params = ctx.request.query

        let result = {}

        if (params.access_token && params.openid) {
            result.data = await new Promise((resolve, reject) => {
                request.get({
                    url: config.apiDomain + `/sns/userinfo?access_token=${params.access_token}&openid=${params.openid}&lang=zh_CN`,
                    json: true
                }, (err, res, data) => {
                    console.log("userinfo", data)
                    resolve(data)

                })
            }).catch(() => {
                return {}
            })
        }

        ctx.body = result

    })

    router.get("/wechat/delete_menus", async ctx => {
        let access_token = await get_access_token(false)

        let result = await new Promise((resolve, reject) => {

            request.get({
                url: config.apiDomain + "cgi-bin/menu/delete?access_token=" + access_token,
                json: true
            }, (err, res, data) => {
                if (data.errcode == 0) {
                    console.log("删除菜单成功")
                    resolve("ok")
                } else {
                    reject()
                }
            })
        }).catch(() => {
            return "error"
        })

        ctx.body = result
    })

    router.get("/wechat/create_menus", async ctx => {
        let access_token = await get_access_token(false)

        let result = await new Promise((resolve, reject) => {

            request.post({
                url: config.apiDomain + "cgi-bin/menu/create?access_token=" + access_token,
                json: true,
                body: {
                    "button": [{
                        "type": "view",
                        "name": "授权",
                        "url": "https://www.xythree.com/wechat"
                    }, {
                        "name": "小工具",
                        "sub_button": [{
                            "type": "scancode_waitmsg",
                            "name": "扫一扫",
                            "key": "scancode"
                        }, {
                            "type": "pic_sysphoto",
                            "name": "系统拍照发图",
                            "key": "take_photo"
                        }, {
                            "type": "location_select",
                            "name": "发送位置",
                            "key": "send_location"
                        }]
                    }]
                }
            }, (err, res, data) => {
                if (data.errcode == 0) {
                    console.log("添加菜单成功")
                    resolve("ok")
                } else {
                    reject()
                }
            })

        }).catch(() => {
            return "error"
        })

        ctx.body = result
    })


    router.get("/wx", async ctx => {
        let params = ctx.request.query
            //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
        let signature = params.signature //微信加密签名
        let timestamp = params.timestamp //时间戳
        let nonce = params.nonce //随机数
        let echostr = params.echostr //随机字符串

        //2.将token、timestamp、nonce三个参数进行字典序排序
        let array = [config.token, timestamp, nonce]
        array.sort()

        //3.将三个参数字符串拼接成一个字符串进行sha1加密
        let tempStr = array.join("")
        const hashCode = crypto.createHash("sha1") //创建加密类型 
        let resultCode = hashCode.update(tempStr, "utf8").digest("hex") //对传入的字符串进行加密

        //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (resultCode === signature) {
            result = echostr
        } else {
            result = "mismatch"
        }

        ctx.body = await result
    })


    router.get("/wechat", async ctx => {

        ctx.body = await render("wechat/index", {
            wxconfig: {
                appid: config.appid,
                timestamp: +new Date,
                signature: config.signature,
                nonceStr: Math.random().toString(16).substr(2),
            },
            timestamp: +new Date
        })

    })

    router.post("/wechat", async ctx => {
        let result = ""

        result = await new Promise((resolve, reject) => {
            let buf = []

            ctx.req.on("data", chunk => {
                buf.push(chunk)
            })

            ctx.req.on("end", () => {
                let msgXml = Buffer.concat(buf).toString("utf-8")

                parseString(msgXml, { explicitArray: false }, (err, result) => {
                    if (!err) {
                        result = result.xml

                        let toUser = result.ToUserName //接收方微信
                        let fromUser = result.FromUserName //发送仿微信
                        let reportMsg = "" //声明回复消息的变量

                        if (result.MsgType.toLowerCase() === "text") {
                            //根据消息内容返回消息信息
                            switch (result.Content) {
                                case "1":
                                    reportMsg = msg.txtMsg(fromUser, toUser, "Hello ！我的英文名字叫 H-VK")
                                    break
                                case "2":
                                    reportMsg = msg.txtMsg(fromUser, toUser, "Node.js是一个开放源代码、跨平台的JavaScript语言运行环境，采用Google开发的V8运行代码,使用事件驱动、非阻塞和异步输入输出模型等技术来提高性能，可优化应用程序的传输量和规模。这些技术通常用于数据密集的事实应用程序");
                                    break
                                case "文章":
                                    var contentArr = [
                                            { Title: "Node.js 微信自定义菜单", Description: "使用Node.js实现自定义微信菜单", PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72868520" },
                                            { Title: "Node.js access_token的获取、存储及更新", Description: "Node.js access_token的获取、存储及更新", PicUrl: "http://img.blog.csdn.net/20170528151333883?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72783631" },
                                            { Title: "Node.js 接入微信公众平台开发", Description: "Node.js 接入微信公众平台开发", PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72765279" }
                                        ]
                                        //回复图文消息
                                    reportMsg = msg.graphicMsg(fromUser, toUser, contentArr)
                                    break
                                default:
                                    reportMsg = msg.txtMsg(fromUser, toUser, "没有这个选项哦")
                                    break
                            }
                        }

                        resolve(reportMsg)
                    } else {
                        //打印错误
                        console.log(err)
                    }
                })
            })

        })
        ctx.body = result
    })

    router.get("/wechat/token", async ctx => {
        let result = ""

        if (api.cached && api.cached.has(key)) {
            result = await api.cached.get(key)
        } else {
            result = await ctx.get({
                path: config.apiDomain + "cgi-bin/token",
                grant_type: "client_credential",
                appid: config.appid,
                secret: config.secret
            }).then(res => {
                let data = JSON.parse(res)

                if (data.access_token) {
                    if (api.cached) {
                        api.cached.set(key, data.access_token)
                    }
                    return data.access_token
                } else {
                    return res
                }
            })
        }

        ctx.body = await result
    })

}