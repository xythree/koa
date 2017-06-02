

<style lang="sass">

.icontent {
    width: 1100px;
    margin: 0 auto;
    overflow: hidden;

    .irouter-list {
        position: fixed;
        padding-top: 100px;
        width: 180px;
        height: 100%;
        border-right: 1px solid #ddd;

        li {
            text-align: right;
            padding-right: 20px;
            margin: 5px 0;

            a {
                text-decoration: none;
            }
        }
    }
    .irouter-view {
        padding: 30px;
        height: 80%;
        margin-left: 200px;
    }
}

</style>

<template>
    <div class="icontent">
        <ul class="irouter-list">
            <li><router-link to="/calendar">calendar</router-link></li>
            <li><router-link to="/waveButton">waveButton</router-link></li>
        </ul>

        <div class="irouter-view">
            <router-view></router-view>
        </div>
        
    
        <div>
            <select_list :selectList="selectList" :selectCallBack="selectCallBack"></select_list>
        </div>
        <!--div>            
            <calender_box :defaultTime="defaultTime" :calendarCallBack="calendarCallBack"></calender_box>
        </div-->
        <div>
            <calendar_select :calendarSelectCallBack="calendarSelectCallBack"></calendar_select>
        </div>
        <div>
            <pagination_box :total="total" :paginationCallBack="paginationCallBack"></pagination_box>
        </div>
    </div>
</template>

<script>




//import wave_button from "./wave_button/wave_button.vue"
import select_list from "./select_list/select_list.vue"
//import calender_box from "./calendar/calendar.vue"
import calendar_select from "./calendar/calendar_select.vue"
import pagination_box from "./pagination/pagination.vue"





export default {    
    data() {
        return {
            total: 90,
            selectList: [
                { name: "北京" },
                { name: "深圳" }
            ]
        }
    },
    components: {
        select_list,        
        calendar_select,
        pagination_box
    },
    methods: {
        selectCallBack(arg) {
            console.log(arg)
        },
        calendarCallBack(arg) {
            console.log("选择了" + arg)
        },
        calendarSelectCallBack(arg) {
            console.log("选择了" + arg)
        },
        paginationCallBack(arg) {
            console.log("第" + arg + "页")
        }
    }
}    
</script>


