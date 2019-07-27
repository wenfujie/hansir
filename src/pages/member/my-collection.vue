/*
* createTime：2018/11/5
* author：en.chen
* description:  我的收藏
*/
<template>
    <div class="my-collection">

        <!--商品列表 begin-->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                <div class="goods-list">
                    <ul>
                        <li class="goods-item" v-for="item in goodsList">
                            <img v-lazy="getImg(item.thumb)" onerror="errImg(event)" alt="" @click="goDetail(item)">
                            <div class="diy-flag" v-if="item.orderFlag === 1">定制</div>
                            <p class="goods-name">{{item.goodsName}}</p>
                            <div class="goods-price">
                                <span class="sale-price fl">￥{{item.salePrice | Fix2}}</span>
                                <span class="fr pdR30" @click.stop="deleteCollected(item)"><i
                                        class="iconfont icon-shanchu"></i></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--没有商品 begin-->
                <empty emptyText="暂无收藏" v-show="showEmpty"></empty>
            </van-pull-refresh>
        </van-list>
        <!--商品列表 end-->

        <!--没有商品 begin-->
        <!-- <div class="empty-content" v-if=" !goodsList.length || goodsList.length < 1 ">
            <p>{{emptyText}}</p>
        </div> -->
        <!--没有商品 end-->

    </div>
</template>
<script>
    import {List, Dialog, Toast, PullRefresh} from 'vant';
    import Storage from "../../util/storage";
    import {Collection, Cms} from '../../api/service'
    import Empty from '../../components/EmptyContent.vue'

    export default {
        components: {
            'van-list': List,
            'empty': Empty,
            'van-pull-refresh': PullRefresh,
        },
        data() {
            return {
                goodsList: [],  // 商品列表
                loading: false,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                pageNum: 1,
                pageSize: 10,
                emptyText: '正在努力加载中~',
                isLoading: false,  // 是否处于下拉刷新状态
                showEmpty: false    // 显示空
            }
        },
        methods: {

            //  加载收藏商品列表
            getList() {
                let data = {
                    cltTypeCode: '',
                    collocationCode: '',
                    priceTypeCode: '',
                    busContsCode: baseConstant.busContsCode,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                Collection.getCollectionList(data).then((res) => {
                    this.goodsList.push.apply(this.goodsList, res.list)
                    if (!this.goodsList.length || this.goodsList.length < 1) {
                        this.emptyText = '您还没有收藏商品~'
                        this.showEmpty = true
                    }
                    this.loading = false
                    this.isLoading = false
                    if ((res.pageNum >= res.pages) || (this.goodsList.length >= res.total)) {
                        this.finished = true
                    }
                }, (err) => {
                })
            },
            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                this.goodsList = []
                this.getList()
            },
            //  上拉加载更多
            loadMore() {
                if (this.finished === true) {
                    Toast('没有更多了')
                    return
                } else {
                    this.pageNum += 1
                    this.getList()
                }
            },

            //  取消收藏/移除愿望清单
            deleteCollected(item) {
                Dialog.confirm({
                    message: '确定取消收藏嘛？'
                }).then(() => {
                    let goodsCodes = []
                    this.goodsList.forEach((data) => {
                        if (data.id === item.id) {
                            goodsCodes.push(item.goodsCode)
                        }
                    })
                    let data = {
                        goodCodeStr: goodsCodes.join(','),
                        ids: item.id
                    }
                    Collection.deleteCollection(data).then((res) => {
                        Toast('操作成功~')
                        this.$nextTick(() => {
                            this.pageNum = 1
                            this.goodsList = []
                            this.getList()
                        })
                    })
                }, err => {
                })
            },

            //  跳转商品详情
            goDetail(item) {
                if (item.orderFlag === 1) {
                    this.$router.push('/goods-detail?goodsCode=' + item.goodsCode + '&goodsType=singleGood')
                } else if (item.orderFlag === 2) {
                    if (item.showWayCode && item.showWayCode == 'D_SHOWWAY_3D') {  // 3d定制
                        this.$router.push('/goods-design?goodsCode=' + item.goodsCode)
                    } else {
                        this.$router.push('/goods-detail?goodsCode=' + item.goodsCode + '&goodsType=groupGoods')
                    }
                }
            }
        },
        created() {
            this.getList()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .my-collection {
        overflow: hidden;

    .goods-list {
        margin: computed(30);
        position: relative;
        overflow: hidden;

    ::after {
        content: '';
        clear: both;
        display: table;
    }

    .goods-item {
        float: left;
        width: computed(330);
        margin-bottom: computed(100);
        position: relative;

    img {
        display: block;
        border: none;
        width: computed(330);
        height: computed(330);
    }

    .diy-flag {
        position: absolute;
        left: 0;
        top: 0;
        width: computed(60);
        height: computed(30);
        z-index: 3;
        -webkit-border-radius: 1px;
        -moz-border-radius: 1px;
        border-radius: 1px;
        font-size: computed(24);
        line-height: computed(30);
        color: #ffffff;
        text-align: center;
        background: #d5af6e;
    }

    .goods-name {
        margin-top: computed(30);
        font-size: computed(28);
        line-height: computed(30);
        color: #0D0E09;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .goods-price {
        margin-top: computed(30);
        font-size: computed(26);
        line-height: computed(30);

    ::after {
        content: '';
        display: table;
        clear: both;
    }

    .sale-price {
        color: #0D0E09;
        font-weight: bold;
    }

    .icon-shanchu {
        font-size: computed(26);
        line-height: computed(30);
        color: #999999;
    }

    }
    }
    .goods-item:nth-child(2n) {
        float: right;
    }

    }
    }
</style>
