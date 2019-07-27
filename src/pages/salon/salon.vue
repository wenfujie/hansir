/*
* createTime：2018/11/2
* author：lin.xie
* description: 线下沙龙
*/
<template>
    <div class="salon-list">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
            <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
                <ul class="list" v-if="salonList.length > 0">
                    <li class="item-box" @click="routeLink(item.id)" v-for="item in salonList" v-if="item.effFlag === 1">
                        <div class="item-pic" v-if="item.fileUrl !== null">
                            <img :src="getImg(item.fileUrl)" onerror="errImg(event)" />
                        </div>
                        <div class="pd30">
                            <p class="item-text">{{item.title}}</p>
                        </div>
                    </li>
                </ul>
                <empty emptyText="暂无文章~" v-if="showEmpty"></empty>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<style scoped lang="scss" type="text/scss">
    .salon-list {
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
        background: #f5f5f5;
        padding: 0 computed(30);
        overflow: hidden;
        .item-box {
            width: 100%;
            background: #fff;
            margin-top: computed(30);
            overflow: auto;
            .item-pic {
                width: 100%;
                height: computed(386);
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item-text {
                font-size: computed(30);
                line-height: computed(38);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                word-wrap: break-word;
                -webkit-box-orient: vertical;
                word-break: normal;
            }
        }
    }
</style>
<script>
    import { List, Toast, PullRefresh } from 'vant';
    import { Salon } from '../../api/service'
    import Empty from '../../components/EmptyContent.vue'

    export default {
        components: {
            'van-list': List,
            'empty': Empty,
            'van-pull-refresh': PullRefresh,
        },
        data() {
            return {
                salonList: [],  // 沙龙列表
                loading: false,    // 控制loading显示
                finished: true,  // 控制是否加载更多商品
                pageNo: 1,
                pageSize: 10,
                showEmpty: null,
                isLoading: false  // 是否处于下拉刷新状态
            }
        },
        methods: {

            //  获取线下沙龙列表
            getList () {
              let data = {
                  pageNum: this.pageNo,
                  pageSize: this.pageSize,
                  effFlag: 1,
                  seqType: 1
              }
              Salon.getList(data).then((res) =>{
                  //  只有一篇文章直接跳转详情
                  if(res.total === 1) {
                      this.$router.replace('/salon-detail?id=' + res.list[0].id)
                  }

                  this.salonList.push.apply(this.salonList,res.list)
                  if(this.salonList.length >= res.total || this.pageNo >= res.pages) {
                      this.finished = true
                  }else{
                      this.finished == false
                  }
                  //  是否显示空文章提示
                  if(this.salonList.length > 0) {
                      this.showEmpty = false
                  }else{
                      this.showEmpty = true
                  }
                  this.loading = false
                  this.isLoading = false
              },()=>{
                  this.finished = true
                  this.loading = false
                  this.isLoading = false
              })
            },

            //  加载更多
            loadMore () {
                if(this.finished === true) {
                    Toast('没有更多了~')
                    return
                }else{
                    this.pageNo += 1
                    this.getList()
                }
            },

            //  路由跳转
            routeLink(id) {
                this.$router.push('/salon-detail?id=' + id)
            },

            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                this.salonList = []
                this.getList()
            }
        },
        created() {
            this.getList()
        },
        mounted() {
            setTimeout(() => {
                this.$nextTick(() => {
                    window.scrollTo(0, 1)
                })
            },100)
        }
    }
</script>