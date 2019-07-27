/*
* createTime：2018/11/2
* author：fujie.wen
* description: 商品列表
*/
<template>
    <div class="container">
        <!--头部-->
        <ul class="header flex-around">
            <li :class="['header-item','fs28',{'selected':activeIndex === index}]"
                :key="item.id"
                @click="switchNav(item,index)"
                v-for="(item,index) in filterList">
                <span>{{item.text}}</span>
                <img v-if="item.id === 3" class="header-item-sort" :src="priceSortImgName" alt="价格">
            </li>
        </ul>
        <van-list v-model="loading"
                  :finished="finished"
                  :immediate-check="false"
                  @load="loadMore">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">      
            <!--商品列表-->
            <ul class="good-list">
                <li class="good-list-item flex-vbox flex-vcenter" v-for="(item,index) in goodList"
                    @click="goDetail(item)">
                    <div class="good-item-img">
                        <img alt="商品logo" v-lazy="getImg(item.glbFileUrl)" @error="errImg($event)">
                    </div>
                    <div class="good-item-describe fs28 pdTb30">{{item.goodsName}}</div>
                    <div :class="['good-item-price', 'pdB20', 'fs26B',{'pdB60':!item.tagPrice}]">¥{{item.salePrice | $goldDivide}}</div>
                     <div class="good-item-tprice pdB60 fs26B" v-if="item.tagPrice">¥{{item.tagPrice | $goldDivide}}</div>
                </li>
            </ul> 
            <empty emptyText="暂无该商品信息~" v-show="!goodList.length && !loading"></empty>
            </van-pull-refresh>
        </van-list>
        <div class="good-foot" v-show="goodList.length">
            <list-foot/>
        </div>
    </div>
</template>

<script>
    import ListFoot from "@/components/ListFoot.vue";
    import {Goods} from "../../api/service";
    import Storage from "../../util/storage";
    import {List, Toast, PullRefresh} from 'vant';
    import Empty from '../../components/EmptyContent.vue'


    export default {

        components: {ListFoot, "van-list": List, Toast, 'van-pull-refresh': PullRefresh, 'empty': Empty},

        data () {
            return {
                activeIndex: -1,//所选过滤项下标
                filterList: [],//过滤列表
                priceSortState: 0,// 0未选中价格 1降序 2升序
                goodList: [],//商品列表
                loading: false,
                finished: false,
                pageNum: 1,//页数
                isLoading: false  // 是否处于下拉刷新状态
            }
        },



        created () {
            this.classId = this.$route.query.classId?this.$route.query.classId:'';// 分类页跳转时存在类别id
            this.userInfo = Storage.get("USER_INFO");
            this.filterList = [
                {id: 1, text: '设计师推荐', sortParam: [{field: "recmSeq", order: "DESC"}]},
                {id: 2, text: '销量优先', sortParam: [{field: "sales", order: "DESC"}]},
                {id: 3, text: '价格', sortParam: [{field: "price", order: "DESC"}]}
            ];

            // 初始化选中'设计师推荐'
            this.switchNav(this.filterList[0], 0);
        },

        computed: {
            priceSortImgName () {
                let imgName = "";
                switch (this.priceSortState) {
                    case 1:
                        imgName = "Price_down.png";
                        break;
                    case 2:
                        imgName = "Price_up.png";
                        break;
                    default:
                        imgName = "Price_ash.png";
                        break;
                }
                return require("@/assets/images/goods/" + imgName);
            }
        },

        methods: {
            //  商品详情跳转 orderFlag 1详情 2定制
            goDetail (item) {
                let routerSrc = "";
                let goodsType = "";
                if (item.orderFlag == 1) {
                    goodsType = "singleGood";
                    routerSrc = "/goods-detail";
                } else if (item.orderFlag == 2) {
                    if(item.showWayCode && item.showWayCode == 'D_SHOWWAY_3D'){
                        // todo 待添加定制页面路由参数
                        routerSrc = "/goods-design" + `?goodsTitle=${item.goodsName}&fromPage=goods-list`;
                    }else{
                        goodsType = "groupGoods";
                        routerSrc = "/goods-detail";
                    }
                }
                routerSrc += (routerSrc.indexOf('?') == -1 ? '?':'&') + `goodsCode=${item.goodsCode}` + (goodsType?`&goodsType=${goodsType}`:'');
                this.$router.push(routerSrc);
            },
            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                this.goodList = []
                this.getGoodList()
            },
            //  加载更多商品
            loadMore () {
                console.log("加载更多商品")
                setTimeout(() => {
                    if (this.finished === true) {
                        Toast("没有更多了~");
                        return;
                    } else {
                        this.pageNum += 1;
                        this.getGoodList();
                    }
                }, 100);
            },
            /**
             * 获取商品列表
             * @param sortParam 排序方式
             */
            getGoodList (callback) {
                this.loading = true;
                let data = {
                    busContsCode: baseConstant.busContsCode,// 业务触点
                    shopId: Storage.get('properties').shopId,// Storage获取
                    pageNum: this.pageNum,
                    pageSize: 8,
                    origin: "",
                    filters: [],// 面包屑
                    keyword: "",
                    sortParam: JSON.stringify(this.filterList[this.activeIndex].sortParam),
                    queryNullBusFlag: 1,
                    platformCode: this.classId
                };
                Goods.getFilterGoodsList(data).then((res) => {
                    res.hits.forEach((item) => {
                        // 大货商品不显示
//            if(item.orderFlag == 0)return;
                        this.goodList.push(item);
                    });
                    if (parseInt(res.pagination.pageNo) >= parseInt(res.pagination.totalPage)) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                    }
                    this.isLoading = false
                    this.loading = false;
                    typeof callback === 'function' && callback();
                })
            },

            // 切换导航
            switchNav (item, index) {
                if(this.loading)return;
                if (item.id === 3) {
                    if (this.priceSortState === 1) {
                        this.priceSortState = 2;//升序
                        this.filterList[2].sortParam[0].order = "ASC";
                    } else {
                        this.priceSortState = 1;//降序
                        this.filterList[2].sortParam[0].order = "DESC";
                    }
                } else {
                    this.priceSortState = 0;
                }
                if (this.activeIndex === index && item.id !== 3) return;
                this.activeIndex = index;
                this.pageNum = 1;
                this.goodList = [];
                window.scrollTo(0, 0);

                this.$nextTick(() => {
                    this.getGoodList(()=>{
                        this.$nextTick(()=>{
                            window.scrollTo(0, 5);
                        })
                    });

                })
            }
        },

    }
</script>

<style scoped lang="scss">
    .container {
        padding-top: computed(87);
        height: 100%;
        box-sizing: border-box;
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        background: #fff;
    }
    .header-item {
        flex: 1;
        line-height: computed(46);
        text-align: center;
        border-right: computed(1) solid #dbdbdb;
        margin: computed(22) 0;

        &.selected {
            color: #c30d22;
        }

        &:last-child {
            border-right: none;
        }
    }
    .header-item-sort {
        width: computed(14);
        padding-left: computed(10);
    }
    .good-list-item {
        .good-item-img {
            width: 100%;
            height: computed(750);

            img {
                width: 100%;
                height: 100%;
            }
        }

        .good-item-describe {
            text-align: center;
            width: 90%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .good-item-price {
            color: #272832;
        }
        .good-item-tprice {
            color: #999;
            text-decoration: line-through;
        }
    }
    .good-foot {
        padding-bottom: computed(208);
    }
    .good-enpty-list {
        height: calc(100% - #{computed(11)});
    }

</style>