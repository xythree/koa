<style lang="sass">

.scrollDemo {
    padding: 30px;
    .iscroll_box {
        background:#efe;
    }
}

</style>

<template>
    <div class="scrollDemo">
        <p>自定义滚动条,无限加载</p>
        <br />
        <scroll_box :value="value" :config="config" :scrollCallBack="scrollCallBack">
            <p v-for="item in arr">{{item}}</p>
        </scroll_box>
        <br />
        <p v-for="item in aa">
            <a href="javascript:;" @click="jump(item)">跳转到{{item}}</a>
        </p>
        <br />
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
import scroll_box from "../scroll_box/scroll_box.vue"

export default {
    mounted() {
       
    },
    components: {
        scroll_box
    },
    methods: {
        jump(n) {
            this.v = n
        },
        scrollCallBack(obj) {
            if (obj.type == "bottom") {
                let p = document.createElement("p")

                this.arr.push(this.arr.length)
                p.innerHTML = this.arr.length
                obj.box.appendChild(p)
            }
        }
    },
    computed: {
        arr() {
            let temp = []
            for (let i = 0; i < 50; i++) {
                temp.push(i)
            }
            return temp
        },
        value() {
            return this.v
        }
    },
    data() {
        return {
            aa: [0, 100, 300, 600],
            v: "",
            config: {
                width: 200,
                height: 200,
                unit: "px",
                hoverStatus: false
            },
            demo: `
/*
*   :props {
*       @number: value //定义滚动条的位置，非必需
*       @object: config: {
*                   width: 盒子的宽度，默认200
*                   height: 盒子的高度，默认200
*                   unit: 单位，默认px
*                   hoverStatus: 是否鼠标离开盒子后隐藏滚动条，默认false
*               }
*
*       @function: scrollCallBack(params: object) {box: "盒子容器的节点",type: "top|middle|bottom",val: "已滚动到的值"}
*   }
*/
    <scroll_box :value="value" :config="config" :scrollCallBack="scrollCallBack">
        <!--
            要嵌套的组件或者html
        -->
    </scroll_box>

            `,
            code: `
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
        background-color: #eee;
        user-select: none;

        span {
            position: absolute;
            width: 100%;
            height: 20px;
            border-radius: 5px;
            transition: top .5s;
            background-color:#333;
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
    <div class="iscroll_box" @mouseup="iscrollBoxUp" @mousemove="iscrollBoxMove" @mouseover="iscrollBoxOver" @mouseout="iscrollBoxOut" ref="iscroll_box" :style="objStyle">
        <div class="iscroll_box_content" ref="iscroll_box_content" :style="topVal">
            <slot></slot>
        </div>
    
        <transition name="fade">
            <div class="iscroll_box_bar" @mouseout="iscrollBoxBarOut" @mousedown="iscrollBoxBarDown" v-show="navStatus" :style="{'background-color': config.c1}" ref="iscroll_box_bar">
                <span :style="spanStyle" @mousedown="iscrollBoxBarSpanDown" ref="iscroll_box_bar_span"></span>
            </div>
        </transition>
    </div>
</template>

\<script\>

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
                this.status = false
            }
            this.hv = false
        },
        iscrollBoxMove(e) {
            if (!this.status) return
            let ny = e.offsetY - this.y

            this.val = (-ny - this.$refs.iscroll_box_bar_span.offsetTop) / this.coe
            this.delatFn(-ny)
        },
        iscrollBoxBarSpanDown(e) {
            this.y = e.offsetY
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
        },
        iscrollBoxBarOut() {
            this.status = false
        },
        iscrollBoxUp() {
            this.status = false
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
    }
}
\<\/script\>
            `
        }
    }
}
</script>
