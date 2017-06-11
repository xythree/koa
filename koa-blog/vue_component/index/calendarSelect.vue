<style lang="sass">

</style>

<template>
    <div class="">
        <calendar_select :defaultTime="defaultTime" :calendarSelectCallBack="calendarSelectCallBack"></calendar_select>
        <p>已选日期: {{demoText}}</p>
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

import calendar_select from "../calendar/calendar_select.vue"

export default {
    methods: {
        calendarSelectCallBack(arg) {
            this.demoText = arg
        }
    },
    components: {
        calendar_select
    },
    data() {
        return {
            defaultTime: "",
            demoText: "",
            demo: `
/*
*   :props {
*       @string: defaultTime //2017-05-30  非必需
*       @function: calendarSelectCallBack(params: string)
*   }
*/

<calendar_select :defaultTime="defaultTime" :calendarSelectCallBack="calendarSelectCallBack"></calendar_select>
            `,
            code: `

<style lang="sass" scoped>

</style>

<template>
    <select_box :selectShow="selectShow" :value="value" :selectBoxCallBack="selectBoxCallBack">
        <calendar_box :calendarCallBack="callback"></calendar_box>    
    </select_box>
</template>


\<script\>

import select_box from "../select_box/select_box.vue"
import calendar_box from "../calendar/calendar.vue"

export default {
    props: ["calendarSelectCallBack"],
    data() {
        return {
            value: "",
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

\<\/script\>




            `
        }
    }
}
</script>

