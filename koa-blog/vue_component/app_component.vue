

<style lang="sass">
$color: #f92672;

.icontent {
    width: 1100px;
    margin: 0 auto;
    overflow: hidden;

    .irouter-list {
        position: fixed;
        padding-top: 100px;
        width: 180px;
        height: 100%;
        border-right: 1px solid #ddd;

        li {
            text-align: right;            
            padding: 5px 20px 5px 0;
            margin: 2px 0;

            a {
                text-decoration: none;
                position: relative;
                color: #66d9ef;
                transition: all .5s ease-out;
                &:after {
                    position: absolute;
                    left: 50%;
                    bottom: -2px;
                    content: "";
                    width: 0;
                    height: 2px;
                    background: $color;
                    transform: translateX(-50%);
                    transition: all .5s ease-out;
                }
                &.router-link-exact-active {
                    color: $color;
                    &:after {
                        width: 100%;
                    }   
                }
            }
        }
    }
    .irouter-view {
        padding: 30px;
        height: 80%;
        margin-left: 200px;
    }
}

</style>

<template>
    <div class="icontent">
        <ul class="irouter-list">
            <li>
                <router-link to="/">home</router-link>
            </li>
            <li>
                <router-link to="/pagination">pagination</router-link>
            </li>
            <li>
                <router-link to="/selectBox">selectBox</router-link>
            </li>
            <li>
                <router-link to="/selectList">selectList</router-link>
            </li>
            <li>
                <router-link to="/calendar">calendar</router-link>
            </li>
            <li>
                <router-link to="/calendarSelect">calendarSelect</router-link>
            </li>
            <li>
                <router-link to="/waveButton">waveButton</router-link>
            </li>
        </ul>
    
        <div class="irouter-view">
    
            <transition name="fade">
                <router-view></router-view>
            </transition>
    
        </div>
    
    </div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    components: {

    },
    methods: {

    }
}    
</script>


