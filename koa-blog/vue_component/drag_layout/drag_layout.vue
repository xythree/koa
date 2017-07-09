<style lang="sass" scoped>
@mixin h($v) {
    height: $v;
    line-height: $v;
}


.idrag_box {    
    margin: 5px;
    width: 250px;    
    border: 1px solid #ddd;
    border-radius: 3px;    
    transition: all .25s;
    -webkit-tap-highlight-color: transparent;

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
        span {
            float: right;
            padding: 0 10px;
            cursor: pointer;
        }
    }
    .idrag_content {
        padding: 10px;
        background: #fff;
    }
}
.dragStatus {
    transition: none;
}
.empty {
    border: 1px dashed #ddd;
    overflow: hidden;
}
</style>

<template>
    <div class="idrag_parent" ref="idrag_parent">
    
        <div v-for="(item, index) in arr" class="idrag_box" :class="{'empty': item == null, 'dragStatus': index == temp &&dragStatus}" ref="idrag_box">
            <div class="idrag_title" @mousedown="downFn($event, index)" @touchstart="downFn($event, index)">
                <h3>{{item.name}} </h3>
                <span @click="downMove(index)">{{index == arr.length - 1 ? "&nbsp;" : "↓"}}</span>
                <span @click="upMove(index)">{{index == 0 ? "&nbsp;" : "↑"}}</span>
            </div>
            <div class="idrag_content"></div>
        </div>
    
        <div v-show="_target" ref="empty" class="idrag_box empty"></div>
    
    </div>
</template>

<script>

export default {
    data() {
        return {
            arr: [
                { name: "a111" },
                { name: "b222" },
                { name: "c333" },
                { name: "d444" },
                { name: "e555" },
                { name: "f666" }
            ],
            dragStatus: false,
            ax: 0,
            ay: 0,
            x: 0,
            y: 0,
            _x: 0,
            _y: 0,
            xMax: 0,
            yMax: 0,
            _target: false,
            index: "",
            temp: "",
            empty: "",
            dir: 0
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
        upMove(index) {
            if (index == 0) return
            this.upToggle(index)
        },
        downMove(index) {
            if (index == this.arr.length - 1) return
            this.downToggle(index)
        },
        upToggle(ind) {
            this.toggle(ind, ind - 1)
        },
        downToggle(ind) {
            this.toggle(ind, ind + 1)
        },
        toggle(ind, num) {
            let temp = this.arr[ind]
            this.arr.splice(ind, 1)
            this.arr.splice(num, 0, temp)
        },
        downFn(e, index) {
            let _e = e
            if (_e.targetTouches) {
                _e = _e.targetTouches[0]
            }
            if (e.currentTarget != e.target) return
            this._target = e.currentTarget.parentNode
            if (this._target.className != "idrag_box") return
            let _offset = this.offset(this._target)

            this._target.style.position = "fixed"
            this.dragStatus = true
            this.ax = _offset.left
            this.ay = _offset.top
            this._x = _e.pageX - _offset.left
            this._y = _e.pageY - _offset.top
            this._target.style.left = _offset.left + "px"
            this._target.style.top = _offset.top + "px"
            this.index = this.temp = index
            this.empty = this.$refs.empty
            this.empty.style.height = this._target.offsetHeight - 2 + "px"
            this.$refs.idrag_parent.insertBefore(this.empty, this.$refs.idrag_box[index])
            this.calcWH()
        },
        calcWH() {
            let idrag_box = this._target

            this.xMax = window.innerWidth - idrag_box.offsetWidth
            this.yMax = window.innerHeight - idrag_box.offsetHeight
        }
    },
    mounted() {
        let doc = document,
            mobile = window.navigator.userAgent.match(/(iPhone|iPod|Android|iOS)/i) ? true : false,
            _move = mobile ? "touchmove" : "mousemove",
            _end = mobile ? "touchend" : "mouseup"

        doc.addEventListener(_move, e => {
            let _e = e
            if (!this.dragStatus) return
            if (e.targetTouches) {
                e.preventDefault()
                _e = e.targetTouches[0]
            }            
            let x = _e.pageX - this._x
            let y = _e.pageY - this._y

            x = Math.min(x, this.xMax)
            y = Math.min(y, this.yMax)

            if (x < 0) x = 0
            if (y < 0) y = 0

            this.dir = y - this.y

            this.x = x
            this.y = y


            this.$refs.idrag_box.forEach((t, i) => {
                let _offset = this.offset(t)

                if (this._target != t) {
                    if (this.x >= _offset.left && this.x <= _offset.left + t.offsetWidth && this.y >= _offset.top && this.y <= _offset.top + t.offsetHeight) {
                        this.index = i
                        if (this.dir > 0) {
                            if (this.temp > i) {
                                this.index = i + 1
                            }
                            this.$refs.idrag_parent.insertBefore(this.empty, this.$refs.idrag_box[i + 1])
                        } else {
                            if (this.temp < i) {
                                this.index = i - 1
                            }
                            this.$refs.idrag_parent.insertBefore(this.empty, this.$refs.idrag_box[i])
                        }

                    }
                }
            })

            let _empty = this.offset(this.empty)

            if (this.ax >= _empty.left && this.ax <= _empty.left + this.empty.offsetWidth && this.ay >= _empty.top && this.ay <= _empty.top + this.empty.offsetHeight) {
                this.index = this.temp
            }
            this._target.style.left = this.x + "px"
            this._target.style.top = this.y + "px"

        }, false)

        let timer

        doc.addEventListener(_end, e => {
            this.dragStatus = false

            if (this._target) {
                let _empty = this.offset(this.$refs.empty)

                this._target.style.left = _empty.left + "px"
                this._target.style.top = _empty.top - doc.body.scrollTop + "px"

                clearTimeout(timer)

                timer = setTimeout(() => {

                    this._target.removeAttribute("style")
                    this._target = false

                    //if (this.x == 0 || this.y == 0) return
                    //if (this.index != this.temp) {
                    this.toggle(this.temp, this.index)
                    //}

                }, 150)
            }
        }, false)

    }
}
</script>

