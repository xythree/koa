
<template>
  <div class="iword">
    <input type="text" @keyup.enter="search" v-model="value" />
    {{text}}
  </div>
</template>

<script>
import axios from "axios"

export default {
    data() {
        return {
            value: "",
            text: ""
        }
    },
    methods: {
        search() {
            axios.post("/demo", {
                value: this.value
            }).then(data => {
                let d = data.data[0]
                let docs = d.docs[0]

                if (docs) {
                    
                }
            })
        }
    },
    motuned() {

    }
}
</script>