/*
* createTime：2018/11/7
* author：junyong.hong
* description: 领取优惠券列表
*/
<template>
    <div class="vouchers-list">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
        <voucherList :cardList="cardList"/>
        <empty emptyText="暂无优惠券可领~" v-show="showEmpty"></empty>
    </van-pull-refresh>
    </div>
</template>
<script type="text/ecmascript-6">
import voucherList from './components/voucherList'
import { Vouchers, Payment } from '../../api/service'
import { PullRefresh } from 'vant'
import Empty from '../../components/EmptyContent.vue'
export default {
    components: {
        voucherList,
        'van-pull-refresh': PullRefresh, 
        'empty': Empty
    },
    data() {
        return {
            // 优惠券列表
            cardList: [],
            isLoading: false,  // 是否处于下拉刷新状态
            showEmpty: false    // 是否显示空提示
        }
    },
    methods: {
        /**
         * 点击门店
         */
        addressSelect (item, index) {
            this.infoActive = index
            this.actAddressDetail = item.dptName
            this.addressDetails =item.address
            this.dptId = item.dptId
            this.dptCode = item.dptCode
            // 点击覆盖物，中心移动到覆盖物
            this._mapToCenter(item.lng, item.lat)
        },
        //  下拉刷新
        onRefresh() {
            this.getCouponList()
        },
        //  获取优惠券列表
        async getCouponList() {
            let cardList = [];
            let params = {
                busContsCode: baseConstant.busContsCode,
                isWeixin: 2,
                wxUnionid: Storage.get('properties').publicAccount,
                shopId: Storage.get('USER_INFO').shopId
            }
            let result = await Vouchers.getVouchersList(params);

            if (result && Array.isArray(result.couponTypesList)) {
                result.couponTypesList.forEach(item => {
                    item.couponsList.forEach(coupon => {
                        coupon.cardTypeCode = item.couponsTypeCode
                        cardList.push(coupon)
                    });
                });
            }
            this.cardList = cardList;
            this.isLoading = false
            if(this.cardList.length == 0) this.showEmpty = true
        },
    },
    created() {
        this.getCouponList()
    },
}
</script>
<style lang="scss" type="text/scss" scoped>
    .vouchers-list {
        $grayColor: #F5F5F5;

        background-color: $grayColor;
        min-height: 100%;
        -webkit-overflow-scrolling : touch;
    }
</style>