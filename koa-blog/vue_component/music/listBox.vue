<style lang="sass">

</style>

<template>
    <li>
        <a @click="getSong(todo)">{{todo.artists[0].name}} - {{todo.name}} - {{todo.album.name}}</a>
        <template v-if="index != undefined">
            <span @click="remove(index)" class="playListRemove"></span>
        </template>
    </li>
</template>

<script>
export default {
    props: ['todo', 'index'],
    methods: {
        getSong(item) {
            //this.$store.dispatch('getSong', item)
            //this.$store.dispatch('addPlayList', item)
        },
        remove(index) {
            /*
            const _store = this.$store

            _store.dispatch("setAlertBoxFn", () => {
                _store.dispatch("removePlayList", index)
            })
            _store.dispatch("setAlertBoxStatus", true)
            _store.dispatch("setAlertBoxText", "确定删除吗?")
            */
        }
    }
}
</script>

