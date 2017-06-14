<style lang="sass" scoped>
.irepload {
    position: fixed;
    left: 0;
    top: 0;
    height: 3px;
    width: 0; 
    background: #333;
    transition: all .5s;
}
.fade-leave {
    opacity: 1;
}
.fade-leave-active {
    transition: all .5s;
    opacity: 0;
}
</style>

<template>
    <transition name="fade">
        <div v-show="show" class="irepload" :style="{width: w}"></div>
    </transition>
</template>


<script>
export default {
    data() {
        return {
            show: true,
            timer: "",
            w: 0
        }
    },
    methods: {
        repload() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                if (document.readyState == "complete") {
                    this.w = "100%"
                    setTimeout(() => {
                        this.show = false
                    }, 1000)
                    return
                }
                this.repload()
            }, 30)
        }
    },
    created() {
        this.w = "75%"
    },
    mounted() {
        this.repload()
    }
}
</script>
