/*
* createTime：2018/12/21
* author：en.chen
* description:  账户资金
*/
<template>
    <div class="fund-detail bg-gray">
        <!-- 头部内容 begin -->
        <div class="fix-top bg-gray">
            <div class="bg-white">
                <p class="fund-title">账户余额（元）</p>
                <p class="fund-value">{{fundInfo.userFund || 0}}</p>
            </div>
            <ul class="fund-type bg-white">
                <li class="flex-fix" :class="{'act' : type === ''}" @click="changeType('')">全部</li>
                <li class="flex-fix" :class="{'act' : type === 'D_GRVAADD'}" @click="changeType('D_GRVAADD')">收入</li>
                <li class="flex-fix" :class="{'act' : type === 'D_GRVAREDU'}" @click="changeType('D_GRVAREDU')">支出</li>
            </ul>
        </div>
        <!-- 头部内容 end -->

        <!--列表 begin-->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="80"  class="volume-list bg-white">
            <van-list v-model="loading" :finished="finished" @load="loadMore" :offset="100">
                <ul>
                    <li class="list-item flex-between" v-for="item in list" :key="item.id">
                        <div>
                            <p class="item-memo">{{item.memo}}</p>
                            <p class="item-time">{{item.regTime}}</p>
                        </div>
                        <div class="item-value">{{item.typeCode === 'D_GRVAADD' ? '+' : '-'}}{{item.userFund}}</div>
                    </li>
                </ul>
                <!--空状态下的缺省提示 begin-->
                <empty :emptyText="emptyText" v-show="showEmpty"></empty>
                <!--空状态下的缺省提示 end-->
            </van-list>
        </van-pull-refresh>
        <!--列表 end-->

        <!-- 跳转按钮 begin -->
        <div class="bottom-btn" @click="goRecharge">账户充值</div>
        <!-- 跳转按钮 end -->
    </div>
</template>
<script>
    import {Fund} from '../../api/service'
    import {List, Toast, PullRefresh} from 'vant'
    import Empty from '../../components/EmptyContent.vue'

    export default {
        components: {
            'van-list': List,
            'van-pull-refresh': PullRefresh,
            'empty': Empty
        },
        data() {
            return {
                fundInfo: {},
                type: '',  // 空表示全部状态,D_GRVAADD表示增加,D_GRVAREDU表示减少
                list: [],  //  不同状态下的数据
                loading: false,    //控制上拉加载的加载动画
                isLoading: false,  // 控制下拉刷新的加载动画
                finished: true,  // 控制是否加载更多商品
                pageNo: 1,
                pageSize: 10,
                showEmpty: false,
            }
        },
        methods: {

            //  获取资金详情
            getDetail() {
                let data = {}
                Fund.getFundDetail(data).then((res) => {
                    this.fundInfo = res
                }).then(() => {
                    setTimeout(() => {
                        console.log('1234567')
                        this.getList()
                    },100)
                })

            },
            //  下拉刷新
            onRefresh() {
                if (!!this.fundInfo.id) {
                    this.pageNo = 1
                    this.list = []
                    this.showEmpty = null
                    this.finished = true
                    this.getList()
                }else{
                    setTimeout(() => {
                        this.pageNo = 1
                        this.isLoading = false
                        this.loading = false
                        this.showEmpty = true
                        this.finished = true
                        return
                    },100)
                }
            },
            //  获取列表
            getList() {
                if (!this.fundInfo.id) {
                    this.isLoading = false
                    this.loading = false
                    this.showEmpty = true
                    this.finished = true
                    return
                }
                let data = {
                    fundId: this.fundInfo.id,
                    fundTypeCode: 'D_FUNDTYPE_CHR',  // 需求限定前端只显示金额充值，类型固定写死D_FUNDTYPE_CHR
                    typeCode: this.type,
                    pageNum: this.pageNo,
                    pageSize: this.pageSize
                }
                Fund.getFundsList(data).then((res) => {
                    this.list.push.apply(this.list, res.list)
                    if (this.list.length <= 0) {
                        this.showEmpty = true  // 暂无数据提示
                    } else {
                        this.showEmpty = false
                    }
                    if (res.total <= 0 || this.list.length >= res.total || res.isLastPage === true || this.pageNo >= res.pages) {
                        this.finished = true  // 没有更多禁止上拉
                    }else{
                        this.finished = false
                    }
                    this.isLoading = false
                    this.loading = false
                },() => {
                    this.isLoading = false
                    this.loading = false
                })
            },

            // 切换状态
            changeType(type) {
                if (type === this.type) {
                    return
                } else {
                    this.type = type
                    this.onRefresh()
                }
            },

            // 加载更多
            loadMore() {
                if (this.finished === true) {
                    return
                } else {
                    setTimeout(() => {
                        this.pageNo += 1
                        this.getList()
                    },300)
                }
            },

            // 跳转充值
            goRecharge() {
                this.$router.push('/account-cashin')
            }

        },
        created() {
            this.getDetail()
        },

        computed: {
            emptyText: function () {
                let text = ''
                switch (this.type) {
                    case '' :
                        text = '暂无余额记录'
                        break;
                    case 'D_GRVAADD':
                        text = '暂无收入记录'
                        break;
                    case  'D_GRVAREDU':
                        text = '暂无支出记录'
                        break;

                }
                return text
            }
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .fund-detail {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        height: 100%;
        min-height: 100%;
        padding-top: computed(316);
        padding-bottom: computed(98);
        position: relative;
        overflow: scroll;

        .bg-white {
            overflow: scroll;
        }

        .fix-top {
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 99;
        }

        .fund-title {
            font-size: computed(26);
            line-height: computed(30);
            margin-top: computed(28);
            text-align: center;
            color: #999999;
        }

        .fund-value {
            font-size: computed(72);
            line-height: computed(74);
            margin: computed(40) 0;
            text-align: center;
            color: #C41717;
            font-family: 'DIN-Bold';
            font-weight: bold;
        }

        .fund-type {
            box-sizing: border-box;
            resize: none;
            margin-top: computed(20);
            display: flex;
            font-size: computed(30);
            line-height: computed(80);

            .flex-fix {
                flex: 1;
                width: 100%;
                position: relative;
                text-align: center;
            }

            .flex-fix.act {
                color: #c41717;
            }

            .flex-fix.act::after {
                content: '';
                position: absolute;
                width: 100%;
                height: computed(4);
                left: 0;
                bottom: 0;
                background: #c41717;
            }

        }
        .volume-list {
            position: relative;
            .list-item {
                box-sizing: border-box;
                padding: computed(30);
                background: #ffffff;
                border-bottom: solid 1px #F5F5F5;
                align-items: center;

                .item-memo {
                    font-size: computed(30);
                    line-height: computed(32);
                    color: #333333;
                }

                .item-time {
                    margin-top: computed(20);
                    font-size: computed(24);
                    line-height: computed(26);
                    color: #999999;
                }

                .item-value {
                    font-size: computed(32);
                    line-height: computed(34);
                    font-family: 'DIN-Bold';
                    font-weight: bold;
                }

            }
        }
        .empty-content {
            position: relative;
        }

    }
</style>