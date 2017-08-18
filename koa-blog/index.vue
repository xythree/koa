
<style lang="sass">

button {
    outline: none;
    font-size: 12px;
    transition: all .5s;
}

</style>

<template>

    <div id="app" class="demo">
        {{text}} / {{ab}}
        <br />
        <button @click="fn">button</button>
        <ul>
            <li v-for="item in list">{{item.title}}</li>
        </ul>
        <div id="router">
            <router-link to="/abc">abc_link</router-link>
            <router-view></router-view>
        </div>
    </div>

</template>

<script>


export default {    
    props: ["list"],
    data() {
        return {
            text: 123
        }
    },
    methods: {
        fn() {

        }
    },
    mounted() {

        require.ensure([], function(require) {
            const axios = require("axios")

            axios.get("/").then(data => {
                //console.log(data)
            })

        }, "abc")

    }
}

</script>
