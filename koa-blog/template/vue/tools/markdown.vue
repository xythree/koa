<style lang="sass">
body,
.ibox *{
    padding: 0;
    margin: 0;
}

.ilink_box {
    $h: 30px;
    height: $h;
    line-height: $h;
    text-align: right;
    border-bottom: 1px solid #eee;
    background: #333;
    
    a {
        $c: #fff;
        text-decoration: none;
        padding: 0 20px;
        color: $c;
        font-size: 14px;
        border-left: 1px dotted $c;
        transition: all .5s;

        &:hover {
            color: #f00;
        }
    }
}

.imarkdown_box {
    position: relative;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;

    .itextarea_box {
        float: left;
        height: 100%;

        textarea {
            margin: 10px;
            display: block;
            padding: 5px;
            height: 97%;
            outline: none;
            border-radius: 3px;
            font-size: 16px;
            resize: none;
        }
    }
    .iline {
        position: absolute;
        top: 0;
        left: 50%;
        width: 2px;
        height: 100%;
        border-left: 1px dashed #ddd;
        border-right: 1px dashed #ddd;
        cursor: e-resize;
        user-select: none;
    }
    .iresult_box {
        float: right;
        height: 97%;
        padding: 20px;
        overflow: auto;
    }
}
</style>

<template>
    <div class="ibox">
        <div class="ilink_box">
            <a href="/">首页</a>
            <a href="/tools">工具</a>
            <a href="javascript:;" @click="downloadFn('md')">下载markdown格式文件</a>
            <a href="javascript:;" @click="downloadFn('html')">下载html格式文件</a>
        </div>
        <div class="imarkdown_box" :style="imarkdownBoxStyle">
            <div class="itextarea_box">
                <textarea v-model="textarea" :style="itextareaBoxStyle" @keyup="keyupFn"></textarea>
            </div>
            <div class="iline" @mousedown="mousedownFn" :style="ilineStyle"></div>
            <div class="iresult_box" :style="iresultBoxStyle" v-html="result"></div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import { markdown } from "markdown"

export default {
    data() {
        return {
            w: 0,
            h: 0,
            textarea: localStorage.md || "",
            moveStatus: false,
            x: 0,
            v: 0,
            minVal: 0,
            maxVal: 0,
            result: ""
        }
    },
    computed: {
        imarkdownBoxStyle() {
            return {
                height: this.h + "px"
            }
        },
        itextareaBoxStyle() {
            return {
                width: this.v - 35 + "px"
            }
        },
        iresultBoxStyle() {
            return {
                width: this.w - this.v - 4 - 40 + "px"
            }
        },
        ilineStyle() {
            return {
                left: this.v - 2 + "px"
            }
        }
    },
    methods: {
        downloadFn(ext) {
            let data = ""
            if (ext == "md") {
                data = this.textarea
            } else {
                data = this.result
            }            
            if (data == "") return
            let filename = window.prompt("输入文件名")
            if (!filename) return
            axios.post("/generate", {
                ext,
                data,
                filename,
            }).then(data => {
                if (data.data) {
                    location.href = "/download?url=" + data.data
                }
            })
        },
        keyupFn() {
            this.result = markdown.toHTML(this.textarea)
            localStorage.md = this.textarea
        },
        mousedownFn(e) {
            this.moveStatus = true
            this.x = e.pageX - e.target.offsetLeft
        },
        init() {
            this.w = window.innerWidth
            this.h = window.innerHeight - 35
            this.minVal = this.w / 5
            this.maxVal = this.w / 1.3
        }
    },
    created() {
        this.init()
        this.v = this.w / 2

        if (localStorage.md) {
            this.keyupFn()
        }
    },
    mounted() {
        let doc = document

        doc.addEventListener("mousemove", e => {
            if (!this.moveStatus) return
            let x = e.pageX - this.x

            x = x > this.maxVal ? this.maxVal : x
            x = x < this.minVal ? this.minVal : x

            this.v = x
        }, false)

        doc.addEventListener("mouseup", () => {
            this.moveStatus = false
        }, false)

        window.addEventListener("resize", () => {
            this.init()
        })

    }
}

</script>

