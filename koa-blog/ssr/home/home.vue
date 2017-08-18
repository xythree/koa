<template>
    <div id="home">

        <home_shell>
            <router-view :articleList="articleList"></router-view>
        </home_shell>

    </div>
</template>

<script>

import home_shell from "./home_shell.vue"

export default {
    components: {
        home_shell
    },
    data() {
        return {
            articleList: this.$store.state.list || this.$store.state.article
        }
    },
    methods: {

    },
    mounted() {

    }
}
</script>