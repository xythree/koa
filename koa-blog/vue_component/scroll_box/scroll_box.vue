<style lang="sass" scoped>
.iscroll_box {
    position: relative;
    overflow: hidden;

    .iscroll_box_content {
        position: relative;
        top: 0;
        left: 0;
        transition: top .5s;
    }
    .iscroll_box_bar {
        position: absolute;
        right: 0;
        top: 0;
        width: 8px;
        height: 100%;
        border-radius: 5px;
        background: #eee;

        span {
            position: absolute;
            width: 100%;
            height: 20px;
            border-radius: 5px;
            transition: top .5s;
            background:#333;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

</style>

<template>
    <div class="iscroll_box" ref="iscroll_box" :style="objStyle">
        <div class="iscroll_box_content" ref="iscroll_box_content" :style="topVal">
            1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br /> 1
            <br />
    
        </div>
        <transition name="fade">
            <div class="iscroll_box_bar" v-show="navStatus">
                <span :style="spanStyle"></span>
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    props: ["width", "height", "unit"],
    data() {
        return {
            navStatus: false,
            val: 0,
            num: 20,
            coe: 1,
            maxVal: 0,
            minVal: 0,
            spanStyle: {}
        }
    },
    computed: {
        _unit() {
            return this.unit || "px"
        },
        w() {
            return this.width || 200
        },
        h() {
            return this.height || 200
        },
        objStyle() {
            return {
                width: this.w + this._unit,
                height: this.h + this._unit
            }
        },
        topVal() {
            return {
                top: this.val + this._unit
            }
        }
    },
    methods: {
        wheelEvent(docs, callback) {
            //滚动事件
            var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
            var delta //向下-120，向上 120

            if (document.attachEvent) { //if IE (and Opera depending on user setting)
                docs.attachEvent("on" + mousewheelevt, function (e) {
                    delta = e.wheelDelta
                    callback && callback(delta)
                })
            } else if (document.addEventListener) { //WC3 browsers
                docs.addEventListener(mousewheelevt, function (e) {
                    if (e.wheelDelta) {
                        delta = e.wheelDelta
                    }
                    if (e.detail) {
                        delta = -e.detail
                    }
                    callback && callback(delta)
                }, false)
            }
        }
    },
    mounted() {
        let refs = this.$refs

        this.wheelEvent(refs.iscroll_box, delta => {
            if (delta < 0) {
                if (this.val <= -this.maxVal) {
                    this.val = -this.maxVal
                } else {
                    this.val -= this.num
                }
            } else {
                if (this.val >= 0) {
                    this.val = 0
                } else {
                    this.val += this.num
                }
            }
            this.spanStyle = {
                height: this.coe * refs.iscroll_box.offsetHeight + this._unit,
                top: -this.val * this.coe + this._unit
            }
        })
        
        refs.iscroll_box.addEventListener("mouseenter", () => {
            this.navStatus = true
        }, false)

        refs.iscroll_box.addEventListener("mouseleave", () => {
            this.navStatus = false
        }, false)

        this.maxVal = refs.iscroll_box_content.offsetHeight - refs.iscroll_box.offsetHeight
        this.coe = refs.iscroll_box.offsetHeight / refs.iscroll_box_content.offsetHeight
        this.spanStyle = {
            height: this.coe * refs.iscroll_box.offsetHeight + this._unit
        }
    }
}

</script>
