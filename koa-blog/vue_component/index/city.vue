<style lang="sass">
.buttonStyle {
    height: 36px;
    width: 96px;
    border-radius: 5px;
    border: 1px solid #ddd;
}
</style>

<template>
    <div class="calendarDemo">
    
        
    
        <city :cityList="cityList" :defaultValue="defaultValue" :cityCallBack="cityCallBack"></city>
        <p>已选：{{demoText}}</p>
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
import city from "../city/city.vue"

export default {
    components: {
        city
    },
    methods: {
        cityCallBack(arg) {
            this.demoText = arg
        }
    },
    data() {
        return {
            demoText: "",
            defaultValue: "广东/广州/白云区",
            cityList:  [
                {name: "广东", child: [
                    {name: "广州", child: [
                        {name: "天河区", child: []},
                        {name: "白云区", child: []}
                    ]},
                    {name: "深圳", child: [
                        {name: "南山区", child: []},
                        {name: "宝安区", child: []}
                    ]}
                ]},
                {name: "北京", child: [
                    {name: "东城区", child: []},
                    {name: "西城区", child: []}
                ]},
                {name: "广西", child: [
                    {name: "南宁", child: [
                        {name: "隆安", child: []},
                        {name: "靖西", child: []}
                    ]},
                    {name: "百色", child: [
                        {name: "平果", child: []},
                        {name: "田东", child: []}
                    ]}
                ]}
            ],
            demo: `
/*
*   :props {
*       @array: cityList //显示的文本
*       @string: defaultValue //填入默认地址,如:广东/广州/白云区  非必需
*       @function: cityCallBack(params: string)
*   }
*/

<city :cityList="cityList" :defaultValue="defaultValue" :cityCallBack="cityCallBack"></city>
            `,
            code: `


<style lang="sass" scoped>


.select_box {
    .select_lists_box {
        
        ul {
            float: left;
            vertical-align: top;
            width: 57px;            
            height: 100%;
            border: 1px solid #ddd;
            background: #fff;
            
            &:nth-child(2),
            &:nth-child(3) {
                border-left: none;
            }
        }

        .active {
            color:#f00;
        }
        
        li {
            position: relative;

            &:hover {
                cursor: pointer;
                background: #eee;
            }           
            &:last-child {
                border-bottom: none;
                padding-bottom: 5px;
            }
        }
        .next {        
            &:after {
                position: absolute;
                content: ">";
                font-size: 14px;
                right: 5px;
                font-family: arial;
                color: #d0d0d0;
            }
        }
    }
}

</style>

<template>
    <select_box :selectShow="selectShow" :value="value" :selectBoxCallBack="selectBoxCallBack">
        <ul>
            <li v-for="(item,index) in cityList" :class="{next: item.child.length, active: cityInd1 != null && cityList[cityInd1].name == item.name}" @click="getValue(item, index)" :title="item.name">{{item.name}}</li>
        </ul>
        <ul v-show="cityList2.length">
            <li v-for="(item,index) in cityList2" :class="{next: item.child.length, active: cityInd2 != null && cityList2[cityInd2].name == item.name}" @click="getValue2(item, index)" :title="item.name">{{item.name}}</li>
        </ul>
        <ul v-show="cityList3.length">
            <li v-for="(item,index) in cityList3" :class="{active: cityInd3 != null && cityList3[cityInd3].name == item.name}" @click="getValue3(item,index)" :title="item.name">{{item.name}}</li>
        </ul>
    </select_box>
</template>

\<script\>

import select_box from "../select_box/select_box.vue"

export default {
    props: ["cityList", "defaultValue", "cityCallBack"],
    data() {
        return {
            selectShow: false,
            value: this.defaultValue || "",
            cityInd1: null,
            cityInd2: null,
            cityInd3: null,
            cityList2: [],
            cityList3: [],
            emptyVal: false,
            temp: []
        }
    },
    components: {
        select_box
    },
    created() {
        if (this.defaultValue) {
            let valArr = this.defaultValue.split("/")
            
            this.setDefaultValue("", valArr[0], () => {
                this.$nextTick(() => {
                    this.setDefaultValue(2, valArr[1], () => {
                        this.$nextTick(() => {
                            this.setDefaultValue(3, valArr[2], () => {
                                this.selectShow = false
                            })
                        })
                    })
                })
            })
        }
    },
    methods: {
        setDefaultValue(num, val, callback) {
            for(let i = 0, len = this["cityList" + num].length; i < len; i++) {
                if (this["cityList" + num][i].name == val) {
                    this["getValue" + num](this["cityList" + num][i], i)
                    callback && callback()
                    break
                }
            }
        },
        selectBoxCallBack(arg) {
            this.value = arg.value
            this.selectShow = arg.selectShow
            if (arg.clear) {
                this.clearEmpty && this.clearEmpty()
            }            
        },
        showSelect() {
            this.selectShow = !this.selectShow
        },
        clearEmpty() {
            this.cityInd1 = null
            this.cityInd2 = null
            this.cityInd3 = null
            this.value = ""
            this.emptyVal = false
            this.cityList2 = []
            this.cityList3 = []
            this.temp = []
            this.selectShow = false
        },
        getValue(arg, index) {            
            this.cityList2 = arg.child
            this.cityList3 = []
            this.temp = []
            this.temp[0] = arg.name
            this.cityInd1 = index
            this.cityInd2 = null
            this.cityInd3 = null
        },
        getValue2(arg, index) {
            this.cityList3 = arg.child
            this.temp[1] = arg.name
            this.cityInd2 = index
            this.cityInd3 = null
            if (!this.cityList3.length) {
                this.showSelect()
                this.setValue()
            }
        },
        getValue3(arg, index) {
            this.temp[2] = arg.name
            this.cityInd3 = index
            this.showSelect()
            this.setValue()
        },
        setValue() {
            this.value = this.temp.join("/")
            this.emptyVal = true
            this.cityCallBack && this.cityCallBack(this.value)
        }
    }
}

\<\/script\>
            `
        }
    }
}
</script>
