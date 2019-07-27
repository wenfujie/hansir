/*
* createTime：2018/8/24
* author：en.chen
* description:  会员模块--消费记录
*/
<template>
    <div class="purchase bg-gray">
        <!--消费记录列表 begin-->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false" v-if="yearList.length > 0" >
            <div v-for="year in yearList" :key="">
                <div class="history-box">
                    <p class="year-line">{{year}}</p>
                    <ul class="history-list bg-white" v-if="historyList.length>0" >
                        <li class="history-item flex-between" v-for="item in historyList" v-if="item.purchaseTime === year">
                            <div>
                                <p class="detail">{{item.consumeName}}</p>
                                <p class="purchase-time">{{item.consumeTime}}</p>
                            </div>
                            <span class="value">-{{item.consumeAmount}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </van-list>
        <!--消费记录列表 end-->

        <!--无消费记录 begin-->
        <div class="empty-content" v-if="historyList.length <= 0">暂无消费记录</div>
        <!--无消费记录 end-->
    </div>
</template>
<script>
    import { List, Toast } from 'vant';
    import { UserService } from '../../api/service'
    import Storage from '../../util/storage'

    export default {
        components: {
            'van-list': List
        },
        data() {
            return {
                historyList: [],
                loading: true,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                pageNum: 1,
                pageSize: 10,
                yearList: [],
                total: ''
            }
        },
        methods: {
            getList () {
                if(this.finished === true) {
                    Toast('没有更多了~')
                    this.loading = false
                    return
                }
                let time = ''
                if(this.historyList.length >= 1) {
                    let len = this.historyList.length
                    time = this.historyList[len-1].consumeTime  // 当数据大于0时，取最后一条的时间参数作为lastTime
                }
                let data = {
                    cookieId: Storage.get('USER_INFO').usrId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    lastTime: time || null
                }
                UserService.getPurchase(data).then((res) => {
                    this.total = res.total
                    if(res.list.length>0){
                        res.list.forEach((item) => {
                            let year = item.consumeTime.substr(0,4)
                            item.purchaseTime = year
                            if(this.yearList.length === 0) {  // 获取时间年限
                                this.yearList.push(year)
                            }else{
                                for(let i=0; i<this.yearList.length; i++) {
                                    if(this.yearList[i] !== year){
                                        this.yearList.push(year)
                                    }else {}
                                }
                            }
                            this.historyList.push(item)
                        })
                    }
                    if(this.historyList.length >= res.total || this.pageNum >= res.pages) {  // 判断分页是否结束
                        this.finished = true
                        this.loading = false
                    }
                }).then(() => {
                    this.loading = false
                })
            },
            loadMore () {
                if(this.finished === true) {
                    Toast('没有更多了~')
                    return
                }
                else{
                    this.pageNum += 1
                    this.getList()
                }
            }
        },
        created() {
            this.getList()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .purchase{
        overflow: hidden;
        min-height: 100vh;
        .history-box{
            position: relative;
            overflow: hidden;
            .year-line{
                margin: computed(30);
                font-size: computed(26);
                line-height: computed(28);
                color: #666666;
            }
        }
        .history-list{
            .history-item{
                margin: 0 computed(30);
                padding: computed(30) 0;
                align-items: center;
                border-bottom: solid 1px #DBDBDB;
                .purchase-time{
                    margin-top: computed(20);
                    font-size: computed(24);
                    line-height: computed(26);
                    color: #999999;
                }
                .detail{
                    font-size: computed(30);
                    line-height: computed(30);
                    color: #333333;
                    word-break: break-all;
                }
                .value{
                    margin-left: computed(20);
                    font-family: 'DIN-Bold';
                    font-size: computed(32);
                    line-height: computed(34);
                    color: #0D0E09;
                    font-weight: bold;
                }
                &:last-child {
                    border-bottom: none;
                }
            }
            &:last-child {
                margin-bottom: computed(30);
            }
        }
    }
</style>
