<style lang="sass">

</style>

<template>
    <div class="searchListBox">
        <div class="scrollBox" ref="scrollBox">
            <ol class="listBox">
                <list_box v-for="item in groceryList" :todo="item"></list_box>
            </ol>
        </div>
        <div class="pageBox" v-show="showPage">
            <pagination_box :total="total" :index="index" :paginationCallBack="paginationCallBack"></pagination_box>
        </div>
    </div>
</template>

<script>

import list_box from "./listBox.vue"
import pagination_box from "../pagination/pagination.vue"

export default {
    props: ["total", "showPage", "groceryList", "searchListBoxCallBack"],
    computed: {
        index() {
            return this.$store.state.offset + 1
        }
    },
    methods: {
        scrollBack() {
            this.$refs.scrollBox.scrollTop = 0
        },
        paginationCallBack(arg) {
            this.searchListBoxCallBack && this.searchListBoxCallBack(arg)
        }
    },
    components: {
        pagination_box,
        list_box
    }
}
</script>

