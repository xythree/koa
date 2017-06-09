<style lang="sass">

</style>

<template>
    <div class="">
        <select_list :selectList="selectList" :defalutValue="defalutValue" :selectListCallBack="selectListCallBack">
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
*       @string: defalutValue
*       @function: selectListCallBack(params: object)
*   }
*/

<select_list :selectList="selectList" :defalutValue="defalutValue" :selectListCallBack="selectListCallBack"></select_list>
            `,
            code: `

<style lang="sass" scoped>

.select_lists_ul {
    border: 1px solid #ddd;
    background: #fff;
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

