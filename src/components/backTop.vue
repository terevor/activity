<template>
    <div :class="classes" :style="styles" @click="back">
        <slot>
            <div :class="innerClasses">
                <i class="iconfont icon-arrow-up"></i>
            </div>
        </slot>
    </div>
</template>

<script>
const prefixCls = 'back-top'

function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, 1000 / 60)
            }
        )
    }
    const difference = Math.abs(from - to)
    const step = Math.ceil(difference / duration * 50)

    function scroll(start, end, step) {
        if (start === end) return

        let d = (start + step > end) ? end : start + step
        if (start > end) {
            d = (start - step < end) ? end : start - step
        }

        if (el === window) {
            window.scrollTo(d, d)
        } else {
            el.scrollTop = d
        }
        window.requestAnimationFrame(() => scroll(d, end, step))
    }
    scroll(from, to, step)
}

export default {
    props: {
        height: {
            type: Number,
            default: 400
        },
        bottom: {
            type: Number,
            default: 30
        },
        right: {
            type: Number,
            default: 30
        },
        duration: {
            type: Number,
            default: 1000
        }
    },
    data() {
        return {
            backTop: false
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll, false)
        window.addEventListener('resize', this.handleScroll, false)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll, false)
        window.removeEventListener('resize', this.handleScroll, false)
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-show`]: this.backTop
                }
            ]
        },
        styles() {
            return {
                bottom: `${this.bottom}px`,
                right: `${this.right}px`
            }
        },
        innerClasses() {
            return `${prefixCls}-inner`
        }
    },
    methods: {
        handleScroll() {
            this.backTop = window.pageYOffset >= this.height
        },
        back() {
            scrollTop(window, document.body.scrollTop, 0, this.duration)
            this.$emit('on-click')
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.back-top {
    z-index: 10;
    position: fixed;
    cursor: pointer;
    display: none;

    &.back-top-show {
        display: block;
    }

    &-inner {
        background-color: rgba(0, 0, 0, .6);
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
        transition: all .2s ease-in-out;

        &:hover {
            background-color: rgba(0, 0, 0, .7);
        }
    }

    i {
        color: #fff;
        font-size: 24px;
        padding: 8px 12px;
    }
}
</style>
