<template>
    <div id="home">
        <v-content>
            <div class="container">
                <div class="top">
                    <!-- <div class="logo ab-bg"></div> -->
                    <div class="title"></div>
                    <div class="sub-title"></div>
                    <div class="counter ab-bg">
                        <div class="text">实时检测量</div>
                        <div class="total">
                            <count-to ref="countTo" class="count_to" :start-val="countTo.start" :end-val="countTo.end" :autoplay="false"></count-to>
                        </div>
                    </div>
                    <div class="main-bg ab-bg"></div>
                    <div class="outer-circle ab-bg"></div>
                    <div class="inner-circle ab-bg"></div>
                </div>
                <div class="bottom" ref="bottom">
                    <vue-e-charts ref="vcharts" :options="mapOption" :auto-resize="true"></vue-e-charts>
                </div>
            </div>
            <transition name="cup">
                <div v-show="cup.show" class="cup" :class="{ 'shake': cup.shake }"></div>
            </transition>
        </v-content>
    </div>
</template>

<script>
import VueECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/geo'
// import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markPoint'
import china from '../../static/mock/china'
import geoCities from '../../static/mock/geoCities'
// import geo from '../../static/mock/geo'
import countTo from 'vue-count-to'
import content from '@/components/content'
import { getTotalCount, fetchCities, getChampion } from '@/services/api'
import { formatDateStr } from '@/filters'
import million from '@/assets/images/100.png'

VueECharts.registerMap('china', china)

let _cityCache = []

export default {
    name: 'home',
    components: {
        'vContent': content,
        VueECharts,
        countTo
    },
    data() {
        return {
            countTo: {
                start: 92900,
                end: 92900
            },
            // chartHeight: '', // v-if="chartHeight" :style="{ 'height': chartHeight }"
            cup: {
                show: false,
                shake: false
            },
            million: {
                province: '',
                city: ''
            },
            mapOption: {
                backgroundColor: '#010053',
                // tooltip: {
                //     trigger: 'none'
                // },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: false,
                    silent: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#020967',
                            borderColor: '#143CB8'
                        },
                        emphasis: {
                            areaColor: '#fe7f00'
                        }
                    }
                },
                series: [
                    {
                        name: 'china',
                        type: 'map',
                        geoIndex: 0,
                        markPoint: {
                            symbol: 'image://' + million,
                            symbolSize: [153, 32],
                            symbolOffset: ['-71', '-2'],
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }
                    },
                    {
                        name: 'city',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 0,
                        rippleEffect: {
                            brushType: 'stroke',
                            scale: 3
                        },
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#46bee9'
                            }
                        },
                        data: []
                    }
                ]
            }
        }
    },
    mounted() {
        // let h = window.getComputedStyle(this.$refs['bottom'], null).getPropertyValue('height') // .slice(0, -2)
        // h = h > 300 ? h : 300
        // this.chartHeight = h + 'px'
        // this.$refs['vcharts'].chart.resize()
        // console.log(this.chartHeight)
        this.refreshCities()
        this.refreshCount()
        setInterval(() => {
            this.refreshCities()
        }, 3600 * 1000)
        setInterval(() => {
            this.refreshCount()
            // let offset = this.countTo.end + Math.floor(100 * Math.random())
            // this.countTo.start = this.countTo.end
            // this.countTo.end = offset
            // this.$refs['countTo'].start()
            // console.log(this.countTo.start, this.countTo.end)
            // this.dispatchAction('highlight', '湖南')
        }, 10000)
    },
    methods: {
        refreshCount() {
            getTotalCount().then(({ data }) => {
                let c = data.obj
                if (c >= 1000000 && c <= 1002000) {
                    c = 1000000
                }
                // if (c >= 930000 && c <= 930550) {
                //     c = 930000
                // }
                if (c === this.countTo.end) return
                this.countTo.start = this.countTo.end
                this.countTo.end = c
                this.$refs['countTo'].start()
                if (!this.million.province && this.countTo.end >= 1000000) {
                    // this.getChampion(this.countTo.end)
                    this.getChampion(1000000)
                }
            }).catch(err => {
                console.log('getTotalCount() --> ', err)
            })
        },
        refreshCities() {
            const d = new Date()
            const time = d.getTime() - 60 * 60 * 1000 // 查前一个小时
            d.setTime(time)
            const str = formatDateStr(d, 'yyyy-MM-dd hh:00:00')
            fetchCities(encodeURIComponent(str)).then(({ data }) => {
                if (!data || !data.length) {
                    console.log('fetchCities() --> ', data)
                    return
                }
                _cityCache = []
                data.forEach(n => {
                    if (this.million.province === n.province_name) return
                    const name = n.city_name
                    let value = geoCities[name]
                    if (!value) {
                        value = [0, 0]
                        console.log(`${name}的经纬度坐标没找到`)
                    }
                    value.push(100)
                    _cityCache.push({
                        name,
                        value,
                        province: n.province_name
                    })
                })
                this.mapOption.series[1].data = _cityCache
                if (this.million.province) {
                    setTimeout(() => {
                        this.dispatchAction('highlight', this.million.province)
                    }, 500)
                }
            }).catch(err => {
                console.log('fetchCities() --> ', err)
            })
        },
        dispatchAction(action, name) {
            this.$refs['vcharts'].chart.dispatchAction({
                type: action,
                // seriesIndex: 0,
                name: name
            })
        },
        getChampion(id) {
            getChampion(id).then(({ data }) => {
                if (data && data.length > 0) {
                    const name = data[0].city_name
                    let coord = geoCities[name]
                    if (!coord) {
                        coord = [0, 0]
                        console.log(`${name}的经纬度坐标没找到`)
                    }

                    this.million.province = data[0].province_name
                    this.million.city = data[0].city_name

                    this.mapOption.series[0].markPoint.data = [{
                        name,
                        coord
                    }]
                    this.mapOption.series[1].data = _cityCache.filter(n => {
                        return n.province !== data[0].province_name
                    })

                    setTimeout(() => {
                        this.dispatchAction('highlight', data[0].province_name)
                    }, 500)
                    // setTimeout(() => {
                    //     // this.dispatchAction('downplay', data[0].province_name)
                    //     this.mapOption.series[1].data = _cityCache
                    //     this.mapOption.series[0].markPoint.data = []
                    // }, 5500)
                    this.cup.show = true
                    setTimeout(() => {
                        this.cup.shake = true
                        // setTimeout(() => {
                        //     this.cup.show = false
                        //     this.cup.shake = false
                        // }, 2100)
                    }, 1100)
                }
            }).catch(err => {
                console.log('getChampion() --> ', err)
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#home {
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
}
.container {
    height: 100%;
    background-image: linear-gradient(-134deg, #01002D 0%, #01006F 100%);
    padding: 1rem;
    overflow: hidden;
    .top {
        height: 50%;
        position: relative;
        overflow: hidden;
        // .logo {
        //     height: 1.5rem !important;
        //     z-index: 1;
        //     background: url(../assets/images/logo.png) left center no-repeat;
        //     background-size: contain;
        // }
        .title {
            height: 1.5rem;
            margin-top: 3px;
            background: url(../assets/images/title.png) center no-repeat;
            background-size: contain;
        }
        .sub-title {
            height: 1rem;
            margin: 1rem 0;
            background: url(../assets/images/sub_title.png) center no-repeat;
            background-size: contain;
        }
        .counter {
            text-align: center; // padding-top: 3.5rem;
            height: 90px !important;
            top: 50% !important;
            margin-top: -45px;
            z-index: 1;
            .text {
                color: #FF005C;
                font-size: 1.25rem;
                font-weight: bold;
            }
            .total {
                color: #FFFFFF;
                font-size: 3.25rem;
                font-weight: bold;
                letter-spacing: .5rem;
            }
        }
        .ab-bg {
            position: absolute;
            top: 0; // 2.7rem;
            left: 0;
            height: 100%;
            width: 100%;
        }
        .main-bg {
            background: url(../assets/images/bg1.png) center no-repeat;
        }
        .outer-circle {
            background: url(../assets/images/outer_circle.png) center no-repeat;
            animation: rotate-clockwise 2s infinite linear;
        }
        .inner-circle {
            background: url(../assets/images/inner_circle.png) center no-repeat;
            animation: rotate-counterclockwise 2s infinite linear;
        }
    }
    .bottom {
        height: 50%;
    }
}

.cup {
    display: inline-block;
    background: url(../assets/images/cup.png) center no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -41px;
    margin-left: -55px;
    height: 82px;
    width: 110px;
    z-index: 1;
    &.shake {
        animation: cup-wave 2s ease-in-out;
    }
}

@keyframes rotate-clockwise {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes rotate-counterclockwise {
    0% {
        transform: rotate(360deg);
    }
    100% {
        transform: rotate(0deg);
    }
}

@keyframes cup-wave {
    0%,
    100% {
        transform: rotate(0);
    }
    20%,
    60% {
        transform: rotate(-25deg);
    }
    40%,
    80% {
        transform: rotate(10deg);
    }
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.5);
    }
    100% {
        transform: scale(1);
    }
}

.cup-enter-active {
    animation: bounce-in 1s;
}

.cup-leave-active {
    animation: bounce-in 1s reverse;
}

.echarts {
    width: 100%;
    height: 100%;
}
</style>
