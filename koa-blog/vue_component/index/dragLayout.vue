<style>
.demo {
    margin: 50px;
}
</style>

<template>
  
    <div class="demo">
        <p>拖拽布局</p>
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

