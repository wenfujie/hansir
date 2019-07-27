/*
* createTime：2018/11/8
* author：en.chen
* description:  积分明细
*/
<template>
    <div class="point-detail bg-gray" :class="{ 'flex-vbox' : showEmpty === true }">
        <div class="top-content bg-gray">
            <div class="bg-white">
                <p class="point-title">可用积分</p>
                <p class="point-value">{{pointInfo.useablePoints}}</p>
                <p class="jumpShop" @click="jumpShop">积分商城&nbsp;<i class="iconfont icon-gengduo"></i></p>
            </div>
            <p class="point-list-title">显示最近90天</p>
        </div>
        <div class="pull-box overflow-scroll">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                <div class="point-item" v-for="item in pointInfo.list" :key="" v-if="showEmpty === false">
                    <p class="month">{{item.title}}</p>
                    <ul class="bg-white">
                        <li class="point-item-detail flex-between" v-for="detail in item[item.date]">
                            <div>
                                <p class="behaiver">{{detail.memo}}</p>
                                <p class="time">{{detail.regTime}}</p>
                            </div>
                            <span class="point-item-value">{{detail.points}}</span>
                        </li>
                    </ul>
                </div>
                <empty emptyText="暂无积分记录" v-if="showEmpty === true"></empty>
            </van-pull-refresh>
        </div>
    </div>
</template>
<script>
    import {Point} from '../../api/service'
    import Storage from '../../util/storage'
    import Empty from '../../components/EmptyContent.vue'
    import {Toast, PullRefresh} from 'vant'

    export default {
        components: {
            'empty': Empty,
            'van-pull-refresh': PullRefresh,
        },
        data() {
            return {
                pointInfo: {},
                showEmpty: false,
                isLoading: false
            }
        },
        methods: {
            jumpShop() {
                this.$router.push("/integralShop");
            },
            getPage() {
                let data = {}
                Point.getPointDetail(data).then((res) => {
//                    res.list.length = 0
                    if (res.list.length > 0) {
                        this.showEmpty = false
                        let time = new Date()
                        let year = time.getFullYear()
                        let month = time.getMonth() + 1
                        res.list.forEach((item) => {
                            item.title = ''  // 初始化显示标题
                            if ((item.date.substring(0, 4)).indexOf(year) === -1) {
                                //  判断是否同年
                                item.title = item.date
                            } else {
                                //  判断是否是当前月
                                if ((item.date.substr(item.date.length - 2)).indexOf(month) !== -1) {
                                    item.title = '本月'
                                } else {
                                    item.title = item.date.substr(item.date.length - 2) + '月'
                                }
                            }
                        })
                    } else {
                        this.showEmpty = true
                    }
                    this.pointInfo = res
                }).then(() => {
                    this.isLoading = false
                })
            },
            onRefresh() {
                this.getPage()
            }
        },
        created() {
            this.getPage()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .jumpShop {
        font-size: computed(28);
        line-height: computed(30);
        margin-top: computed(28);
        margin-bottom: computed(28);
        text-align: center;
        font-weight: 500;
        color: rgba(13, 14, 9, 1);

        i {
            font-size: computed(28);
            font-weight: 500;
            color: rgba(13, 14, 9, 1);
        }

    }

    .point-detail {
        min-height: 100vh;
        box-sizing: border-box;
        padding-top: computed(340);
        overflow: hidden;

        .top-content {
            position: fixed;
            width: 100%;
            height: computed(340);
            top: 0;
            left: 0;
            z-index: 9;
        }

        .pull-box{
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        .bg-white {
            overflow: hidden;
        }

        .point-title {
            font-size: computed(26);
            line-height: computed(30);
            margin-top: computed(28);
            text-align: center;
            color: #C41717;
        }

        .point-value {
            font-size: computed(72);
            line-height: computed(74);
            margin: computed(40) 0;
            text-align: center;
            color: #C41717;
            font-family: 'DIN-Bold';
            font-weight: bold;
        }

        .point-list-title {
            position: relative;
            margin: computed(40) computed(30);
            font-size: computed(24);
            line-height: computed(26);
            text-align: center;
            color: #999999;

            &
            ::before {
                content: '';
                width: computed(255);
                height: 1px;
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                background: #DBDBDB;
            }

            &
            ::after {
                content: '';
                width: computed(255);
                height: 1px;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background: #DBDBDB;
            }

        }
        .month {
            margin: computed(30);
            font-size: computed(26);
            line-height: computed(28);
            color: #666666;
        }

        .point-item-detail {
            margin: 0 computed(30);
            padding: computed(30) 0;
            align-items: center;
            border-bottom: solid 1px #DBDBDB;

            .behavior {
                font-size: computed(30);
                line-height: computed(30);
                color: #333333;
            }

            .time {
                margin-top: computed(20);
                font-size: computed(24);
                line-height: computed(26);
                color: #999999;
            }

            .point-item-value {
                margin-left: computed(20);
                font-family: 'DIN-Bold';
                font-size: computed(32);
                line-height: computed(34);
                color: #0D0E09;
                font-weight: bold;
            }

        }
    }

</style>