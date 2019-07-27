/*
* createTime：2018/11/2
* author：fujie.wen
* description: 商品评价
*/
<template>
    <div class="container">

        <!--头部评分-->
        <div class="head-comment flex-box">
            <div class="head-comment-label fs28">评价</div>
            <div class="head-comment-star">
                <van-rate
                        disabled
                        v-model="score"
                        :size="18"
                        :count="5"
                        disabled-color="#D5AF6E"
                        color="#D5AF6E"
                        void-color="#D5AF6E"/>
            </div>
        </div>

        <div class="comment-main">

            <van-list :immediate-check="false"
                      v-model="loading"
                      :finished="finished"
                      @load="onLoad">
                <!--评价列表-->
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                <ul class="comment-list">
                    <li class="comment-list-item" v-for="(item,index) in comments">
                        <div class="comment-user flex-between">
                            <div class="comment-user-left">
                                <span class="fs26B">{{index + item.usrName}}</span>
                                <span class="comment-vip">{{item.vipLevelName}}</span>
                            </div>
                            <div class="comment-user-right fs24">{{item.commentTime | filterDate}}</div>
                        </div>

                        <div class="comment-text fs24">{{item.commentMemo}}</div>

                        <ul class="comment-img-list flex-box flex-wrap"
                            v-if="item.thumbsVos && item.thumbsVos.length > 0">
                            <li class="comment-img-item" v-for="(thumItem,thumIndex) in item.thumbsVos">
                                <img :src="getImg(thumItem.url)" @error="errImg($event)" alt="评价缩略图" @click="bigPic(item.thumbsVos,thumIndex)">
                            </li>
                        </ul>

                        <p class="comment-reply fs24" v-if="item.answerCommentmo">回复：{{item.answerCommentmo}} </p>
                    </li>
                </ul>
                <empty emptyText="暂无评价~" v-show="showEmpty"></empty>
            </van-pull-refresh>
            </van-list>
        </div>

        <!--评论大图轮播-->
        <!--<van-popup v-model="showBigPic" z-index="6666" :overlay="true" :lock-scroll="true" :lazy-render="true">-->
            <!--<div class="big-pic-box">-->
                <!--<van-swipe :loop="false" :width="300">-->
                    <!--<van-swipe-item v-for="(image, index) in bigPics" :key="index">-->
                        <!--<img :src="getImg(image)" class="big-pic" @error="errImg($event)"/>-->
                    <!--</van-swipe-item>-->
                <!--</van-swipe>-->
            <!--</div>-->
        <!--</van-popup>-->

        <!--评论大图轮播-->
        <van-popup v-model="showBigPic" :overlay="true" class="comment-detail">
            <van-swipe :initial-swipe="bannerIndex" :loop="false">
                <van-swipe-item v-for="(image, index) in bigPics" :key="index">
                    <img v-lazy="getImg(image)"/>
                </van-swipe-item>
            </van-swipe>
        </van-popup>

    </div>
</template>

<script>
    import {Rate, List, Popup, Swipe, SwipeItem, PullRefresh} from 'vant';
    import Storage from "../../util/storage";
    import {Goods} from "../../api/service";
    import Empty from '../../components/EmptyContent.vue'

    export default {
        components: {'van-rate': Rate, 'van-list': List, 'van-popup': Popup, 'van-swipe':Swipe, 'van-swipe-item':SwipeItem, 'van-pull-refresh': PullRefresh, 'empty': Empty},
        data () {
            return {
                score: 5,
                pageNum: 1,
                pageSize: 10,
                comments: [],//评论列表
                loading: false,
                isLoading: false,
                showEmpty: false,
                finished: false,
                showBigPic: false,// 显示评论大图
                bigPics: [],// 评论大图数组
                bannerIndex:0,
            }
        },

        filters: {
            filterDate (val) {
                if (val && val.length > 10) {
                    return val.substring(0, 10);
                }
                return val;
            }
        },

        methods: {
            //  放大图片
            bigPic (data,index) {
                let arr = []
                data.forEach((item) => {
                    if (item.url) {
                        arr.push(item.url)
                    }
                })
                this.bigPics = arr
                this.showBigPic = true
                this.bannerIndex = index;
            },

            onLoad () {
                if (!this.finished) {
                    this.pageNum++;
                    this.getGoodsComments();
                    // 异步更新数据
                    setTimeout(() => {

                    }, 500);
                }
            },
            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                 this.comments = [];
                this.getGoodsComments()
            },
            // 查询商品评价
            getGoodsComments () {
                let commentData = {
//                    usrId: Storage.get("USER_INFO").usrId,
                    //测试数据
//                    goodsCode: 'QD10160001',
                    goodsCode: this.goodsCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    busContsCode: baseConstant.busContsCode
                };
                Goods.getGoodsComments(commentData).then((res) => {
                    if (res.list && res.list.length > 0) {
                        res.list.forEach((item) => {
                            this.comments.push(item)
                        })
                    }else{
                        this.showEmpty = true
                    }
                    if (res.pages <= this.pageNum) {
                        this.finished = true;
                    }
                }).then(() => {
                    this.loading = false;
                    this.isLoading = false
                });
            },

            // 获取综合评分
            getGoodsScore(){
                let commentData = {
//                    usrId: Storage.get("USER_INFO").usrId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    //测试数据
//                    goodsCode: 'QD10160001',
                    goodsCode: this.goodsCode,
                    busContsCode: baseConstant.busContsCode
                };
                Goods.getGoodsScore(commentData).then((res) => {
                    this.score = res;
                })
            },
        },
        created () {
            this.goodsCode = this.$route.query.goodsCode;
            this.getGoodsComments();
            this.getGoodsScore();
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100%;
    }
    .comment-main {
        height: calc(100% - #{computed(115)});
        overflow: auto;
        .van-pull-refresh{
            overflow: unset;
        }
    }
    .container {
        background: #f5f5f5;
        min-height: 100%;
    }
    .head-comment {
        background: #fff;
        border-bottom: computed(3) solid #f2f2f2;
        padding: computed(30) computed(30) computed(41) computed(30);
    }
    .head-comment-label {
        padding-right: computed(42);
    }
    .comment-list-item {
        padding: computed(30);
        background: #fff;
        margin-bottom: computed(20);

        .comment-user {
            line-height: computed(30);

            .comment-user-left {

                .comment-vip {
                    display: inline-block;
                    margin-left: computed(10);
                    color: #fff;
                    font-size: computed(22);
                    background: #d5af6e;
                    padding: 0 computed(15);
                }
            }
            .comment-user-right {
                color: #999;
            }
        }

        .comment-text {
            color: #666;
            line-height: computed(30);
            padding: computed(34) 0 computed(27) 0;
        }

        .comment-img-list {
            .comment-img-item {
                width: computed(150);
                height: computed(150);
                padding: 0 computed(20) computed(30) 0;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .comment-reply {
            color: #666;
            line-height: computed(30);
            padding-bottom: computed(17);
        }
    }
    .big-pic-box .van-swipe {
        width: auto;
        .van-swipe__track {
            width: auto !important;
            .van-swipe-item {
                width: auto !important;
            }
        }
    }
    .big-pic {
        width: 80vw;
        height: 80vw;
        display: block;
    }
    .empty-content{
        height: 100%;
    }
    .comment-detail{
        width: 100%;
        .van-swipe-item{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                display: block;
                height: computed(750);
                max-width: 100%;
            }
        }
    }
</style>