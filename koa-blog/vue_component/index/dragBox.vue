<style lang="sass" scoped>

</style>

<template>
  
    <drag_box :show="show" :dragCallBack="dragCallBack">
        可拖拽的弹出层
    </drag_box>

</template>

<script>
import drag_box from "./../drag_box/drag_box.vue"

export default {
    data() {
        return {
            show: true
        }
    },
    components:{
        drag_box
    },
    methods: {
        dragCallBack() {
            this.show = false
        }
    }
}

</script>

