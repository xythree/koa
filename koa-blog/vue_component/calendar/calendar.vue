

<style lang="sass" scoped>

    .calendar {
        width: 210px;
        text-align: center;
        background: #fff;
        border: 1px solid #ddd;
        .calendar_header {
            overflow: hidden;
        }
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


<script>

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
                m: this.zeroFill(date.getMonth() + 1),
                d: this.zeroFill(date.getDate()),
                w: date.getDay()
            }
        },
        zeroFill(num) {
            return num < 10 ? "0" + +num : num
        },
        prev() {
            --this.date.m
            this.renderDate()
        },
        next() {
            ++this.date.m
            this.renderDate()
        },
        getVal(index) {
            let result = this.resultDate(index).join("-")

            this.calendarCallBack && this.calendarCallBack(result)
        },
        resultDate(index) {
            return [this.d.y, this.d.m, this.zeroFill(index || this.date.d)]
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

</script>






















