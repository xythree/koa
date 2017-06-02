
<style lang="sass" scoped>
.wave-button-ripple {
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
    .wave-ripple {
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
    <div @click="reppleClick" ref="button" class="wave-button-ripple">
        <slot></slot>
        <span class="wave-ripple" ref="repple" :class="{'animate': animate }"></span>
    </div>
</template>


<script>
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
</script>

