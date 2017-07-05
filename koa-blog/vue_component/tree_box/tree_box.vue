<style lang="sass" scoped>

.itree_children {
    $v: 20px;
    margin: 0; 
    padding: 0; 
    list-style: none;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAKAQMAAABPHKYJAAAAA1BMVEWIiIhYZW6zAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1ggGExMZBky19AAAAAtJREFUCNdjYMAEAAAUAAHlhrBKAAAAAElFTkSuQmCC) repeat-y;
    
    ul {
        margin-left: $v; 
        margin-bottom: 5px;
    } 
    li {
        line-height: $v;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAUAQMAAACK1e4oAAAABlBMVEUAAwCIiIgd2JB2AAAAAXRSTlMAQObYZgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YIBhQIJYVaFGwAAAARSURBVAjXY2hgQIf/GTDFGgDSkwqATqpCHAAAAABJRU5ErkJggg==) no-repeat; 
    }
    li:last-child { 
        background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAUAQMAAACK1e4oAAAABlBMVEUAAwCIiIgd2JB2AAAAAXRSTlMAQObYZgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YIBhQIIhs+gc8AAAAQSURBVAjXY2hgQIf/GbAAAKCTBYBUjWvCAAAAAElFTkSuQmCC) no-repeat;
    }
    .itree_name {
        padding-left: $v;
    }
}


</style>

<template>
    <ul class="itree_children">
        <li v-for="(child, index) in children">
            <tree_content v-if="child.children" :indexes="_indexes.concat(index)" :treeCallBack="treeCallBack" :item="child" />
            <span class="itree_name" v-else @click="clickFn(index)">{{child.name}}</span>
        </li>
    </ul>
</template>

<script>

export default {
    props: ["children", "indexes", "treeCallBack"],
    computed: {
        _indexes() {
            return this.indexes || []
        }
    },
    methods: {
        clickFn(num) {
            this.treeCallBack && this.treeCallBack(this.indexes.concat(num))
        }
    },
    beforeCreate() {
        this.$options.components.tree_content = require('./tree_content.vue')
    }
}

</script>
