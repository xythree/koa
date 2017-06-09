<style lang="sass">
.buttonStyle {
    height: 36px;
    width: 96px;
    border-radius: 5px;
    border: 1px solid #ddd;
}
</style>

<template>
    <div class="calendarDemo">
    
        <div class="buttonStyle">
            <wave_button :waveCallBack="waveCallBack">OK</wave_button>
        </div>
    
        <alert_box :alertBoxStatus="alertBoxStatus" :alertBoxText="alertBoxText" :alertBoxCallBack="alertBoxCallBack"></alert_box>
    
        <pre>
                    <code class="html">
                        {{demo}}
                    </code>
                </pre>
        <pre>
                    <code class="html">
                        {{code}}
                    </code>
                </pre>
    </div>
</template>

<script>
import wave_button from "../wave_button/wave_button.vue"
import alert_box from "../alert/alert.vue"

export default {
    components: {
        wave_button,
        alert_box
    },
    methods: {
        waveCallBack() {
            this.alertBoxStatus = true
            this.alertBoxText = "弹出提示框"
        },
        alertBoxCallBack(arg) {
            if (arg) {
                alert("点击了确定")
            } else {
                alert("点击了取消")
            }
            this.alertBoxStatus = false
            this.alertBoxText = ""
        }
    },
    data() {
        return {
            alertBoxStatus: "",
            alertBoxText: "",
            demo: `
/*
*   :props {
*       @boolean: alertBoxStatus //显示状态
*       @string: alertBoxText //显示的文本
*       @function: alertBoxCallBack(params: boolean) //true 确定按钮，false 取消按钮
*   }
*/

<alert_box :alertBoxStatus="alertBoxStatus" :alertBoxText="alertBoxText" :alertBoxCallBack="alertBoxCallBack"></alert_box>
            `,
            code: `
<style lang="sass" scoped>
@mixin center_center ($pos: absolute,$left: 50%, $top: 50%, $other: "") {
    position: $pos;
    left: $left;
    top: $top;
    @if $other == "" {
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    } @else {
        -webkit-transform: translate(-50%, -50%) $other;
        transform: translate(-50%, -50%) $other;        
    }
}
@function v($v) {
    @return $v+px;
}
.alertBox {
    @include center_center($pos: fixed);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 999999;
    .alertBoxAni {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        animation: ani_scale .25s ease-out both;
    }
    .alertBoxContent {
        @include center_center($top: 35%);        
        width: 400px;
        background: #fff;
        border-radius: 5px;
        h3 {
            padding: v(5) v(10);
            font-weight: normal;
            border-bottom: 1px dotted #ddd;
            background: #eee;
            border-radius: 5px 5px 0 0;
            font-size: 14px;
            $v: 35;
            span {
                float: right;
                height: 25px;
                line-height: 25px;
                width: v($v);
                text-align: center;
                cursor: pointer;
            }
        }
        .alertBoxText {
            min-height: v(100);
            max-height: v(380);
            overflow-y: auto;
            padding: v(20);
        }
        .alertBoxBtn {
            $v: 35;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            height: v($v);
            line-height: v($v);
            border-top: 1px dotted #ddd;
            text-align: center;
            a {
                -webkit-box-flex: 1;
                -ms-flex: 1;
                flex: 1;
                color: #333;
                text-decoration: none;
                transition: all .5s ease-out;
                &:hover {
                    background: #eee;
                }
            }
            a:last-child {
                border-left: 1px dotted #ddd;
            }
        }
    }
}
@keyframes ani_scale {
    0% {
        opacity: 0;
        transform: translateY(-50px);
    }
    95% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<template>
    <div class='alertBox' v-show='alertBoxStatus'>
        <div class="alertBoxAni" >
            <div class='alertBoxContent' v-show='alertBoxStatus'>
                <h3>提示
                    <span @click='close'>X</span>
                </h3>
                <div class='alertBoxText'>{{alertBoxText}}</div>
                <div class='alertBoxBtn'>
                    <a href='javascript:;' @click='close'>取消</a>
                    <a href='javascript:;' @click='sure'>确定</a>
                </div>
            </div>        
        </div>
    </div>
</template>

\<script\>
export default {
    props: ["alertBoxStatus","alertBoxText", "alertBoxCallBack"],
    methods: {
        close() {
            this.alertBoxCallBack && this.alertBoxCallBack(false)
        },
        sure() {
             this.alertBoxCallBack && this.alertBoxCallBack(true)
        }
    }
}
\<\/script\>
            `
        }
    }
}
</script>
