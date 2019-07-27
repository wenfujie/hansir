/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 19:40:41
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-13 11:28:00
 * @Description: 订单列表页
 */

<style lang='scss' scoped>
</style>

<template>
    <div class="flex-vbox h100">
        <tabs :data="tabs" @onTab="search" :index="sIndex"/>
        <div class="flex-auto pd30 bg-gray overflow-scroll">
            <scroll-view
                :data="orderList"
                :pullDownRefresh="getListData"
                :pullUpLoad="loadMoreData"
            >
                <list-item
                    v-for="(order,index) in orderList"
                    :order="order"
                    :key="index"
                    :reload="getListData"
                    :showCusList="showCusList"
                />
                <empty emptyText="暂无订单数据~" v-if="showEmpty"></empty>
            </scroll-view>
        </div>
        <custom-list :params="cusParams"></custom-list>
    </div>
</template>

<script>
import cusTabs from "./public/tabs";
import listItem from "./components/list-item";
import customList from "./components/custom-list";
import tabs from "@/components/Tabs";
import check from "@/util/check";
import * as orderApi from "@/api/service/order";
import * as goodApi from "@/api/service/goods";
import { List, Popup } from "vant";
import Empty from '../../components/EmptyContent.vue'
export default {
    data() {
        return {
            tabs: cusTabs,
            pulldownEnable: true,
            sIndex: 0,
            orderList: [],
            showLoading: false,
            finished: true,
            loadingText: "小主请稍等。。。",
            result: {},
            showEmpty: false,   // 显示空数据提示
            params: {
                pageNum: 1,
                pageSize: 10,
                searchCode: null
            },
            // 获取定制清单参数
            cusParams: {
                billCode: "",
                saleOrdDtIds: ""
            }
        };
    },
    components: {
        listItem,
        customList,
        tabs,
        "van-list": List,
        "van-popup": Popup,
        'empty': Empty
    },
    methods: {
        // 初始化路由参数
        initParams() {
            if (!check.isEmpty(this.$route.params)) {
                this.params.searchCode = this.$route.params.code || "";
                this.sIndex = this.$route.params.index || 0;
                this.Storage.set("ordListParams", this.params);
            } else if (!check.isEmpty(this.Storage.get("ordListParams"))) {
                this.params.searchCode = this.Storage.get("ordListParams").code || "";
                this.sIndex = this.Storage.get("ordListParams").index || 0;
            }
        },
        //获取列表数据
        async getListData() {
            this.showEmpty = false
            this.result = await orderApi.getList(this.params);
            // 数据不存在直接返回
            if (!this.result.data) return;
            //提取列表项
            this.orderList = this.result.data.list;
            // 判断数据是否加载完成
            if (this.orderList.length != this.result.data.total) {
                this.finished = false;
            }
            this.showLoading = false;
            if (this.orderList.length == 0) this.showEmpty = true
        },
        //上拉加载更多
        async loadMoreData() {
            if (this.finished) {
                return false;
            } else if (this.result.data.hasNextPage) {
                this.params.pageNum += 1;
                this.showLoading = true;
                this.result = await await orderApi.getList(this.params);
                this.showLoading = false;
                this.orderList = this.orderList.concat(this.result.data.list);
            } else {
                this.finished = true;
                this.loadingText = "小主没有更多订单咯。。。";
                setTimeout(() => {
                    this.showLoading = false;
                }, 2000);
            }
        },
        //按条件搜索
        search(item) {
            this.orderList = [];
            this.showLoading = true;
            this.finished = false;
            this.sIndex = item.index;
            this.params.pageNum = 1;
            this.params.searchCode = item.code;
            this.getListData();
        },
        //展示定制清单
        async showCusList(order, good) {
            this.cusParams = {
                billCode: order.billCode,
                saleOrdDtIds: good.rtlOrdDtId
            };
        },
        //
        onInit() {
            this.initParams();
            this.getListData();
        }
    },
    created() {
        this.onInit();
    },
    beforeEnter: (to, from, next) => {
        this.onInit();
    }
};
</script>