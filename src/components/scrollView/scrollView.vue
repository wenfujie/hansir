<!--
 * @Author: yongtian.hong
 * @Date: 2019-01-10 13:35:38
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-03-20 13:36:39
 * @Description: 滚动组件
 -->

<style lang='scss' >
.scrollView {
    width: 100%;
    height: 100%;
    flex: 1;
    overflow: hidden;
    .content,
    .content-s {
        width: 100%;
        .text-of-refresh-finished,
        .text-of-upload-finished {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #666666;
            font-size: computed(16);
            margin-bottom: 16px;
        }
    }
    .content {
        min-height: 100%;
    }
    .content-s {
        min-height: 101%;
    }
}
</style>

<template>
    <div class="scrollView" ref="scrollview">
        <div class="content-s" ref="content">
            <div v-if="!freshFinished" class="text-of-refresh-finished">
                <p>{{ pulldownText[pulldownState]}}</p>
            </div>
            <slot name="refrsh-anima"></slot>
            <slot/>
            <slot name="upload-anima"></slot>
            <div v-if="!loadFinished" class="text-of-upload-finished">
                <van-loading v-if="pullupState!=1"/>
                <p>{{pullupText[pullupState]}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import { Toast, Loading } from 'vant'
export default {
    components: {
        'van-loading': Loading
    },
    props: {
        /**
         * 1 滚动的时候会派发scroll事件，会截流。
         * 2 滚动的时候实时派发scroll事件，不会截流。
         * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
         */
        probeType: {
            type: Number,
            default: 1
        },
        /**
         * 点击列表是否派发click事件
         */
        click: {
            type: Boolean,
            default: true
        },
        /**
         * 是否开启横向滚动
         */
        scrollX: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发滚动事件
         */
        listenScroll: {
            type: Boolean,
            default: false
        },
        /**
         * 列表的数据
         */
        data: {
            type: Array,
            default: []
        },
        /**
       * 列表的数据
       */
        option: {
            type: Object,
        },

        /**
         * 是否派发滚动到底部的事件，用于上拉加载
         */
        pullUpLoad: {
            type: Function,
        },
        /**
         * 是否派发顶部下拉的事件，用于下拉刷新
         */
        pullDownRefresh: {
            type: Function
        },

        /**
         * 是否派发列表滚动开始的事件
         */
        beforeScroll: {
            type: Boolean,
            default: false
        },
        /**
         * 当数据更新后，刷新scroll的延时。
         */
        refreshDelay: {
            type: Number,
            default: 20
        },
        /**
       * 触发上拉加载回调的偏移量。
       */
        uploadOffset: {
            type: Number,
            default: 50
        },
        /**
       * 触发下拉刷新回调的偏移量。
       */
        downOffset: {
            type: Number,
            default: 50
        },

    },
    data() {
        return {
            // 刷新完成
            freshFinished: {
                type: Boolean,
                default: true
            },
            // 加载完成
            loadFinished: {
                type: Boolean,
                default: true
            },

            eventType: null,//上拉或者下拉
            pulldownText: {
                0: "下拉即可刷新...",
                1: "释放即可刷新...",
                3: "数据加载中..."
            },
            pullupText: {
                0: "努力加载中。。。",
                1: "无更多信息。。。"
            },
            pullupState: 0,
            pulldownState: 0,



        }
    },
    mounted() {
        // 保证在DOM渲染完毕后初始化better-scroll
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll() {
            // 判断节点是否生成
            if (!this.$refs.scrollview) return;

            //初始化配置
            let options = Object.assign({}, {
                probeType: 3,
                preventDefault: false,
            })

            // 初始化scroll对象
            this.scroll = new BScroll(this.$refs.scrollview, options);

            // 是否派发列表滚动开始的事件
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll')
                })
            }

            // 是否派发滚动事件
            if (this.listenScroll) {
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos)
                })
            }

            // 是否派发滚动到底部事件，用于上拉加载
            if (this.pullUpLoad) {
                if (typeof this.pullUpLoad != 'function') {
                    console.error('The callback pullUpLoad must be a function')
                    return false;
                }
                this.scroll.on('scrollEnd', async () => {
                    // 加载未完成或者从上往下滑动不触发上拉事件
                    if (!this.loadFinished || this.scroll.directionY == -1) return;
                    // 滚动到底部
                    if (this.scroll.y <= (this.scroll.maxScrollY + this.uploadOffset)) {
                        this.onPullUp();
                        await this.pullUpLoad();
                    }
                })
            }

            // 是否派发顶部下拉事件，用于下拉刷新
            if (this.pullDownRefresh) {
                if (typeof this.pullDownRefresh != 'function') {
                    console.error('The callback pullDownRefresh must be a function')
                    return false;
                }
                this.scroll.on('touchEnd', async (pos) => {
                    // 如果是上拉则返回
                    if (this.scroll.directionY == 1) return;
                    // 下拉动作
                    if (pos.y > this.downOffset) {
                        this.onPullDown();
                        await this.pullDownRefresh();
                    }
                })
                this.scroll.on('scroll', async (pos) => {
                    if (pos.y == 0) {
                        this.freshFinished = true;
                        this.pulldownState = 3;
                    }
                    if (this.scroll.movingDirectionY != -1) return;
                    if (pos.y > 10 && pos.y < 50) {
                        this.pulldownState = 0;
                        this.freshFinished = false;
                    } else if (pos.y > 50) {
                        this.pulldownState = 1;
                        this.freshFinished = false;
                    }
                })
            }
        },
        disable() {
            // 代理better-scroll的disable方法
            this.scroll && this.scroll.disable()
        },
        enable() {
            // 代理better-scroll的enable方法
            this.scroll && this.scroll.enable()
        },
        refresh() {
            // 代理better-scroll的refresh方法
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            // 代理better-scroll的scrollTo方法
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            // 代理better-scroll的scrollToElement方法
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        // 上拉加载
        onPullUp() {
            this.loadFinished = false;
            this.eventType = "pullup";
            setTimeout(() => {
                if (!this.loadFinished) {
                    this.loadFinished = true;
                    // 0:加载中，1：加载完成
                    this.pullupState = 1;
                }
            }, 3000)
        },
        //下拉刷新
        onPullDown() {
            this.freshFinished = false;
            this.eventType = "pulldown";
            this.pulldownState = 3;
            setTimeout(() => {
                if (!this.freshFinished) {
                    this.freshFinished = true;
                }
            }, 3000)
        },
        // 数据每变化一次，则代表完成一次加载
        finish() {
            const events = {
                // 下拉完成执行
                pulldown: () => {
                    this.freshFinished = true;
                    this.pulldownState = 1;
                    // Toast('刷新成功');
                },
                // 上拉加载完成执行
                pullup: () => {
                    this.loadFinished = true;
                    this.pullupState = 0;
                    // Toast('加载完成');
                }
            }
            if (this.eventType) {
                events[this.eventType]();
                this.eventType = null;
            }

        }
    },
    computed: {
        contentClass: function () {
            return this.data.length > 0 ? "content-s" : "content";
        }
    },
    watch: {
        // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
        data(val) {
            setTimeout(() => {
                this.refresh();
                this.finish();
            }, this.refreshDelay)
        },
        contentClass() {
            setTimeout(() => {
                this.refresh();
                this.finish();
            }, this.refreshDelay)
        }
    },
    beforeDestroy() {
        this.scroll.off("touchEnd");
        this.scroll.off("scrollEnd");
        this.scroll.off("scroll");
    }
}
</script>