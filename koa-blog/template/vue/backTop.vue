<style lang="sass" scoped>
.iback_top_box {
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 50px;
    cursor: pointer;

    .iback_top {
        width: 100%;
        height: 89px;
        background: url(/images/back_top.png) no-repeat center;
    }
}
</style>

<template>
    <transition name="fade">
        <div class="iback_top_box" v-show="show">
            <div class="iback_top" title="backTop" @click="backTop"></div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            timer: "",
            show: false
        }
    },
    methods: {
        backTop() {
            this.timer = setTimeout(() => {
                let ibd = document.body

                if (ibd.scrollTop <= 0) {
                    clearTimeout(this.timer)
                } else {
                    ibd.scrollTop -= 30
                    this.backTop()
                }
            }, 3)
        }
    },
    mounted() {
        document.addEventListener("scroll", () => {
            if (document.body.scrollTop > 350) {
                this.show = true
            } else {
                this.show = false
            }
        }, false)
    }
}
</script>