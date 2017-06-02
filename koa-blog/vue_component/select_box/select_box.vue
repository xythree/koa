
<style lang="sass" scoped>

$c1: #ddd;

.select_box {
    position: relative;
    width: 175px;
    display: inline-block;
    cursor: pointer;
    -webkit-tap-highlight-color:transparent;
    
    .select_ipt {
        input {
            text-indent: 5px;
            width: 150px;
            height: 22px;
            line-height: 22px;
            border: 1px solid $c1;
            border-radius: 3px 0 0 3px;
            background: #fff;
            vertical-align: top;
        }
        b {
            display: none;
            position: absolute;
            top: 1px;
            right: 24px;
            height: 22px;
            line-height: 21px;
            width: 22px;
            text-align: center;
            font-size: 12px;
            border-radius: 50%;
            background: $c1;
            transform: scale(.6);
            color: #999;
        }
        &:hover {
            b {
                display: block;
            }
        }
        span {
            position: absolute;
            top: 0;
            right: 0;
            height: 22px;
            width: 22px;
            vertical-align: middle;
            border: 1px solid $c1;
            border-left: none;
            border-radius: 0 3px 3px 0;
            background: #eee;
            
            &:after {
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: -5px;
                margin-top: -2px;
                content: "";
                width: 0;
                height: 0;
                border-width: 5px;
                border-color: #999 transparent transparent;
                border-style: solid;
                transform-origin: center 2px;
                transition: all .35s ease-out;
            }
        }
    }
    .select_lists_box {
        display: none;
        position: absolute;
        top: 24px;
        min-width: 172px;
        max-height: 240px;
        border: 1px solid $c1;
        border-radius: 0 0 3px 3px;
        background: #fff;
        overflow: auto;
        
        li {
            padding: 3px 5px;
            border-bottom: 1px dashed #eee;
            font-size: 12px;
            &:hover {
                cursor: pointer;
                background: #eee;
            }           
            &:last-child {
                border-bottom: none;
                padding-bottom: 5px;
            }
        }
    }
}
.select_show {
    .select_lists_box {
        display: block;
        transform-origin: center top;
        animation: show_ani .35s ease-out both;
		z-index: 888;
    }
    .select_ipt {
        span {
            &:after {
                transform: rotate(180deg);
            }
        }
    }
}
@keyframes show_ani {
    0% {
        opacity: 0;
        transform: rotateX(45deg);
    }
    100% {
        opacity: 1;
        transform: rotateX(0);
    }
}

</style>

<template>
    <div class="select_box" :class="{select_show: selectBoxShow}" v-close="closeFn">
        <div class="select_ipt">
            <input type="text" readonly v-model="value" @click="showSelect" />
            <span @click="showSelect"></span>
            <b v-show="emptyVal" title="清空" @click="clearEmpty">X</b>
        </div>
        <div class="select_lists_box">
            <slot></slot>
        </div>
    </div>
</template>


<script>
import close from "../close/close.vue"
export default {
    props: ["selectShow", "value", "selectBoxCallBack"],
    data() {
        return {

        }
    },
    computed: {
        selectBoxShow() {
            return this.selectShow
        },
        emptyVal() {
            return this.value
        }
    },
    directives: {
        close
    },
    methods: {
        setStatus(value, selectShow, clear) {
            this.selectBoxCallBack && this.selectBoxCallBack({
                clear,
                value,
                selectShow
            })
        },
        showSelect() {
            this.setStatus(this.value,!this.selectBoxShow)
        },
        clearEmpty() {
            this.setStatus("",this.selectBoxShow, true)
        },
        closeFn() {
            this.setStatus(this.value, false)
        }
    }
}

</script>

