<style lang="sass">
    *{margin: 0; padding: 0;}
</style>

<template>
    <div class="icontent">

        <qrcode_box></qrcode_box>

    </div>
</template>


<script>

import qrcode_box from "./qrcode.vue"

export default {
    components: {
        qrcode_box
    }
}
</script>
