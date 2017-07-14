<style lang="sass" scoped>
.iprocess_box {
    .iprocess_content {
        width: 100%;
        height: 2px;
        background: #ddd;
        
        em {
            position: relative;
            left: 0;
            top: 0;
            display: block;
            height: 100%;
            width: 0;
            background-color: #666;
            transition: width .25s;
        }
        b {
            $v: 10px;
            position: absolute;
            top: 50%;
            right: -$v/2;
            width: $v;
            height: $v;
            transform: translateY(-50%);
            border-radius: 50%;
            background-color: #666;
            cursor: pointer;
        }
    }
    .active {
        em {
            transition: none;
        }
    }
}
</style>

<template>
    <div class="iprocess_box">
        <div class="iprocess_content" :style="{'background-color': config && config.c1}" :class="{'active': status}" ref="iprocess_content" @click="clickFn">
            <em :style="{'width': val + 'px', 'background-color': config && config.c2}">
                <b ref="b" @mousedown="downFn" @touchstart="downFn" :style="{'background-color': config && config.c3}"></b>
            </em>
        </div>
    </div>
</template>

<script>

export default {
    props: ["processCallBack", "value", "config", "drag", "stop"],
    data() {
        return {
            process: 0,
            val: 0,
            status: false,
            x: 0,
            maxVal: 0,
            timer: ""
        }
    },
    computed: {
        _drag() {
            return this.drag || false
        }
    },
    watch: {
        value() {
            this.setValue(this.value)
        }
    },
    methods: {
        offset(obj) {
            let ele = obj,
                left = ele.offsetLeft,
                top = ele.offsetTop

            while (ele.offsetParent && ele.offsetParent.tagName.toLowerCase() != "body") {
                ele = ele.offsetParent
                left += ele.offsetLeft
                top += ele.offsetTop
            }

            return { left, top }
        },
        downFn(e) {
            this.status = true
            if (e.targetTouches) {
                let _e = e.targetTouches[0]
                this.x = _e.pageX - this.val
            } else {
                this.x = e.pageX - this.val
            }
        },
        getMaxVal() {
            this.maxVal = this.$refs.iprocess_content.offsetWidth
            this.val = this.process * this.maxVal
        },
        clickFn(e) {
            if (!this._drag) return
            if (e.target == this.$refs.b) return
            let val = e.pageX - this.offset(e.target).left

            this.setVal(val, true)
        },
        setVal(v, flag) {
            this.val = v
            this.process = this.toFixedFn(this.val / this.maxVal)
            this.processCallBack && this.processCallBack(this.process, flag || this.status)
        },
        toFixedFn(v) {
            return +v.toFixed(2)
        },
        setValue(v) {
            if (this.stop) return
            if (!this._drag) return
            let val = v

            if (val > 1) {
                val = 1
            } else if (val < 0) {
                val = 0
            }

            val = this.toFixedFn(val * this.maxVal)
            this.setVal(val)
        },
        init() {
            let doc = document,
                mobile = window.ontouchstart === undefined ? false : true,
                _move = mobile ? "touchmove" : "mousemove",
                _end = mobile ? "touchend" : "mouseup"

            doc.addEventListener(_move, e => {
                let _e = e
                if (!this._drag) return
                if (!this.status) return
                if (e.targetTouches) {
                    _e = e.targetTouches[0]
                }

                let nx = Math.max(_e.pageX - this.x, 0)
                let val = Math.min(Math.abs(nx), this.maxVal)

                this.setVal(val)

            }, false)

            doc.addEventListener(_end, e => {
                this.status = false
            }, false)

            window.addEventListener("resize", () => {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.getMaxVal()
                }, 500)
            })

            this.getMaxVal()

            if (this.value) {
                this.setValue(this.value)
            }
        }
    },
    mounted() {
        this.init()
    }
}

</script>
