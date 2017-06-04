<style lang="sass">

</style>

<template>
    <div class="">
        <select_list :selectList="selectList" :selectListCallBack="selectListCallBack">
        </select_list>
        <p>已选: {{demoText}}</p>
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

import select_list from "../select_list/select_list.vue"

export default {
    methods: {
        selectListCallBack(arg) {
            this.demoText = JSON.stringify(arg)
        }
    },
    components: {
        select_list
    },
    data() {
        return {
            demoText: "",
            selectList: [
                { name: "北京" },
                { name: "上海" },
                { name: "广州" },
                { name: "深圳" }
            ],
            demo: `
/*
*   :props {
*       @array: selectList
*       @function: selectListCallBack(params: object)
*   }
*/

<select_list :selectList="selectList" :selectListCallBack="selectListCallBack"></select_list>
            `,
            code: `

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
        max-height: 200px;
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
    <select_box :selectShow="selectShow" :value="value" :selectBoxCallBack="selectBoxCallBack">
        <ul>
            <li v-for="item in selectList" @click="getValue(item)">{{item.name}}</li>
        </ul>
    </select_box>
</template>


\<script\>
import select_box from "../select_box/select_box.vue"

export default {
    props: ["selectList", "selectCallBack"],
    data() {
        return {
            selectShow: false,
            value: ""
        }
    },
    components: {
        select_box
    },
    methods: {
        getValue(arg) {
            this.value = arg.name
            this.selectShow = false
            this.selectCallBack && this.selectCallBack(arg)
        },
        selectBoxCallBack(arg) {
            this.value = arg.value
            this.selectShow = arg.selectShow
            if (arg.clear) {
                this.selectCallBack && this.selectCallBack()
            }
        }
    }
}

\<\/script\>


            `
        }
    }
}
</script>

