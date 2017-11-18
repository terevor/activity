<template>
    <div class="content">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'content'
}
</script>
<style scoped>
.content {
    overflow: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    -webkit-overflow-scrolling : touch; 
}
</style>
