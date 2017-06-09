
<style lang="sass" scoped>

.select_lists_ul {
    border: 1px solid #ddd;
    background: #fff;
}

</style>

<template>
    <select_box :selectShow="selectShow" :value="value" :selectBoxCallBack="selectBoxCallBack">
        <ul class="select_lists_ul">
            <li v-for="item in selectList" @click="getValue(item)">{{item.name}}</li>
        </ul>
    </select_box>
</template>


<script>
import select_box from "../select_box/select_box.vue"

export default {
    props: ["selectList", "defalutValue", "selectListCallBack"],
    data() {
        return {
            selectShow: false,
            value: this.defalutValue || ""
        }
    },
    components: {
        select_box
    },
    methods: {
        getValue(arg) {
            this.value = arg.name
            this.selectShow = false
            this.selectListCallBack && this.selectListCallBack(arg)
        },
        selectBoxCallBack(arg) {
            this.value = arg.value
            this.selectShow = arg.selectShow
            if (arg.clear) {
                this.selectListCallBack && this.selectListCallBack()
            }
        }
    }
}

</script>

