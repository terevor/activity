<template>
    <div class="loading-box">
        <div :class="!complete ? 'loading-start' : 'msg'">
            {{ complete ? '没有更多数据' : '' }}
        </div>
    </div>
</template>

<script>
const isVisible = (el, option) => {
    const setting = Object.assign({
        top: 0, // 元素在顶部伸出的距离
        right: 0, // 元素在右边伸出的距离才
        bottom: 0, // 元素在底部伸出的距离
        left: 0 // 元素在左边伸出的距离
    }, option)

    const bcr = el.getBoundingClientRect(); // 取得元素在可视区的位置

    let mw = el.offsetWidth; // 元素自身宽度
    let mh = el.offsetHeight; // 元素自身的高度
    let w = window.innerWidth; // 视窗的宽度
    let h = window.innerHeight; // 视窗的高度
    let boolX = (!((bcr.right - setting.left) <= 0 && ((bcr.left + mw) - setting.left) <= 0) && !((bcr.left + setting.right) >= w && (bcr.right + setting.right) >= (mw + w))); // 上下符合条件
    let boolY = (!((bcr.bottom - setting.top) <= 0 && ((bcr.top + mh) - setting.top) <= 0) && !((bcr.top + setting.bottom) >= h && (bcr.bottom + setting.bottom) >= (mh + h))); // 上下符合条件

    return el.width !== 0 && el.height !== 0 && boolX && boolY
}

export default {
    props: {
        complete: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            state: this.loading
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            if (isVisible(this.$el) && !this.state) {
                this.state = true
                this.$emit('visible')
            }
        }, 300)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    watch: {
        loading(to) {
            this.state = to
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.loading-box {
    overflow: hidden;
    .loading-start {
        margin: 20px auto 20px auto;
        position: relative;
        animation: rotate-forever 1s infinite linear;
        height: 30px;
        width: 30px;
        border: 4px solid #fff;
        border-right-color: transparent;
        border-radius: 50%;
        .msg {
            display: none;
        }
    }
    .msg {
        line-height: 70px;
        text-align: center;
        font-size: 14px;
        color: #fff;
    }
}

@keyframes rotate-forever {
    0% {
        transform: rotate(0deg)
    }
    100% {
        transform: rotate(360deg)
    }
}
</style>
