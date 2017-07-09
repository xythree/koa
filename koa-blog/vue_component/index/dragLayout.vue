<style scoped>
.demo {
    margin: 5px;
    width: 100%;
}
</style>

<template>
  
    <div class="demo">
        <p>拖动布局</p>
        <br /><br />
        <drag_layout />

    </div>

</template>

<script>
import drag_layout from "./../drag_layout/drag_layout.vue"
export default {
    components: {
        drag_layout
    }
}
</script>

