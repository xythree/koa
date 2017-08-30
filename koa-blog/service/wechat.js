const crypto = require("crypto")
const LRU = require("lru-cache")
const md5 = require("md5")
const querystring = require("querystring")
const parseString = require('xml2js').parseString //引入xml2js包
const msg = require('./msg')

const config = {
    token: "wechat",
    appid: "wxd485a65630e9a30e",
    secret: "58bc49b4adef181233bf161e4685528f",
    apiDomain: "https://sz.api.weixin.qq.com/"
}

const key = md5("token")

module.exports = (router, render) => {

    let api = {
        api: "token",
        cached: LRU({
            //max: 1000,
            maxAge: 1000 * 60 * 60 * 2
        }),
        cachedItem: {}
    }

    router.get('/wechat', async ctx => {
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
        const hashCode = crypto.createHash('sha1') //创建加密类型 
        let resultCode = hashCode.update(tempStr, 'utf8').digest('hex') //对传入的字符串进行加密

        //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if (resultCode === signature) {
            result = echostr
        } else {
            result = "mismatch"
        }

        let access_token = ""

        if (!api.cached.has(key)) {
            access_token = await ctx.get({
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
        } else {
            access_token = api.cached.get(key)
        }

        await ctx.post({
            path: config.apiDomain + "cgi-bin/menu/create?access_token=" + access_token,
            _$json: true,
            body: {
                "button": [{
                        "type": "view",
                        "name": "hvkcoder",
                        "url": "http://blog.csdn.net/hvkcoder"
                    },
                    {
                        "type": "click",
                        "name": "今日推荐2",
                        "key": "today_recommend"
                    },
                    {
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
                    }
                ]
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
            console.log(access_token, data)
        })

        ctx.body = await result
    })

    router.post("/wechat", async ctx => {
        let result = ""

        result = await new Promise((resolve, reject) => {
            let buf = []

            ctx.req.on("data", chunk => {
                buf.push(chunk)
            })

            ctx.req.on("end", () => {
                let msgXml = Buffer.concat(buf).toString('utf-8')

                parseString(msgXml, { explicitArray: false }, (err, result) => {
                    if (!err) {
                        result = result.xml

                        let toUser = result.ToUserName //接收方微信
                        let fromUser = result.FromUserName //发送仿微信
                        let reportMsg = "" //声明回复消息的变量   

                        if (result.MsgType.toLowerCase() === "text") {
                            //根据消息内容返回消息信息
                            switch (result.Content) {
                                case '1':
                                    reportMsg = msg.txtMsg(fromUser, toUser, 'Hello ！我的英文名字叫 H-VK')
                                    break
                                case '2':
                                    reportMsg = msg.txtMsg(fromUser, toUser, 'Node.js是一个开放源代码、跨平台的JavaScript语言运行环境，采用Google开发的V8运行代码,使用事件驱动、非阻塞和异步输入输出模型等技术来提高性能，可优化应用程序的传输量和规模。这些技术通常用于数据密集的事实应用程序');
                                    break
                                case '文章':
                                    var contentArr = [
                                            { Title: "Node.js 微信自定义菜单", Description: "使用Node.js实现自定义微信菜单", PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72868520" },
                                            { Title: "Node.js access_token的获取、存储及更新", Description: "Node.js access_token的获取、存储及更新", PicUrl: "http://img.blog.csdn.net/20170528151333883?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72783631" },
                                            { Title: "Node.js 接入微信公众平台开发", Description: "Node.js 接入微信公众平台开发", PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast", Url: "http://blog.csdn.net/hvkcoder/article/details/72765279" }
                                        ]
                                        //回复图文消息
                                    reportMsg = msg.graphicMsg(fromUser, toUser, contentArr)
                                    break
                                default:
                                    reportMsg = msg.txtMsg(fromUser, toUser, '没有这个选项哦')
                                    break
                            }
                            resolve(reportMsg)
                        }

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


    router.get("/wechat", async ctx => {
        ctx.body = await "abc"
    })

}