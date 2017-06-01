

<style lang="sass">

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
            <a href="javascript:;" @click="prev" class="iprev" >上一月</a>
            <div class="idate_title">{{dateTitle}}</div>
            <a href="javascript:;" @click="next" class="inext" >下一月</a>
        </div>
        
        <ul>
            <li v-for="item of weeks" class="weeks">{{item}}</li>
            <li v-for="item of dw"></li>
            <li v-for="(item, index) of d2.d" @click="getVal(index+1)" :class="{today: date.d == index+1}">{{index + 1}}</li>            
        </ul>
        
    </div>

</template>


<script>

export default {
    props: ["defaultTime", "calendarCallBack"],
    data() {
        return {
            weeks: ["日","一","二","三","四","五","六"],
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
       },
	   getCalendarVal() {
		   return this.$store.getters.getCalendarVal
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

</script>






















