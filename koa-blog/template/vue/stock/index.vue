
<style>
*{padding: 0; margin: 0;}
body {
    font-size: 14px;
}
h6 {
    margin: 5px;
}
table {
    border-collapse:collapse;
}
td {
    padding: 5px;
    border: 1px solid #ddd;
    text-align: center;    
}
.red {
    color: #f00;
}
.list li {
    padding: 30px;    
    border-bottom: 1px dotted #ddd;
}

</style>


<template>
    <div>
        <ul class="list">
            <li v-for="item in list">
                <h5>{{item.name}}({{item.code}})</h5>
                <p>basic: {{item.basic}}</p>
                <p>increase: {{item.increase}}</p>
                <div>
                    <h6>ROE(摊薄)</h6>
                    <table-box :str="item.roe1"></table-box>
                </div>
                <div>
                    <h6>ROE(加权)</h6>
                    <table-box :company="item" :str="item.roe2"></table-box>
                </div>
                <div>
                    <h6 :class="{red: (item.totcurrasset - item.totliab) > item.totmktcap }">净净估值:({{item.totcurrasset - item.totliab > item.totmktcap}})</h6>
                    <p>流动资产: {{item.totcurrasset}} </p>
                    <p>总负债: {{item.totliab}} </p>
                    <p>总市值: {{item.totmktcap}} </p>
                    <p>流通市值: {{item.negotiablemv}} </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

import axios from "axios"
import Vue from "vue"

window.good = []

Vue.component("table-box", {
    props: ["str", "company"],
    data() {
        return {
            good: false
        }
    },
    computed: {
        data() {
            let obj = []
            let val = this.str.split(",")
            
            val.forEach((t, i) => {
                let temp = t.split(":")

                obj.push({
                    time: temp[0],
                    value: temp[1]
                })
            })

            let s = obj.every((t, i) => {
                return t.value >= 15
            })
            if (s) {
                this.good = true
                window.good.push(this.company)
            }

            return obj
        }
    },
    template: "<table><tbody><tr><td v-for='item in data'>{{item.time}}</td></tr><tr :class='{red: good}'><td v-for='item in data'>{{item.value}}</td></tr></tbody></table>"
})

export default {
    data() {
        return {
            list: []
        }
    },
    mounted() {
        axios.get("/stock", {
            params: {
                type: "all",
                code: "000001",
                basic: 80,
                increase: 23
            }
        }).then(data => {
            this.list = data.data

            /* 净净估值
            this.list = data.data.filter((t, i) => {
                return (t.totcurrasset - t.totliab) > (t.totmktcap)
            })
            */
        })
    }
}

</script>



