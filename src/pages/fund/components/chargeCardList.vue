<style lang='scss' scoped>

</style>

<template>
    <div class="pd30 w100 h100 flex-vbox">
        <p class="mgB20 fs26B">可使用充值卡</p>
        <div class="flex-auto overflow-scroll">
            <van-list
                v-model="showOnLoading"
                :finished="finished"
                @load="loadMoreData"
                :offset="500"
            >
                <chargeCard
                    v-for="card in cardList"
                    :key="card.id"
                    :card="card"
                    :reload="getChargeCardList"
                />
            </van-list>
        </div>
    </div>
</template>

<script>
import chargeCard from "./chargeCard";
import { List } from "vant";
import * as fundApi from "@/api/service/fund";
export default {
    components: {
        chargeCard,
        "van-list": List
    },
    data() {
        return {
            showOnLoading: false,
            finished: true,
            loadingText: "小主请稍等。。。",
            result: {},
            params: {
                pageNum: 1,
                pageSize: 10,
                buscontsCode: baseConstant.busContsCode
            },
            card: {},
            cardList: []
        };
    },
    methods: {
        async getChargeCardList() {
            this.result = await fundApi.getChargeCardList(this.params);
            if (!this.result.list) return;
            this.cardList = this.result.list || [];
        },
        async loadMoreData() {
            if (this.result.hasNextPage) {
                this.finished = false;
                this.params.pageNum += 1;
                this.showOnLoading = true;
                this.result = await fundApi.getChargeCardList(this.params);
                this.showOnLoading = false;
                this.cardList = this.cardList.concat(this.result.list);
            } else {
                this.finished = true;
                this.loadingText = "小主没有更多订单咯。。。";
                setTimeout(() => {
                    this.showOnLoading = false;
                }, 2000);
            }
        },
        onInit() {
            this.getChargeCardList();
        }
    },
    created() {
        this.onInit();
    }
};
</script>;