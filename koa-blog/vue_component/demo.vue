

<template>
    <div>
        <scroll_box :config="config" :scrollCallBack="scrollCallBack">
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
            1<br />
        </scroll_box>
    </div>
</template>

<script>

import scroll_box from "./scroll_box/scroll_box.vue"

export default {
    data() {
        return {
            config: {
                width: 200,
                height: 200,
                unit: "px",
                hoverStatus: false,
                c1: "#333",
                c2: "#eee"
            }
        }
    },
    components: {
        scroll_box
    },
    methods: {
        scrollCallBack(obj) {
            if (obj.type == "bottom") {
                let p = document.createElement("p")
                p.innerHTML = 1

                obj.box.appendChild(p)
            }
        }
    }
}
</script>
