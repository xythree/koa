
<style>
* {
    padding: 0;
    margin: 0;
}

body {
    font-size: 14px;
}

h6 {
    margin: 5px;
}

table {
    border-collapse: collapse;
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

.ipagination {
    margin: 50px 0;
}
</style>


<template>
    <div>
        
        <input type="text" v-model="code" @keyup.enter="search" />
        <ul class="list">
            <li v-for="item in list">
                <p>基本: {{item.basic}}</p>
                <p>增长: {{item.increase}}</p>
                <p>最新年度净资产:{{item.righaggr}}</p>
            </li>
        </ul>
    </div>
</template>

<script>

import axios from "axios"


export default {
    data() {
        return {
            code: "",
            list: []
        }
    },
    methods: {
        abc(a, b, c) {
            //var a = a.replace(/(万元|,)/g, "").split(/\s/) //经营活动产生的现金流量净额
            //var b = b.replace(/(万元|,)/g, "").split(/\s/) //资本支出
            //var c = c.replace(/(万元|,)/g, "").split(/\s/) //净利润
            var d = [] //净现金流

            a.forEach((t, i) => {
                console.log(t, b[i])
                d.push(t - b[i])
            })

            var _b = b.reduce((c, p) => {
                return +c + +p
            })

            var _d = d.reduce((c, p) => {
                return +c + +p
            })
            
            return {
                basic: (_d / _b) * 100 + "%",
                increase: ((d.shift() - d.pop()) / _b) * 100 + "%"
            }

        },
        search() {
            axios.get("/filter", {
                params: {
                    type: "code",
                    code: this.code
                }
            }).then(data => {
                let d = data.data
 
                if (d.length) {
                    let biznetcflow = []
                    let acquassetcash = []
                    let parenetp = []

                    d.forEach((t, i) => {
                        biznetcflow.push(t.biznetcflow)
                        acquassetcash.push(t.acquassetcash)
                        parenetp.push(t.parenetp)
                    })

                    let obj = this.abc(biznetcflow, acquassetcash, parenetp)

                    obj.righaggr = d[0].righaggr

                    this.list = [obj]

                }

            })
        }
    },
    mounted() {

    }
}

</script>



