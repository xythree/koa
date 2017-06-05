<style lang="sass" scoped>
.paginationBox {    
    width: 100%;
    text-align: center;
    $h: 20px;
    
    em,
    b,
    span {
        display: inline-block;
        height: $h;
        line-height: $h;
        padding: 0 5px;
        margin: 0 1px;
        font-size: 14px;
        cursor: pointer;
    }
    span {
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    em {
        font-style: normal;
    }
    b {        
        font-weight: normal;
    }
}
</style>

<template>
    <div class="paginationBox" v-show="total > 0">
        <em v-if="ind > 1" @click="prev">《</em>
        <span v-if="ind > count + 2" @click="jump(1)">1</span>
        <em v-if="ind > count + 1">...</em>
        <template v-for="item in prevPageArr">
            <span @click="jump(item)">{{item}}</span>
        </template>
        <b class="paginationAction">{{ind}}</b>
        <template v-for="item in nextPageArr">
            <span @click="jump(item)">{{item}}</span>
        </template>
        <em v-if="ind + count < arr.length">...</em>
        <span v-if="arr.length > 1 && ind + count < arr.length" @click="jump(arr.length)">{{arr.length}}</span>
        <em v-if="ind != arr.length && total > _colnum" @click="next">》</em>
    </div>
</template>

<script>
export default {
    props: ["colnum", "index", "total", "paginationCallBack"],
    data() {        
        return {
            //ind: this.index || 1,
            count: 2
        }
    },
    computed: {
        ind() {
            return this.index || 1
        },
        _colnum() {
            return this.colnum || 15
        },
        arr() {
            let temp = []
            for (var i = 0, len = Math.ceil(this.total / this._colnum); i < len; i++) {
                temp.push(i + 1)
            }
            return temp
        },
        prevPageArr() {
            let n = this.ind - this.count - 1
            return this.arr.slice(n < 0 ? 0 : n, this.ind - 1)
        },
        nextPageArr() {
            return this.arr.slice(this.ind, this.ind + this.count)
        }
    },
    created() {
        this.ind = Math.min(this.ind, this.arr.length || 1)
    },
    methods: {
        jump(ind) {
            this.ind = ind
            this.paginationCallBack && this.paginationCallBack(ind)
        },
        prev() {
            this.jump(--this.ind)
        },
        next() {
            this.jump(++this.ind)
        }
    }
}
</script>