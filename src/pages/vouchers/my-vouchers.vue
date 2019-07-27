/*
* createTime：2018/11/8
* author：junyong.hong
* description: 我的优惠券
*/
<template>
    <div class="my-vouchers">
        <!-- 标签 begin -->
        <div class="my-vouchers-tab">
            <div
                v-for="(item, index) in tabList"
                :key="index"
                :class="[tabActive === index ? 'active': '']"
                @click="tabClick(item, index)"
            >
                <span>{{item.nameCn}}</span>
            </div>
        </div>
        <!-- 标签 end -->
        <!-- 优惠券列表 begin -->
        <van-list
            v-model="loading"
            :finished="finished"
            :offset="10"
            @load="loadMore"
            :immediate-check="true"
            class="vouchers-list"
        >
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                <!-- <my-vouchers :tabType="tabActive" :cardList="cardList"></my-vouchers> -->
                <couponList :cardState="tabActive" :cardList="cardList" :reload="handleCarList"/>
                <empty emptyText="暂无优惠券~" v-if="showEmpty"></empty>
            </van-pull-refresh>
        </van-list>
        <!-- 优惠券列表 end -->
        <!-- 去领券 begin -->
        <div class="go-vouchers-btn" @click.prevent="routeLink()">去领券</div>
        <!-- 去领券 end -->
    </div>
</template>
<script type="text/ecmascript-6">
import { Tab, Tabs, List, Toast, PullRefresh } from 'vant';
import MyVouchers from '@/components/MyVouchers'
import couponList from './components/couponList'
import { Vouchers, Order } from '../../api/service'
import Empty from '../../components/EmptyContent.vue'
export default {
    components: {
        'van-tabs': Tabs,
        'van-tab': Tab,
        'van-list': List,
        MyVouchers,
        couponList,
        'van-pull-refresh': PullRefresh,
        'empty': Empty
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            loading: false,     // 是否处于加载状态
            finished: false,    // 是否已加载完成
            isLoading: false,  // 是否处于下拉刷新状态
            showEmpty: false,
            tabList: [
                {
                    tabType: 0,
                    nameEn: 'unUsed',
                    nameCn: '未使用',
                    state: 'D_VALCARDHACED'
                },

                {
                    tabType: 1,
                    nameEn: 'used',
                    nameCn: '已使用',
                    state: 'D_VALCARDUSEED'
                },
                {
                    tabType: 2,
                    nameEn: 'expired',
                    nameCn: '已过期',
                    state: 'D_VALCARDOVERD'
                },

            ],
            tabActive: 0,
            cardList: []
        }
    },
    methods: {
        /**
         * 标题切换
         * @param item
         * @param index 索引值
         */
        tabClick(item, index) {
            // 防止重复点击

            if (this.tabActive === index) return;
            this.tabActive = index;
            this.pageNum = 1;
            this.finished = false;
            this.showEmpty = false;
            this.cardList = [];
            this.handleCarList();
        },
        /**
         * 获取卡券列表
         * @param code 卡券类型
         */
        async getCardList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                statusCode: this.tabList[this.tabActive].state
            }
            return Vouchers.userVouchersList(params);
        },
        //  下拉刷新
        onRefresh() {
            this.handleCarList()
        },
        async handleCarList() {
            this.pageNum = 1;
            this.loading = true;
            let res = await this.getCardList();
            this.cardList = res.list;
            if(!!this.cardList && this.cardList.length > 0){
                this.finished = this.cardList.length < res.total ? false : true;
            }else{
                this.finished = true
                this.showEmpty = true
            }
            
            this.loading = false
            this.isLoading = false
        },
        loadMore() {
            // 有赞推荐写法，防止首次进入，请求2次分页
            setTimeout(async () => {
                if (this.finished === true) {
                    Toast('没有更多了~')
                    this.loading = false
                    this.isLoading = false
                    return
                } else {
                    this.pageNum += 1;
                    let res = await this.getCardList();
                    this.cardList = this.cardList.concat(res.list);
                    if (this.cardList.length < res.total) {
                        this.finished = false;
                    } else {
                        this.finished = true;
                    }
                    this.loading = false
                    this.isLoading = false
                }
                if(!this.cardList || this.cardList.length==0) this.showEmpty = true
            }, 100)
        },
        onInit() {
            this.handleCarList()
        },
        /**
         * 跳转到领取优惠券列表
         */
        routeLink() {
            this.$router.replace('/vouchers-list')
        }
    },
    created() {
        // 默认显示未使用优惠券
        this.onInit()
    }
}
</script>
<style lang="scss" type="text/scss" scoped>
.my-vouchers {
    $whiteColor: #ffffff;
    $grayColor: #f5f5f5;
    $redColor: #c41717;
    $tabTitleColor: #0d0e09;

    display: flex;
    flex-direction: column;
    background-color: $grayColor;
    height: 100vh;
    .my-vouchers-tab {
        width: 100%;
        height: computed(90);
        line-height: computed(90);
        text-align: center;
        > div {
            width: 33.33%;
            height: computed(90);
            background-color: $whiteColor;
            display: inline-block;
            color: $tabTitleColor;
            font-size: computed(30);
            &.active {
                color: $redColor;
                > span {
                    padding-bottom: computed(20);
                    border-bottom: 2px solid $redColor;
                }
            }
        }
    }
    .vouchers-list {
        flex: 1;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .van-pull-refresh{
            overflow: unset;
        }
    }
    .go-vouchers-btn {
        width: 100%;
        height: computed(94);
        line-height: computed(94);
        font-size: computed(28);
        text-align: center;
        background-color: $redColor;
        color: $whiteColor;
        z-index: 999;
    }
}
</style>