<template>
    <div>
        <alert_box :alertBoxStatus="alertBoxStatus" :alertBoxText="alertBoxText" :alertBoxCallBack="alertBoxCallBack" ></alert_box>
    </div>
</template>

<script>

import alert_box from "../../../vue_component/alert/alert.vue"

export default {
    props: ["alertBoxStatus", "alertBoxText"],
    data() {
        return {
            alertBoxStatus: false,
            alertBoxText: ""
        }
    },
    components: {
        alert_box
    },
    methods: {
        alertBoxCallBack() {

        }
    }
}

</script>
