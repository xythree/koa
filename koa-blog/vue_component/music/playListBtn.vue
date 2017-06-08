<style lang="sass" scoped>
@function v($v) {
    @return ($v/100)+rem;
}
@mixin center ($pos: absolute, $left: 50%, $top: 50%, $other: "") {
    position: $pos;
    left: $left;
    top: $top;
    @if $other == "" {
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
    } @else {
        -webkit-transform: translate(-50%, 0) $other;
        transform: translate(-50%, 0) $other;        
    }    
}
@mixin center_center ($pos: absolute,$left: 50%, $top: 50%, $other: "") {
    position: $pos;
    left: $left;
    top: $top;
    @if $other == "" {
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    } @else {
        -webkit-transform: translate(-50%, -50%) $other;
        transform: translate(-50%, -50%) $other;        
    }
}
.playListIcon {
    $v: 60;
    position: relative;
    width: v($v);
    height: v($v);
    font-size: v(42);
    cursor: pointer;
    span {
        width: v($v/2);
        height: v(2);
        border-top: v(2) solid #333;
        -webkit-transition: all .5s ease-out;
        transition: all .5s ease-out;
    }
    span:nth-child(1) {
        @include center($top: 30%);
        -webkit-transform-origin: left center;
        transform-origin: left center;
    }
    span:nth-child(2) {
        @include center_center;
    }
    span:nth-child(3) {
        @include center($top: 65%);
        -webkit-transform-origin: left center;
        transform-origin: left center;
    }
}
</style>

<template>
    <div class="playListIcon" :class="{playListShow: playListShow}" @click="toggle">
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<script>
export default {
    computed: {
        playListShow() {
            return this.$store.state.playListStatus
        }
    },
    methods: {
        toggle() {
            const _store = this.$store
            _store.dispatch('setPlayListStatus', !_store.state.playListStatus)
        }
    }
}
</script>

