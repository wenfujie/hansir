<style lang='scss' scoped >
.wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .iconfont {
        font-size: computed(36);
        margin-right: computed(20);
    }
    .split-line {
        width: 1px;
        height: 80%;
        background-color: #cccccc;
    }
    .bottom-btns-wrap {
        display: flex;
        button,
        a {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: computed(100);
            text-align: center;
            color: #fff;
            background: $maincolor;
        }
        .phone-box {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
    }
}
</style>

<template>
    <div class="wrap">
        <div class="fs32B text-center pdTb30">我的售后 ({{result.data.total}})</div>
        <scroll-view :data="list" :pullDownRefresh="onRefresh" :pullUpLoad="loadMoreData">
            <item-list
                v-for="(item,index) in list"
                :key="index"
                :data="item"
                :reload="onRefresh"
            />
            <empty emptyText="暂无售后数据~" v-if="showEmpty"></empty>
        </scroll-view>

        <div class="bottom-btns-wrap">
            <button @click="contactCustoms()">
                <i class="iconfont icon-kefu"></i> 联系客服
            </button>
            <div class="split-line"></div>
            <a href="tel:400-6070-600">
                <i class="iconfont icon-dianhua"></i>
                <div class="phone-box">
                    <div>拨打电话</div>
                    <div>400-6070-600</div>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
import components from "./components";
import postSaleApi from "@/api/service/postSale";
export default {
    components: components,
    data() {
        return {
            pageSize: 10,
            pageNum: 1,
            showEmpty: false,
            result: {
                data: {
                    total: 0
                }
            },
            list: []
        };
    },
    methods: {
        // 合并请求参数
        getParams() {
            return {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            };
        },
        //  下拉刷新
        onRefresh() {
            this.pageNum = 1
            this.list = []
            this.getListData()
        },
        //获取售后申请单列表
        async getListData() {
            this.result = await postSaleApi.getList(this.getParams());
            if (!this.result.data) {
                this.showEmpty = true // 显示空数据提示
                return false;
            } else {
                this.list = this.result.data.list;
                if (this.list.length == 0) this.showEmpty = true // 显示空数据提示
            }
            return this.list;
        },
        //上拉加载更多
        async loadMoreData() {
            if (this.result.data.hasNextPage) {
                this.pageNum += 1;
                this.result = await postSaleApi.getList(this.getParams());
                if (this.result) {
                    this.list = this.list.concat(this.result.data.list);
                }
            }
        },
        //联系客服
        contactCustoms() {
            contact();
        }
    },
    created() {
        this.getListData();
        console.log('初始化')
    },
    computed: {
        renderSv: function () {
            return this.list.length > 0 ? true : false;
        }
    },
    watch: {
        $route: function () {
            this.getListData();
            console.log('路由初始化')
        }
    },
    beforeDestroy() {
        this.result = {};
        this.list = []
    }

};
</script>