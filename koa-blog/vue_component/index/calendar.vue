<style lang="sass">
.calendarDemo {
    height: 100%;

    .calendar {
        height: 240px;
    }
}
</style>

<template>
    <div class="calendarDemo">
        <calendar_box :defaultTime="defaultTime" :calendarCallBack="calendarCallBack"></calendar_box>
        <p>已选日期: {{demoTime}}</p>
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
import calendar_box from "../calendar/calendar.vue"

export default {
    components: {
        calendar_box
    },
    methods: {
        calendarCallBack(arg) {
            this.demoTime = arg
        }
    },
    data() {
        return {
            defaultTime: "",
            demoTime: "",
            demo: `
/*
*   :props {
*       @string: defaultTime //2017-05-30  非必需
*       @function: calendarCallBack(params: string)
*   }
*/

<calendar_box :defaultTime="defaultTime" :calendarCallBack="calendarCallBack"></calendar_box>
            `,
            code: `

<style lang="sass" scoped>

    .calendar {
        width: 210px;
        text-align: center;
        
        .iprev,
        .inext {
            text-decoration: none;
            color: #333;
        }
        .iprev {
            float: left;
            margin-left: 5px;
        }
        .inext {
            float: right;
            margin-right: 5px;
        }
        .idate_title {
            display: inline-block;
        }
        
        .today {
            color: #f00;
        }
        
        ul {
            overflow: hidden;
        }
        
        li {
            float: left;
            display: inline;
            width: 30px;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
        }

    }
    

</style>

<template>
    <div class="calendar">
        <div class="calendar_header">
            <a href="javascript:;" @click="prev" class="iprev">上一月</a>
            <div class="idate_title">{{dateTitle}}</div>
            <a href="javascript:;" @click="next" class="inext">下一月</a>
        </div>
    
        <div class="calendar_list_box">
            <ul>
                <li v-for="item of weeks" class="weeks">{{item}}</li>
                <li v-for="item of dw"></li>
                <li v-for="(item, index) of d2.d" @click="getVal(index+1)" :class="{today: date.d == index+1}">{{index + 1}}</li>
            </ul>
        </div>
    
    </div>
</template>

\<script\>
    export default {
        props: ["defaultTime", "calendarCallBack"],
        data() {
            return {
                weeks: ["日", "一", "二", "三", "四", "五", "六"],
                d: [],
                d2: {},
                dw: []
            }
        },
        computed: {
            date() {
                if (this.defaultTime) {
                    let defaultTime = this.defaultTime.split(/[\,,\-,\/]/)
                    return this.getDate(defaultTime[0], defaultTime[1] - 1, defaultTime[2])
                }
                return this.getDate()
            }
        },
        methods: {
            getD(date) {
                return this.getDate(date.y, date.m - 1, 1)
            },
            getD2(date) {
                return this.getDate(date.y, date.m, 0)
            },
            getDate(y, m, d) {
                let date
                if (arguments.length) {
                    date = new Date(y, +m, d)
                } else {
                    date = new Date()
                }

                return {
                    date,
                    y: date.getFullYear(),
                    m: date.getMonth() + 1,
                    d: date.getDate(),
                    w: date.getDay()
                }
            },
            prev() {
                this.date.m -= 1
                this.renderDate()
            },
            next() {
                this.date.m += 1
                this.renderDate()
            },
            getVal(index) {
                let result = this.resultDate(index).join("-")

                this.calendarCallBack && this.calendarCallBack(result)
            },
            resultDate(index) {
                return [this.d.y, this.d.m, index || this.date.d]
            },
            renderDate() {
                this.d = this.getD(this.date)
                this.d2 = this.getD2(this.d)
                this.dw = this.d.w
                this.dateTitle = this.resultDate().join("/")
            }
        },
        mounted() {
            this.renderDate()
        }
    }
\<\/script\>
            `
        }
    }
}
</script>
