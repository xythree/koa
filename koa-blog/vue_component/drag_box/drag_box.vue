<style lang="sass" scoped>

@mixin h($v) {
    height: $v;
    line-height: $v;
}

.idrag_box {
    position: fixed;
    min-width: 100px;
    border: 1px solid #ddd;
    border-radius: 3px;

    $v: 30px;
    .idrag_title {
        @include h($v);
        border-bottom: 1px solid #ddd;
        background: #eee;
        user-select: none;
        cursor: move;

        h3 {
            float: left;
            margin: 0;
            padding-left: 10px;
            font-weight: normal;
            font-size: 14px;
        }
        .idrag_close {
            float: right;
            width: $v;
            @include h($v);
            text-align: center;
            cursor: pointer;
        }
    }
    .idrag_content {
        padding: 10px;
        background: #fff;
    }
    
}

</style>

<template>
    <div class="idrag_box" ref="idrag_box" v-show="show" :style="styleObj">
        <div class="idrag_title" @mousedown="downFn">
            <h3>提示</h3>
            <a class="idrag_close" @click="closeFn">X</a>
        </div>
        <div class="idrag_content">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            show: true,
            dragStatus: false,
            x: window.innerWidth/2.5,
            y: window.innerHeight/2.5,
            _x: 0,
            _y: 0,
            xMax: 0,
            yMax: 0
        }
    },
    computed: {
        styleObj() {
            return {
                left: this.x + "px",
                top: this.y + "px"
            }
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
            let idrag_box = this.$refs.idrag_box
            let _offset = this.offset(idrag_box)

            this.dragStatus = true
            this._x = e.pageX - _offset.left
            this._y = e.pageY - _offset.top
        },
        closeFn() {
            this.show = false
        },
        init() {
            let idrag_box = this.$refs.idrag_box
            
            this.xMax = window.innerWidth - idrag_box.offsetWidth
            this.yMax = window.innerHeight - idrag_box.offsetHeight
        }
    },
    mounted() {
        let doc = document

        doc.addEventListener("mousemove", e => {
            if (!this.dragStatus) return
            let x = e.pageX - this._x
            let y = e.pageY - this._y

            x = Math.min(x, this.xMax)
            y = Math.min(y, this.yMax)

            if (x < 0) x = 0
            if (y < 0) y = 0

            this.x = x
            this.y = y
        }, false)

        doc.addEventListener("mouseup", e => {
            this.dragStatus = false
        }, false)

        this.init()

        let timer
        window.addEventListener("resize", () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                this.init()
            }, 300)
        })
    }
}
</script>

