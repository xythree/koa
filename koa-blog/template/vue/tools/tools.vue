<style lang="sass">
*{margin: 0; padding: 0;}
.ilist {
    width: 50%;
    margin: 50px auto;

    li {
        margin: 10px 0;

        a {
            text-decoration: none;
            color: #666;
            transition: all .5s;

            &:hover {
                color: #f00;
            }
        }
    }
}
</style>

<template>
    <div class="icontent">
        <ul class="ilist">
            <li><a href="/">首页</a></li>
            <li><a href="/qrcode">二维码</a></li>
            <li><a href="/md">markdown编辑器</a></li>
        </ul>
    </div>
</template>


<script>

import qrcode_box from "./qrcode.vue"

export default {
    components: {
        
    }
}
</script>
