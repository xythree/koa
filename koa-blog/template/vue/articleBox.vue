
<template>
    <div class="article_box">
        <h3>{{title}}</h3>
        <div v-html="content"></div>
    </div>
</template>


<script>
import axios from "axios"
export default {
    data() {
        return {
            title: "",
            content: ""
        }
    },
    watch: {
        "$route": "fetchData"
    },
    methods: {
        fetchData() {
            let id = this.$route.query.id

            axios.get("/article", {
                params: {
                    id
                }
            }).then(result => {
                let data = result.data.result[0]

                this.title = data.title
                this.content = data.content
            })
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
