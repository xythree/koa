<style lang="sass">

*{margin:0;padding:0;}

$c1: #eee;
$c2: #ddd;
$c3: #fff;
$c4: #00a3f0;

ul,ol,li {
    list-style: none;
}

.ilink_box {
    $h: 30px;
    height: $h;
    line-height: $h;
    border-bottom: 1px solid $c1;
    background: #333;

    a {
        $c: $c3;
        text-decoration: none;
        padding: 0 20px;
        color: $c;
        font-size: 14px;
        border-right: 1px dotted $c;
        transition: all .5s;

        &:hover {
            color: #f00;
        }
    }
}
.irobot {
    margin: 50px auto;
    width: 800px;
    overflow: hidden;

    .irobot_chat {
        float: left;
        width: 500px;
        height: 600px;

        .irobot_chat_box {
            width: 100%;
            height: 535px;
            border-bottom: 1px solid $c2;
            margin-bottom: 15px;
            overflow: auto;
        }
        
        border: 1px solid $c2;
        border-radius: 3px;
    }

    .isay_box {
        height: 50px;

        input {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            width: 360px;
            height: 20px;
            line-height: 20px;
            padding: 5px;
            border: 1px solid $c2;
            border-radius: 3px;
            outline: none;
        }
        .isend_btn {
            display: inline-block;
            vertical-align: middle;
            width: 100px;
            height: 30px;
            line-height: 30px;
            margin-left: 2px;
            text-align: center;
            cursor: pointer;
            background: $c4;
            color: $c1;
            border-radius: 3px;

            &:hover {
                opacity: .8;
            }
        }
    }
}

.ilist {
    margin: 20px 10px 0;

    li {
        list-style: none;
    }

    .ispeak_list {
        margin: 12px 0;
        overflow: hidden;

        a {
            color: $c4;
            text-decoration: none;
        }

        $w: 42px;
        .iportrait {
            float: left;
            width: $w;
            height: $w;
            background: url(/images/chat/experience.png) no-repeat 0 -666px;
            border-radius: 3px;
        }
        .ispeak_box {
            margin-left: $w + 15px;
            font-size: 14px;

            .iname {
                font-size: 12px;
                padding-left: 2px;
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

        $w: 41px;
        .iportrait {
            float: right;
            width: $w;
            height: $w;
            background: url(/images/chat/experience.png) no-repeat 0 -626px;
        }

        .ispeak_box {
            margin-right: $w + 15px;
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
}

.ireserve {
    float: left;
    padding: 10px;
    font-size: 12px;
    width: 250px;

    li {
        margin-bottom: 12px;
        a {
            margin: 2px;
            padding: 3px;
            border: 1px dotted $c2;
            border-radius: 3px;
            cursor: pointer;
            transition: all .5s;

            &:hover {
                color: $c4;
                border-color: $c4;
            }
        }
    }
}

</style>

<template>
    <div>
        <div class="ilink_box">
            <a href="/">首页</a>
        </div>
        <div class="irobot">
    
            <div class="irobot_chat">
    
                <div class="irobot_chat_box" ref="irobot_chat_box">
                    <ul class="ilist" ref="ilist">
                        <li v-for="item in records" :class="{'iself': item.type == 'self'}">
                            <transition name="fade">
                                <div class="ispeak_list" v-if="item.type == 'self'">
                                    <div class="iportrait"></div>
                                    <div class="ispeak_box">
                                        <div class="ispeak">{{item.text}}</div>
                                    </div>
                                </div>
                                <div v-else class="ispeak_list">
                                    <div class="iportrait"></div>
                                    <div class="ispeak_box">
                                        <p class="iname">{{item.username}}</p>
                                        <div class="ispeak">
                                            {{item.text}}
                                            <a v-if="item.url" :href="item.url" target="_blank">打开页面</a>
                                        </div>
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
    
            <ul class="ireserve">
                <li v-for="item in reserve">
                    <a @click="reserveFn(item)">{{item}}</a>
                </li>
            </ul>
    
        </div>
    </div>
</template>

<script>

import axios from "axios"

export default {
    data() {
        let temp =  ["你好，最近过得怎么样？", "嗨，最近想我没有？[羞涩]", "嗨，有什么想对我聊聊么？", "你好呀，想我了吗？", "跟我聊聊吧，你可以问我姚明多高？", "做什么呢？对我说讲笑话，我就会逗你开心哦"]

        return {
            username: Math.random().toFixed(6).substr(2),
            value: "",
            records: [{
                username: "机器人",
                text: temp[Math.floor(Math.random()*5)]
            }],
            reserve: ["讲个笑话", "今天深圳天气", "冷笑话", "现在是什么星座", "感冒应该怎么办", "讲个故事", "红烧肉怎么做", "成语接龙"]
        }
    },
    methods: {
        setScroll() {
            this.$nextTick(() => {
                let refs = this.$refs
                refs.irobot_chat_box.scrollTop = refs.ilist.offsetHeight
            })
        },
        reserveFn(v) {
            this.value = v
            this.say()
        },
        say() {
            if (!this.value.trim()) return

            this.records.push({
                type: "self",
                text: this.value
            })

            this.setScroll()

            axios.get("/chat/robot", {
                params: {
                    username: this.username,
                    info: this.value
                }
            }).then(data => {
                let d = data.data

                if (d.code == 100000) {
                    this.records.push({
                        username: "机器人",
                        text: d.text
                    })
                } else if (d.code == 200000) {
                    this.records.push({
                        username: "机器人",
                        text: d.text,
                        url: d.url
                    })
                }

                this.value = ""
                this.setScroll()
            })
        }
    }
}

</script>
