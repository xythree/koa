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

$c1: #ddd;

.select_box {
    position: relative;
    width: 175px;
    display: inline-block;    
    cursor: pointer;
    
    .select_ipt {
        input {
            text-indent: 5px;
            width: 150px;
            height: 22px;
            line-height: 22px;
            border: 1px solid $c1;
            border-radius: 3px 0 0 3px;
            background: #fff;
            vertical-align: top;
        }
        b {
            display: none;
            position: absolute;
            top: 1px;
            right: 24px;
            height: 22px;
            line-height: 21px;
            width: 22px;
            text-align: center;
            font-size: 12px;
            border-radius: 50%;
            background: $c1;
            transform: scale(.6);
            color: #999;
        }
        &:hover {
            b {
                display: block;
            }
        }
        span {
            position: absolute;
            top: 0;
            right: 0;
            height: 22px;
            width: 22px;
            vertical-align: middle;
            border: 1px solid $c1;
            border-left: none;
            border-radius: 0 3px 3px 0;
            background: #eee;
            
            &:after {
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: -5px;
                margin-top: -2px;
                content: "";
                width: 0;
                height: 0;
                border-width: 5px;
                border-color: #999 transparent transparent;
                border-style: solid;
                transform-origin: center 2px;
                transition: all .35s ease-out;
            }
        }
    }
    .select_lists_box {
        display: none;
        position: absolute;
        top: 22px;
        min-width: 172px;
        border: 1px solid $c1;      
        border-radius: 0 0 3px 3px;
        background: #fff;
        overflow: auto;
        
        li {
            padding: 3px 5px;
            border-bottom: 1px dashed #eee;
            
            &:hover {
                cursor: pointer;
                background: #eee;
            }           
            &:last-child {
                border-bottom: none;
                padding-bottom: 5px;
            }
        }
    }
}
.select_show {
    .select_lists_box {
        display: block;
        transform-origin: center top;
        animation: show_ani .35s ease-out both;
		z-index: 888;
    }
    .select_ipt {
        span {
            &:after {
                transform: rotate(180deg);
            }
        }
    }
}
@keyframes show_ani {
    0% {
        opacity: 0;
        transform: rotateX(45deg);      
    }
    100% {
        opacity: 1;
        transform: rotateX(0);
    }
}

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

