
<style lang="sass" scoped>
.iqrcode_box {
    min-width: 800px;
    padding: 10px;
    border-bottom: 1px dotted #ddd;
    margin-bottom: 20px;
    font-size: 14px;
    overflow: hidden;
    h5 {
        margin: 10px 0;
    }
    .iqrcode_text {
        float: left;
        p {
            margin: 10px 0;
            span {
                margin-right: 10px;
            }
        }
        textarea {
            padding: 5px;
            width: 300px;
            height: 100px;
        }
        .btn {
            padding: 3px 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-decoration: none;
        }
    }    
    .img {
        float: left;
        margin-left: 50px;
        border: 1px solid #ddd;
    }
}
</style>

<template>
    <div class="iqrcode_content">
        <div class="iqrcode_box">
            <h5>二维码生成</h5>
            <div class="iqrcode_text">
                <p>
                    <textarea @focus="selectFn" v-model="text"></textarea>
                </p>
                <p>
                    <span>
                        尺寸:
                        <select v-model="size">
                            <option v-for="(item,index) in options" :value="index+1">{{(index+1)*num}}px</option>
                        </select>
                    </span>
                    <span>
                        图片类型:
                        <select v-model="type">
                            <option v-for="item in imgType" :value="item">{{item}}</option>
                        </select>
                    </span>
                    <span>
                        边距:
                        <select v-model="margin">
                            <option v-for="(item,index) in marginArr" :value="index+1">{{index+1}}</option>
                        </select>
                    </span>
                </p>
                <p>
                    <a href="javascript:;" class="btn" @click="getqrcode">生成</a>
                    <a href="javascript:;" class="btn" @click="emptygetqrcode">清空</a>
                </p>
            </div>
            <img class="img" :src="src" />
        </div>

        <div class="iqrcode_box">
            <h5>base64转图片</h5>
            <div class="iqrcode_text">
                <p>
                    <textarea @focus="selectFn" v-model="base64_text"></textarea>
                </p>
                <p>
                    <a href="javascript:;" class="btn" @click="getbase64">生成</a>
                    <a href="javascript:;" class="btn" @click="emptygetbase64">清空</a>
                </p>
            </div>
            <img class="img" style="border: none;" :src="base64_src" />
        </div>

        <div class="iqrcode_box">
            <h5>图片转base64</h5>
            <div class="iqrcode_text">
                <p>
                    上传图片:
                    <input type="file" name="file" @change="imgChangeFn" />
                </p>
                <p>
                    <textarea @focus="selectFn" ref="img_textarea" v-model="img_text"></textarea>
                </p>
                <p>
                    <a href="javascript:;" class="btn" @click="getimg">生成</a>
                    <a href="javascript:;" class="btn" @click="emptygetimg">清空</a>
                </p>
            </div>
        </div>
    
    </div>
</template>

<script>
import axios from "axios"
export default {
    data() {
        return {
            text: "",
            src: "",
            num: 23,
            size: 10,
            options: Array(40),
            type: "png",
            imgType: ["png", "jpg", "gif"],
            margin: 1,
            marginArr: Array(20),
            base64_text: "",
            base64_src: "",
            img_text: "",
            img_src: ""
        }
    },
    methods: {
        emptygetqrcode() {
            this.src = ""
            this.text = ""
        },
        getqrcode() {
            if (!this.text.trim()) return
            axios.post("/qrcode", {
                text: this.text,
                type: this.type,
                margin: this.margin,
                size: this.size
            }).then(result => {
                this.src = result.data.result
            })
        },
        emptygetbase64() {
            this.base64_text = ""
            this.base64_src = ""
        },
        getbase64() {
            this.base64_src = this.base64_text
        },
        emptygetimg() {
            this.img_text = ""
            this.img_src = ""
        },
        imgChangeFn(e) {
            this.img_src = e.target.files || e.dataTransfer.files
        },
        selectFn(e) {
            let ele = e.target
            if (ele.value == "") return
            try {
                ele.select()
            } catch (e) { }
        },
        getimg() {            
            if (this.img_src) {
                let files = this.img_src[0]
                let formdata = new FormData()
                
                if (!/^image/.test(files.type)) {
                    alert("仅支持图片转换")
                    return
                }
                /*
                if (files.size/1024 > 1024) {
                    alert("文件太大了,仅支持小于等于1M")
                    return
                }
                */
                formdata.append('file', files)

                axios({
                    url: "/base64",
                    method: "post",
                    data: formdata,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then(result => {
                    this.img_text = result.data
                })
            }
        }
    },
    mounted() {

    }
}    
</script>
