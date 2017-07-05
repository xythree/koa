<style lang="sass" scoped>
.itree_box {
    
    .itree_parent {
        $v: 20px;
        display: inline-block;
        margin: 0;
        padding-left: 10px;
        height: $v;
        line-height: $v;
        cursor: pointer;

        span {
            display: inline-block;
            width: 25px;
            text-align: center;
        }
    }
}
</style>

<template>
    <div class="itree_box">
        <p @click="toggle" class="itree_parent">    
            <input type="checkbox" v-model="item.checked" />{{item.name}}
        </p>
        <tree_box v-show="item.checked && item.children.length" :indexes="indexes" :treeCallBack="treeCallBack" :children="item.children" />
    </div>
</template>

<script>
import tree_box from "./tree_box.vue"

export default {
    props: ["item", "indexes", "treeCallBack"],
    methods: {
        toggle() {
            this.item.checked = !this.item.checked
        }
    },
    components: {
        tree_box
    }
}
</script>

