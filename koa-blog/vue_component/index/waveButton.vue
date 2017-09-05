<style lang="sass">
.waveButtonDemo {
    height: 100%;
}
.btn {
    height: 36px;
    line-height: 36px;
    width: 96px;
    border-radius: 5px;
    border: 1px solid #ddd;
}
</style>

<template>
    <div class="waveButtonDemo">
        <div class="btn">
            <wave_button :waveCallBack="waveCallBack">OK</wave_button>
        </div>
        
        <div style="height: 50px">
            <p v-if="count">点击了按钮{{count}}次</p>
            <p v-if="show">点击了按钮</p>
        </div>
    
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

export default {
    components: {
        wave_button
    },
    methods: {
        waveCallBack() {
            this.count++
            this.show = true

            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.show = false
            }, 1000)
            
        }
    },
    data() {
        return {
            timer: "",
            show: false,
            count: 0,
            demo: `
/*
*   :props {
*       @function: waveCallBack(params: null)
*   }
*/

<div class="buttonStyle">
    <wave_button :waveCallBack="waveCallBack">OK</wave_button>
</div>
            `,
            code: `
<style lang="sass" scoped>
.wave_button_ripple {
    background: transparent;
    border: none;
    border-radius: 3px;
    position: relative;
    height: 100%;
    width: 100%;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    -webkit-tap-highlight-color:transparent;
    &:hover {
        background-color: hsla(0, 0%, 62%, .15);
    }
    .wave_ripple {
        position: absolute;
        background: hsla(0, 0%, 65%, 0.5);
        border-radius: 100%;
        transform: scale(0);
    }
    .animate {
        animation: ripple 0.55s linear;
    }
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
</style>

<template>
    <div @click="reppleClick" ref="button" class="wave_button_ripple">
        <slot></slot>
        <span class="wave_sripple" ref="repple" :class="{'animate': animate }"></span>
    </div>
</template>

\<script\>
    export default {
        props: ["waveCallBack"],
        data() {
            return {
                animate: false
            }
        },
        mounted() {
            let button = this.$refs.button
            let repple = this.$refs.repple
            let v = Math.max(button.offsetHeight, button.offsetWidth)

            repple.style.width = repple.style.height = v + "px"
            button.style.lineHeight = button.offsetHeight + "px"
        },
        methods: {
            reppleClick(e) {
                let ripple = this.$refs.repple
                let x = e.offsetX - ripple.offsetWidth / 2
                let y = e.offsetY - ripple.offsetHeight / 2

                ripple.style.left = x + "px"
                ripple.style.top = y + "px"
                this.animate = true

                this.$nextTick(() => {
                    setTimeout(() => {
                        this.animate = false
                    }, 660)
                })

                this.waveCallBack && this.waveCallBack()
            }
        }
    }
\<\/script\>
            `
        }
    }
}
</script>
