
<style lang="sass" scoped>



</style>

<template>
    <select_box :selectShow="selectShow" :value="value" :selectBoxCallBack="selectBoxCallBack">
        <calendar_box :defaultTime="defaultTime" :calendarCallBack="callback"></calendar_box>    
    </select_box>
</template>


<script>

import select_box from "../select_box/select_box.vue"
import calendar_box from "../calendar/calendar.vue"

export default {
    props: ["defaultTime","calendarSelectCallBack"],
    data() {
        let value = this.defaultTime || ""
        if (value) {
            value = value.replace(/[\,\/]/g,"-")
        }
        return {
            value,
            selectShow: false
        }
    },
    components: {
        select_box,
        calendar_box
    },
    methods: {
        callback(arg) {
            this.value = arg
            this.selectShow = false
            this.calendarSelectCallBack && this.calendarSelectCallBack(arg)
        },
        selectBoxCallBack(arg) {
            this.value = arg.value
            this.selectShow = arg.selectShow
            if (arg.clear) {
                this.calendarSelectCallBack && this.calendarSelectCallBack()
            }
        }
    }

}

</script>

