/*
* createTime：2018/11/7
* author：junyong.hong
* description: 账户页
*/
<template>
    <div class="member-center">
        <!-- 头部：logo、用户名、会员等级 begin -->
        <div class="center-header">
            <div class="header-body">
                <div @click="navigate('/member-info')" class="header-logo">
                    <img :src="userInfo.thumb" onerror="errImg(event)">
                </div>
                <div class="header-info">
                    <p class="info-name">{{userInfo.account}}</p>
                    <!-- 普通卡：vip-common、金卡：vip-golden、黑卡：vip-black -->
                    <p class="info-vip vip-common">{{userInfo.vipLevel}}</p>
                </div>
            </div>
        </div>
        <!-- 头部 end -->
        <!-- 列表 begin -->
        <div class="center-list">
            <!-- 我的订单 begin -->
            <van-cell-group class="common-cell first-cell">
                <van-cell
                    title="我的订单"
                    class="title"
                    is-link
                    @click="goToOrdList({code:'',index:0})"
                />
                <van-cell class="order-status">
                    <div @click="goToOrdList({code:'D_ORDSPAYING',index:1})" class="item">
                        <div class="item-col num">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-daifukuan"></use>
                            </svg>
                            <i v-if="ordNum[0] > 0">{{ordNum[0]}}</i>
                            <p>待付款</p>
                        </div>
                    </div>
                    <div @click="goToOrdList({code:'D_ORDSSHIPPING',index:2})" class="item">
                        <div class="item-col num">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-daifahuo"></use>
                            </svg>
                            <i v-if="ordNum[1] > 0">{{ordNum[1]}}</i>
                            <p>待发货</p>
                        </div>
                    </div>
                    <div @click="goToOrdList({code:'D_ORDSDELIVERY',index:3})" class="item">
                        <div class="item-col num">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-daishouhuo"></use>
                            </svg>
                            <i v-if="ordNum[2] > 0">{{ordNum[2]}}</i>
                            <p>待收货</p>
                        </div>
                    </div>
                    <div @click="navigate('/postSaleList')" class="item">
                        <div class="item-col num">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-shouhouweixiu"></use>
                            </svg>
                            <i v-if="ordNum[3] > 0">{{ordNum[3]}}</i>
                            <p>维修/售后</p>
                        </div>
                    </div>
                </van-cell>
            </van-cell-group>
            <!-- 我的订单 end -->
            <!-- 用户基本属性 begin -->
            <van-cell-group class="common-cell second-cell">
                <van-cell title="个人信息" class="title" is-link @click="navigate('/member-info')"/>
                <van-cell title="资金账户" class="title" is-link @click="navigate('/fund-detail')"/>
                <van-cell title="我的会员" class="title" is-link @click="navigate('/member-ship')"/>
                <van-cell title="优惠券" class="title" is-link @click="navigate('/my-vouchers')"/>
                <van-cell title="我的积分" class="title" is-link @click="navigate('/point-detail')"/>
                <van-cell title="我的收藏" class="title" is-link @click="navigate('/my-collection')"/>
                <van-cell title="我的地址簿" class="title" is-link @click="navigate('/address-list')"/>
            </van-cell-group>
            <!-- 用户基本属性 end -->
            <!-- 预约量体 begin -->
            <van-cell-group class="common-cell three-cell">
                <van-cell title="量体数据" class="title" is-link @click="navigate('/countBodyData')"/>
                <van-cell title="我的预约" class="title" is-link @click="navigate('/myReserve')"/>
            </van-cell-group>
            <!-- 预约量体 end -->
            <!-- 售后 begin -->
            <van-cell-group class="common-cell four-cell">
                <!--<van-cell title="消费记录" class="title" is-link @click="navigate('/shopping-list')"/>-->
                <van-cell title="在线客服" class="title" is-link @click="lineService()"/>
            </van-cell-group>
            <!-- 售后 end -->
        </div>
        <!-- 列表 end -->
        <!--底部导航-->
        <footer-bar></footer-bar>
    </div>
</template>
<script type="text/ecmascript-6">
import { Row, Col, Icon, Cell, CellGroup } from "vant";
import { UserService, Base, Login, Cms } from "../../api/service";
import FooterBar from "@/components/FooterBar.vue";
// 获取订单状态数量
import { getOrdListNum } from "@/pages/order/public/functions";

export default {
    components: {
        "van-row": Row,
        "van-col": Col,
        "van-icon": Icon,
        "van-cell": Cell,
        "van-cell-group": CellGroup,
        FooterBar
    },
    data() {
        return {
            userInfo: {},
            ordNum: []
        };
    },
    created() {
        global.setWechatInfo().then(res => {
            this.getVipInfo();
        });

        // 获取订单数量
        this.getOrdNum();
    },
    methods: {
        /**
         * 路由导航
         * @param url 路由连接
         */
        navigate(url) {
            this.$router.push(url);
        },
        /**
         * 在线客服
         */
        lineService() {
            contact();
        },
        /**
         * 跳转到订单
         * @param params 路由参数
         */
        goToOrdList(params) {
            this.$router.push({
                name: "orderList",
                params: params
            });
        },
        /**
         * 获取会员信息
         */
        getVipInfo() {
            let data = {
                busContsCode: baseConstant.busContsCode
            };
            UserService.getVipInfo(data).then(res => {
                //  未绑定手机号的情况下优先跳转绑定手机号页面
                if (!res.phone || res.phone === null) {
                    this.$router.replace("./bind-phone");
                }
                // 处理会员等级
                if (res.vipLevel === null) {
                    res.vipLevel = "普通会员";
                }
                this.userInfo = res;
            });
        },
        /**
         * 获取订单数量
         * @returns {Promise.<void>}
         */
        async getOrdNum() {
            this.ordNum = await getOrdListNum(this);
        }
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
    .member-center {
        $whiteColor: #FFFFFF;
        $grayColor: #F5F5F5;
        $titleColor: #333333;
        $orderStatusColor: #666666;
        $rightColor: #0D0E09;
        $redColor: #C41717;

        position: relative;
        height: calc(100% - #{computed(128)});
        overflow-y: scroll;
        padding-bottom: computed(30);
        background-color: $grayColor;
        /* 头部 */
        .center-header {
            width: 100%;
            height: computed(349);
            background: url('../../assets/images/member/member-bg.png');
            background-size: 100% 100%;
            .header-body {
                position: absolute;
                top: computed(40);
                left: computed(30);
                display: flex;
                flex-direction: row;
                height: computed(120);
                width: calc(100% - #{computed(60)});
                .header-logo {
                    img {
                        width: computed(120);
                        height: computed(120);
                        border-radius: 50%;
                    }
                }
                .header-info {
                    flex: 1 1 auto;
                    .info-name {
                        margin: computed(20) 0 0 computed(28);
                        font-size: computed(36);
                        line-height: computed(36);
                        color: $whiteColor;
                    }
                    .info-vip {
                        display: inline-block;
                        margin: computed(22) 0 0 computed(28);
                        padding: computed(3) computed(17);
                        font-size: computed(22);
                        color: $whiteColor;
                        &.vip-common {
                            background: url('../../assets/images/member/commonCard.png');
                            background-size: 100% 100%;
                        }
                        &.vip-golden {
                            background: url('../../assets/images/member/goldenCard.png');
                            background-size: 100% 100%;
                        }
                        &.vip-black {
                            background: url('../../assets/images/member/blackCard.png');
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }

        /* 列表 */
        .center-list {
            width: calc(100% - #{computed(60)});
            z-index: 999;
            margin: computed(-127) computed(30) 0 computed(30);
            .common-cell {
                background: $whiteColor;
                margin-bottom: computed(30);
                .van-cell {
                    padding: computed(37) computed(29);
                    &:not(:last-child)::after {
                        left: computed(30);
                        right: computed(30);
                    }
                    &.title {
                        color: $titleColor;
                        font-size: computed(26);
                    }
                }
                &:last-child {
                    margin-bottom: 0;
                }
                &.first-cell{
                    .order-status{
                        padding: 0;
                        .item{
                            display: inline-block;
                            width: 25%;
                            height: computed(154);
                            vertical-align: middle;
                            text-align: center;
                            position: relative;
                            .item-col{
                                position: absolute;
                                top:50%;
                                left:50%;
                                width:100%;
                                transform:translate(-50%,-50%);
                                text-align: center;
                                .icon{
                                    width: computed(38);
                                    height: computed(38);
                                }
                                &.num{
                                    position: relative;
                                    i{
                                        position: absolute;
                                        top: computed(-17);
                                        right: computed(55);
                                        font-style: normal;
                                        font-size: computed(24);
                                        min-width: computed(32);
                                        height: computed(32);
                                        line-height: computed(32);
                                        border: 1px solid $redColor;
                                        border-radius: 50%;
                                        color: $redColor;
                                        background: $whiteColor;
                                    }
                                }
                                > p{
                                    color: $orderStatusColor;
                                    font-size: computed(24);
                                    line-height: computed(24);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
