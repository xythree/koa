

<style lang="sass" scpoed>
$color: #f92672;

.icontent {
    margin: 0 auto;
    overflow: hidden;

    .irouter-list {
        position: fixed;
        padding-top: 50px;
        left: 0;
        width: 180px;
        min-height: 100%;
        border-right: 1px solid #ddd;
        transition: all .5s;
        overflow: auto;

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
        padding: 50px 30px;
        height: 80%;
        margin-left: 200px;
        transition: all .5s;
    }
}
.imenu {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 25px;
    cursor: pointer;
    display: none;
    span {
        display: block;
        height: 1px;
        background: #000;
        margin: 5px 0;
        transition: all .5s;
    }
}

@media screen and (max-width: 1000px) {
    .imenu {
        display: block;
    }
    $v: 180px;
    .icontent {
        .irouter-list { 
            left: -$v;
        }
         .irouter-view { 
            position: relative;
            margin-left: 0;
         }
         .imenuBg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, .5);
            height: 3000px;            
            transition: all .5s;
            z-index: 99;
        }
    }
    .showMenu {
        .irouter-list { 
            left: 0;
        }
        .irouter-view { 
            margin-left: $v;
        }
        .imenuBg {
            display: block;
            left: $v;
            animation: imenuAni .5s .25s both;
        }
    }
    @keyframes imenuAni {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
}

</style>

<template>
    <div class="icontent" :class="{'showMenu': showMenu}">
        <ul class="irouter-list">
            <li>
                <a href="/">home</a>
            </li>
            <li>
                <router-link to="/">index</router-link>
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
            <li>
                <router-link to="/alert">alert</router-link>
            </li>
            <li>
                <router-link to="/city">city</router-link>
            </li>
            <li>
                <router-link to="/scrollBox">scrollBox</router-link>
            </li>
            <li>
                <router-link to="/processBox">processBox</router-link>
            </li>
            <li>
                <router-link to="/tree">tree</router-link>
            </li>
            <li>
                <router-link to="/drag">drag</router-link>
            </li>
            <li>
                <router-link to="/dragLayout">dragLayout</router-link>
            </li>
        </ul>
    
        <div class="irouter-view">
            <div class="imenuBg" v-show="showMenu" @click="menuFn(1)"></div>
            <div class="imenu" @click="menuFn">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
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
            showMenu: false
        }
    },
    components: {

    },
    methods: {
        menuFn(time) {
            setTimeout(() => {
                this.showMenu = !this.showMenu
            }, time)
        }
    },
    watch: {
        $route() {
            this.showMenu = false
        }
    }
}    
</script>


