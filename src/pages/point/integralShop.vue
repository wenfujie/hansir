
<template>
    <div class="point-detail bg-gray pain-style integral" :class="{ 'flex-vbox' : showEmpty === true }">
        <div class="bg-white">
            <p class="point-title">可用积分</p>
            <p class="point-value">{{pointInfo.useablePoints}}</p>
        </div>
        <div class="point-content">
            <van-list v-model="loading" :finished="finished" :immediate-check="false" @load="loadMore">
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                <div class="point-item" v-for="(item,index) in list" :key="index" v-if="showEmpty === false">
                    
                    <ul class="bg-white">
                        <div>
                            <li class="point-item-detail flex-between">
                                <div class="cell">
                                    <div class="cell-img">

                                        <img v-if="item.cardTypeCode == 'D_AONETIMECARD'" src="../../assets/images/member/chuzhi.png" alt="">
                                        <img v-if="item.cardTypeCode == 'D_CASHVOLUME'" src="../../assets/images/member/diyong.png" alt="">
                                        <img v-if="item.cardTypeCode == 'D_DISCOUNTCOUPONS'" src="../../assets/images/member/zhekou.png" alt="">
                                    </div>
                                    <div class="cell-info">
                                        <p class="cell-title">{{item.valuecardName}}</p>
                                        <p class="cell-num">{{item.needPoints}}积分</p>
                                        <div class="cell-details" @click="toggleSelected(index)">使用说明 <i
                            class="iconfont icon-down fs36B"
                            :class="{rotatingUp:item.isSelected,rotatingDown:!item.isSelected}"
                        ></i></div>
                                    </div>
                                    <!-- <p class="behaiver">{{detail.memo}}</p>
                                    <p class="time">{{detail.regTime}}</p> -->
                                </div>
                                <div class="point-item-value" @click="sale(index)">马上兑</div>
                            </li>
                            <div class="hidden-content" v-if="item.isSelected">
                                <div class="hidden-text">{{item.memo}}</div>
                            </div>
                        </div>
                    </ul>
                </div>
                <empty emptyText="无积分抵用券~" v-show="showEmpty"></empty>
                </van-pull-refresh>
            </van-list>
        </div>
        <van-popup v-model="showDalog" class="pain-dalog">
            <div class="successBox">
                <ul>
                    <li class="li-row">
                        <div class="Icon_success">
                            <img src="../../assets/images/volume/Icon_success.png" alt>
                        </div>
                    </li>
                    <li class="li-row">
                        <div class="li-word">兑换成功!</div>
                    </li>
                    <li class="li-row">
                        <div class="li-action" @click="jumpMyReserve">
                            前往查看&nbsp;
                            <i class="iconfont icon-gengduo"></i>
                        </div>
                    </li>
                </ul>
                <div class="closeIcon" @click="showDalog = false">
                    <img src="../../assets/images/volume/Pop_close.png" alt>
                </div>
            </div>
        </van-popup>
    </div>
    
</template>
<script>
    import { Point,MeasureMaster } from '../../api/service'
    import { List,Popup,Toast,Dialog,PullRefresh } from 'vant';
    import Storage from '../../util/storage'
    import Empty from '../../components/EmptyContent.vue'
    
    export default {
        components: {
            "van-popup": Popup,
            'van-pull-refresh': PullRefresh, 
            "van-list": List,
            'empty': Empty
        },
        data() {
            return {
                list: [],
                showDalog:false,
                isLoading: false,
                loading: false,
                pageNum: 1,
                finished: false,
                pointInfo: {},
                showEmpty: false
            }
        },
        methods: {
            toggleSelected(index) {
                
                this.list[index].isSelected = !this.list[index].isSelected;
                console.log( this.list[index].isSelected )
            },
            sale(index) {
                Dialog.confirm({
                    title: '确定要兑换该卷吗？',
                    confirmButtonText:'确定兑换',
                    cancelButtonText:'暂时不换'
                    }).then(() => {
                        if(this.list[index].pointsEnough){
                            let adata={
                                dptId:Storage.get('USER_INFO').shopId,
                                swopCtCardId:this.list[index].id,
                                usrId: Storage.get('USER_INFO').usrId,
                                ownCompanyId: Storage.get("COMPANYID").company_id,
                                companyId:Storage.get("COMPANYID").company_id,
                            }
                            Point.sellCardData(adata).then(
                                    (res) => {
                                        console.log(res);
                                        if(res == 1){
                                            
                                        this.showDalog = !this.showDalog
                                        this.getPage()
                                        }
                                        else{
                                            Toast("兑换失败！！！");

                                        }
                
                                    },
                                () => {
                                    Toast("提交出错了~");
                                    this.btnLock = false;
                                }
                            );

                        }else{
                            Toast("兑换失败，积分不足");

                        }
                 }).catch(() => {
                        // on cancel
                    });
            },
            /**
             * 
             * 跳转
             */
            jumpMyReserve() {
                this.$router.replace("/my-vouchers");
            },
            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                this.list = []
                this.getPage()
            },
            //  加载更多商品
            loadMore () {
                setTimeout(() => {
                    if (this.finished === true) {
                        Toast("没有更多了~");
                        return;
                    } else {
                        this.pageNum += 1;
                        this.getPage();
                    }
                }, 100);
            },
            getPage () {
                let adata={
                dptId:Storage.get('USER_INFO').shopId,
                pageNum:this.pageNum,
                pageSize:5,
                usrId: Storage.get('USER_INFO').usrId,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                companyId:Storage.get("COMPANYID").company_id
            }
            Point.getCardData(adata).then(
                    (res) => {
                        console.log(res);
                        if(!res.list || res.list.length === 0) {
                            this.showEmpty = true
                        }else{
                            for (var j = 0; j < res.list.length; j++) {
                                this.list.push(res.list[j])
                                this.$set(res.list[j], "isSelected", true)
                            }
                        }
                        if (parseInt(res.pageNum) >= parseInt(res.pages)) {
                            this.finished = true;
                        } else {
                            this.finished = false;
                        }
                        this.isLoading = false
                        this.loading = false;
                    },
                () => {
                    // Toast("提交出错了~");
                    this.btnLock = false;
                    this.isLoading = false
                    this.showEmpty = true
                }
            )
            },
            getPoint(){
                let data = {}
                Point.getPointDetail(data).then((res) => {
                    /* if(res.list.length >0) {
                        let time = new Date()
                        let year = time.getFullYear()
                        let month = time.getMonth() + 1
                        res.list.forEach((item) => {
                            item.title = ''  // 初始化显示标题
                            if((item.date.substring(0,4)).indexOf(year) === -1 ) {
                                //  判断是否同年
                                item.title = item.date
                            }else{
                                //  判断是否是当前月
                                if((item.date.substr(item.date.length-2)).indexOf(month) !== -1) {
                                    item.title = '本月'
                                }else{
                                    item.title = item.date.substr(item.date.length-2) + '月'
                                }
                            }
                        })
                    }else{
                        this.showEmpty = true
                    } */
                    // this.isLoading = false
                    this.pointInfo = res
                },()=>{
                    
                })
            }
        },
        created() {
            this.getPoint()
            this.getPage()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .point-detail{
        min-height: 100vh;
        overflow: hidden;
        .bg-white{
            overflow: hidden;
        }
        .point-title{
            font-size: computed(26);
            line-height: computed(30);
            margin-top: computed(29);
            text-align: center;
            color:rgba(153,153,153,1);
        }
        .point-value{
            font-size: computed(72);
            line-height: computed(74);
            margin: computed(29) 0;
            text-align: center;
            color: #C41717;
            font-family: 'DIN-Bold';
            font-weight: bold;
        }
        .point-list-title{
            position: relative;
            margin: computed(40) computed(30);
            font-size: computed(24);
            line-height: computed(26);
            text-align: center;
            color: #999999;
            &::before{
                content: '';
                  width: computed(255);
                  height: 1px;
                  position: absolute;
                  top: 50%;
                  left: 0;
                  transform: translateY(-50%);
                  background: #DBDBDB;
             }
            &::after{
                 content: '';
                 width: computed(255);
                 height: 1px;
                 position: absolute;
                 top: 50%;
                 right: 0;
                 transform: translateY(-50%);
                 background: #DBDBDB;
             }
        }
        .month{
            margin: computed(30);
            font-size: computed(26);
            line-height: computed(28);
            color: #666666;
        }
        .point-item-detail{
            padding: computed(51) 0;
            align-items: center;
            border-bottom: solid 1px #DBDBDB;
            .behavior{
                font-size: computed(30);
                line-height: computed(30);
                color: #333333;
            }
            .time{
                margin-top: computed(20);
                font-size: computed(24);
                line-height: computed(26);
                color: #999999;
            }
            .point-item-value{
                width:computed(114);
                height:computed(56);
                border:computed(2) solid rgba(196,23,23,1);
                border-radius:computed(4);
                font-size:compuetd(26);
                font-weight:500;
                color:rgba(196,23,23,1);
                line-height:computed(56);
                text-align: center;
                margin-right: computed(32);
            }
        }
        .empty-content{
            height: auto;
            flex: 1;
        }

    }
    .point-content{
        margin-top: computed(20);
    }
    .hidden-content{
        padding: computed(32) computed(50);
        font-size:computed(24);
        font-weight:500;
        color:rgba(51,51,51,1);
        background-color: #F5F5F5;

    }
    .cell{
        margin-left: computed(50);
       .cell-img{
        display: inline-block;
        width:computed(100);
        height:computed(100);
            img{
                width: 100%;
                height: 100%;
            }
       } 
       .cell-info{
           display: inline-block;
           margin-left: computed(48);
           .cell-title{
               font-size:computed(32);
                font-weight:500;
                color:rgba(13,14,9,1);

           }
           .cell-num{
               font-size:computed(26);
                font-weight:500;
                color:rgba(196,23,23,1);

           }
           .cell-details{
               font-size:computed(24);
                font-weight:500;
                color:rgba(153,153,153,1);
                i{
                    font-size:computed(23);
                    margin-left: computed(18);
                }

           }
       }

    }
    .successBox{
        width:computed(650);
        height:computed(386);
        background:rgba(255,255,255,1);
        border-radius:computed(10);
        position: relative;
        .li-row{
            text-align: center;
            .Icon_success{
                margin-top: computed(30);
                display: inline-block;
                width: computed(100);
                height: computed(100);
                border: computed(1) dashed rgb(136, 136,136);
                img{
                    width: 100%;
                    height: 100%;
                }

            }
            .li-word{
                font-size:computed(36);
                font-weight:bold;
                color:rgba(213,175,110,1);
                margin-top: computed(19);
            }
            .li-word1{
                font-size:computed(28);
                font-weight:500;
                color:rgba(102,102,102,1);
                margin-top: computed(60);
            }
            .li-action{
                font-size:computed(28);
                font-weight:500;
                color:rgba(13,14,9,1);
                margin-top: computed(60);
                i{
                    font-size: computed(14);
                    color:rgba(13,14,9,1);
                }
            }
        }
        .closeIcon{
            // border: computed(1) dashed rgb(136,136,136);
            z-index: 10000000;
            width: computed(64);
            height: computed(64);
            display: inline-block;
            position: absolute;
            bottom: computed(-184);
            left: 44%;
            img{
                width: 100%;
                height: 100%;

            }

 
        }
    }
</style>