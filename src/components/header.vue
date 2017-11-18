<template>
    <header class="header" flex="box:justify">
        <slot name="left">
            <div class="item" flex="main:center cross:center"></div>
        </slot>
        <span class="title">{{ title }}</span>
        <slot name="right">
            <div class="item" flex="main:center cross:center"></div>
        </slot>
    </header>
</template>

<script>
export default {
    name: 'header',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../assets/styles/color";
.header {
    position: absolute;
    right: 0;
    left: 0;
    background: $bg-dark;
    height: 3rem;
    line-height: 3rem;
    box-shadow: 0 1px 3px 0 rgba(50,50,50,.5);
    .item {
        width: 3.2rem;
    }
    .title {
        overflow: hidden;
        padding: 0;
        margin: 0;
        text-align: center;
        font-size: 1.125rem;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
