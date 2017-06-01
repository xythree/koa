

<style lang="sass">

</style>

<template>
    <div>
        <div class="btn">
            <wave_button :waveCallBack="waveCallBack">OK</wave_button>
        </div>
    
        <div>
            <select_box :selectList="selectList" :selectCallBack="selectCallBack"></select_box>
        </div>
        <div>
            <calender_box :defaultTime="defaultTime" :calendarCallBack="calendarCallBack"></calender_box>
        </div>
        <div>
            <calendar_select :calendarSelectCallBack="calendarSelectCallBack"></calendar_select>
        </div>
    </div>
</template>


<script>

import wave_button from "./wave_button/wave_button.vue"
import select_box from "./select_box/select_box.vue"
import calender_box from "./calendar/calendar.vue"
import calendar_select from "./calendar/calendar_select.vue"

export default {
    data() {
        return {
            selectList: [
                { name: "北京" },
                { name: "深圳" }
            ],
            defaultTime: "2017/06/02"
        }
    },
    components: {
        wave_button,
        select_box,
        calender_box,
        calendar_select
    },
    methods: {
        waveCallBack() {
            //alert("点击了wave_button按钮")
        },
        selectCallBack(arg) {
            console.log(arg)
        },
        calendarCallBack(arg) {
            alert("选择了" + arg)
        },
        calendarSelectCallBack(arg) {
            alert("选择了" + arg)
        }
    }
}    
</script>


