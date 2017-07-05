<style lang="sass" scoped>

</style>

<template>
    <div>
        <tree_box :children="item" :treeCallBack="treeCallBack" />

        <br />
        点了: {{result}}
    </div>
</template>

<script>
import tree_box from "./../tree_box/tree_box.vue"

export default {
    data() {
        return {
            result: "",
            item: [{
                name: "广东",
                checked: true,
                children: [{
                    name: "深圳",
                    checked: true,
                    children: [{
                        name: "宝安区"
                    },{
                        name: "南山区",
                        checked: false,
                        children: [{
                            name: "1区"
                        },{
                            name: "2区"
                        }]
                    },{
                        name: "福田区"
                    }]
                }, {
                    name: "广州",
                    checked: true,
                    children: [{
                        name: "白云区"
                    }]
                }, {
                    name: "珠海"
                }]
            }, {
                name: "北京",
                checked: true,
                children: [{
                    name: "东城区"
                }]
            }]
        }
    },
    components: {
        tree_box
    },
    methods: {
        treeCallBack(arr) {
            let temp = []
            let _n = ""

            arr.forEach(t => {
                if (!_n) {
                    _n = this.item[t]
                } else {
                    _n = _n.children[t]
                }
                temp.push(_n.name)
            })

            this.result = temp.join("-")
        }
    }
}
</script>

