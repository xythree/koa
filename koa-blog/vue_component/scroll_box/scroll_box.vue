<style lang="sass" scoped>
.iscroll_box {
    position: relative;    
    overflow: hidden;
    user-select: none;
    .iscroll_box_content {
        position: relative;
        top: 0;
        left: 0;
        transition: top .25s;
    }
    .iscroll_box_bar {
        position: absolute;
        right: 0;
        top: 0;
        width: 8px;
        height: 100%;
        border-radius: 5px;
        background-color: #eee;

        span {
            position: absolute;
            width: 100%;
            height: 20px;
            border-radius: 5px;
            background-color:#333;
            transition: top .25s;
        }
        .active {
            transition: none;
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
    <div class="iscroll_box" @mouseover="iscrollBoxOver" @mouseout="iscrollBoxOut" ref="iscroll_box" :style="objStyle">
        <div class="iscroll_box_content" ref="iscroll_box_content" :style="topVal">
            <slot></slot>
        </div>
    
        <transition name="fade">
            <div class="iscroll_box_bar" @mousedown="iscrollBoxBarDown" v-show="navStatus" :style="{'background-color': config.c1}" ref="iscroll_box_bar">
                <span :style="spanStyle" :class="{'active': status}" @mousedown="iscrollBoxBarSpanDown" ref="iscroll_box_bar_span"></span>
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    props: ["config", "scrollCallBack", "value"],
    data() {
        return {
            navStatus: false,
            val: 0,
            num: 20,
            coe: 1,
            minVal: 0,
            bh: 0,
            hv: false,
            minH: 20,
            minHeight: 20,
            timer: "",
            status: false,
            y: 0
        }
    },
    watch: {
        value() {
            this.changeVal()
        }
    },
    computed: {
        _unit() {
            return this.config.unit || "px"
        },
        w() {
            return this.config.width || 200
        },
        h() {
            return this.config.height || 200
        },
        objStyle() {
            return {
                width: this.w + this._unit,
                height: this.h + this._unit
            }
        },
        topVal() {
            return {
                width: this.w - 8 + this._unit,
                top: this.val + this._unit
            }
        },
        spanStyle() {
            return {
                backgroundColor: this.config.c2,
                height: this.minHeight + this._unit,
                top: -this.val * this.coe + this._unit
            }
        },
        maxVal() {
            return this.bh - this.h
        }
    },
    methods: {
        changeVal() {
            this.val = -this.value

            if (this.value > this.val) {
                this.delatFn(-1)
            } else {
                this.delatFn(1)
            }
        },
        mousewheelFn(e) {
            this.delatFn(e.wheelDelta)
        },
        wheelEvent(docs, callback) {
            /*滚动事件*/
            let mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" /*FF doesn't recognize mousewheel as of FF3.x*/
            let delta /*小于0向下，大于0向上*/

            if (document.attachEvent) { /*if IE (and Opera depending on user setting)*/
                docs.attachEvent("on" + mousewheelevt, function (e) {
                    delta = e.wheelDelta
                    callback && callback(delta, e)
                })
            } else if (document.addEventListener) { /*WC3 browsers*/
                docs.addEventListener(mousewheelevt, function (e) {
                    if (e.wheelDelta) {
                        delta = e.wheelDelta
                    }
                    if (e.detail) {
                        delta = -e.detail
                    }
                    callback && callback(delta, e)
                }, false)
            }
        },
        delatFn(delta) {
            let obj = {
                box: this.$refs.iscroll_box_content
            }
            if (delta < 0) {
                if (this.val <= -this.maxVal) {
                    this.val = -this.maxVal
                    obj.type = "bottom"
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.calculation()
                    }, 150)
                } else {
                    this.val -= this.num
                    obj.type = "middle"
                }
            } else {
                if (this.val >= 0) {
                    this.val = 0
                    obj.type = "top"
                } else {
                    this.val += this.num
                    obj.type = "middle"
                }
            }
            obj.val = -this.val
            this.scrollCallBack && this.scrollCallBack(obj)
        },
        calculation() {
            this.bh = this.$refs.iscroll_box_content.offsetHeight
            this.minHeight = Math.max(this.minH, this.h / this.bh * this.h)

            this.coe = (this.h - this.minHeight) / (this.bh - this.h)

            this.spanStyle = {
                height: this.minHeight + this._unit
            }
        },
        iscrollBoxOver() {
            if (this.config.hoverStatus) {
                this.navStatus = true
            }
            this.hv = true
            this.wheelEvent(document, (d, e) => {
                if (this.hv) {
                    e.preventDefault()
                }
            })
        },
        iscrollBoxOut() {
            if (this.config.hoverStatus) {
                this.navStatus = false
            }
            this.hv = false
        },
        iscrollBoxBarSpanDown(e) {
            this.y = e.y - this.$refs.iscroll_box_bar_span.offsetTop
            this.status = true
        },
        iscrollBoxBarDown(e) {
            if (this.$refs.iscroll_box_bar_span.contains(e.target)) return
            if (e.offsetY > this.$refs.iscroll_box_bar_span.offsetTop) {
                this.val = -(e.offsetY - this.minHeight) / this.coe
                this.delatFn(-e.offsetY)
            } else {
                this.val = -e.offsetY / this.coe
            }

        }
    },
    mounted() {

        this.calculation()

        this.wheelEvent(this.$refs.iscroll_box, delta => {
            this.delatFn(delta)
        })

        if (this.$refs.iscroll_box_content.offsetHeight < this.h) {
            this.navStatus = false
        } else {
            this.navStatus = true
        }

        if (this.value) {
            this.val = -this.value
            this.changeVal()
        }

        document.addEventListener("mousemove", e => {
            if (!this.status) return
            let ny = e.y - this.y

            this.val = -ny / this.coe
            this.delatFn(-ny)
        }, false)

        document.addEventListener("mouseup", e => {
            this.status = false
        }, false)
    }
}

</script>
