
<style lang="sass">

</style>


<template>
    <div ref="touchMovePrevent" :style="style"></div>
</template>

<script>
export default {
    computed: {
        style() {
            return {
                position: 'absolute',
                height: window.innerHeight + 'px',
                width: window.innerWidth + 'px'
            }
        }
    },    
    mounted() {
        document.addEventListener('touchmove', e => {
            if (this.$el.contains(e.target)) {
                e.preventDefault()
            }
        })
    }

}
</script>