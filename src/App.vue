<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view :key="key"></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'app',
    computed: {
        key() {
            return this.$route.name !== undefined ? this.$route.name + (+new Date()) : this.$route.path + (+new Date())
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./assets/styles/color";
#app {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    max-width: 640px;
    margin: auto;
    -webkit-tap-highlight-color: transparent;
    background: $bg-light;
    color: $text;
}
</style>
