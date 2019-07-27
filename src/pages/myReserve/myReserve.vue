<template>
    <div class="design">
        <!-- <div class="serveListRow">
            <div class="rowTop">
                <span class="topLeft">预约时间：2017.09.12 </span>
                <span class="topRight">待审核</span>
            </div>
            <div class="rowMiddle">
                <ul>
                    <li>
                        <label for="">
                            联系人
                        </label>
                    </li>
                </ul>
            </div>
            <div class="rowBottom"></div>
        </div> -->
        <!-- 循环列表 -->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div  class="list-row" v-for="(item,index) in list" :key="index" :title="item">
             <!-- {{item.address}} -->
             <div class="row-title">
                 <span class="time">预约时间：{{item.measureTime}}</span>
                 <span class="status" :class="[{'gray-color': item.statusName == '已完成'||item.statusName == '预约完成'}]">{{item.statusName}}</span>
             </div>
             <ul class="row-ul">
                <li class="row-li" v-if="item.cargousrName !== null && item.cargousrName !== ''">
                    <label for="">联系人:</label>
                    <span>{{item.cargousrName}}</span>
                </li>
                <li class="row-li" v-if="item.cargoMobile !== null && item.cargoMobile !== ''">
                    <label for="">联系方式:</label>
                    <span>{{item.cargoMobile}}</span>
                </li>
                <li class="row-li" v-if="item.msrWayName !== null && item.msrWayName !== ''">
                    <label for="">量体方式:</label>
                    <span>{{item.msrWayName}}</span>
                </li>
                <li class="row-li" v-if="item.dptName !== null && item.dptName !== ''">
                    <label for="">量体门店:</label>
                    <span>{{item.dptName}}</span>
                </li>
                <li class="row-li" v-if="item.address !== null && item.address !== ''">
                    <label for="">量体地址:</label>
                    <span>{{item.stateName}} {{item.cityName}}{{item.destName}}{{item.address}}</span>
                </li>
                <li class="row-li" v-if="item.measureMemo!== null && item.measureMemo
 !== ''">
                    <label for="">备注:</label>
                    <span>{{item.measureMemo}}</span>
                </li>
             </ul>
             <div class="row-footer" v-if="item.statusName == '未审核'">
                 <div class="footer-delete" @click="cancelReserve(index)">
                    <i class="iconfont icon-quxiao"></i>
                    取消预约
                 </div>
                 <div class="footer-edit" @click="actionReserve(index)">
                     <i class="iconfont icon-bianji"></i>
                     编辑
                 </div>
                 
             </div>
             
        </div>
        <empty emptyText="暂无数据~" v-show="showEmpty"></empty>
            </van-pull-refresh>
        </van-list>
    </div>
</template>
<script>
    import {Volume, Cms, Payment,MeasureMaster} from "../../api/service"
    import { List,Toast,Dialog,PullRefresh } from 'vant'
    import Empty from '../../components/EmptyContent.vue'

    export default {
        name: 'web-design',
        components: {
            "van-list": List,
            'van-pull-refresh': PullRefresh,
            'empty': Empty
        },
        data() {
            return {
                // tab选中选项
                active:1,
                show: false,
                radio: '1',
                list: [],
                loading: false,
                finished: false,
                pageNum:1,
                lastPage:null,
                isLoading: false,
                showEmpty: false    // 是否显示空提示
            }
        },
        computed: {
        },
        methods: {
            reBack() {
                this.$router.push("/reserve");
            },
            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                this.list = []
                this.getReserve()
            },
            //  加载更多商品
            loadMore () {
                setTimeout(() => {
                    if (this.finished === true) {
                        Toast("没有更多了~");
                        return;
                    } else {
                        this.pageNum += 1;
                        this.getReserve();
                    }
                }, 100);
            },
            // 预加载数据
            getReserve() {
                let data ={
                    usrId: Storage.get('USER_INFO').usrId,
                    companyId: Storage.get('COMPANYID').company_id,
                    searchUsrId: Storage.get('USER_INFO').usrId,
                    pageNum: this.pageNum,
                    pageSize: 5
                }
                Volume.getVolumeList(data).then(
                    (res) => {
                        res.list.forEach(item=>{
                            this.list.push(item)
                        })
                        this.lastPage = res.lastPage
                        // 加载状态结束
                        this.loading = false;
                        this.isLoading = false;
                        // 数据全部加载完成
                        if (this.pageNum >= this.lastPage) {
                            this.finished = true;
                        }
                        if(this.list.length == 0) this.showEmpty = true
                    },
                    () => {
                        Toast("提交出错了~");
                    }
                );
            },
            //取消预约
            cancelReserve(index) {
                Dialog.confirm({
                    title: '确定删除该条量体记录吗？',
                    confirmButtonText:'确定',
                    cancelButtonText:'取消'
                    }).then(() => {
                 if(this.list[index].id !==''){
                     let data ={
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        ids: this.list[index].id,
                        ownCompanyId:Storage.get("COMPANYID").company_id,
                    }
                    Volume.delSaleMeasure(data).then(
                        (res) => {
                            console.log(res);
                            if(res == 1 ){
                            Toast("删除成功");
                            this.list.splice(index, 1);
                            }else{
                            Toast("删除失败"); 
                            }
                        },
                        () => {
                            Toast("提交出错了~");
                        }
                    );
                 }
                 }).catch(() => {
                        // on cancel
                    });
            },
            actionReserve(index) {
                if(this.list[index].msrWayCode == 'D_MSRSHOP'){
                    let storeData = {
                        id:'',
                        name: "",
                        tel: "",
                        address: "",
                        addressDetail: "",
                        date: "",
                        addressInfo: {
                            addressId: '',
                            province:'',
                            district:'',
                            city:''
                        },
                        dptCode:'',
                        dptId: '',
                        measureMemo:''
                    }
                    storeData.id = this.list[index].id
                    storeData.name = this.list[index].cargousrName
                    storeData.tel = this.list[index].cargoMobile
                    storeData.date = this.list[index].measureTime
                    storeData.address = this.list[index].stateName + this.list[index].cityName + this.list[index].destName
                    storeData.addressDetail = this.list[index].dptName
                    storeData.measureMemo = this.list[index].measureMemo
                    storeData.addressInfo.addressId = this.list[index].destCode
                    storeData.addressInfo.province = this.list[index].stateName
                    storeData.addressInfo.city = this.list[index].cityName
                    storeData.addressInfo.district = this.list[index].destName
                    storeData.dptId = this.list[index].dptId
                    storeData.dptCode = this.list[index].dptCode
                    console.log(storeData)
                    Storage.set('VOLUME_STORE', storeData)
                    Storage.set('DATA', storeData)
                    this.$router.push("/reserve?type=D_MSRSHOP&from=myReserve");
                }
                if(this.list[index].msrWayCode == 'D_MSRVISIT'){
                    let visitData = {
                        id:'',
                        name: "",
                        tel: "",
                        address: "",
                        addressDetail: "",
                        date: "",
                        addressInfo: {
                            province:'',
                            district:'',
                            city:''
                        },
                        dptId: '',
                        measureMemo:''
                    }
                    visitData.id = this.list[index].id
                    visitData.name = this.list[index].cargousrName
                    visitData.tel = this.list[index].cargoMobile
                    visitData.date = this.list[index].measureTime
                    visitData.address = this.list[index].stateName + this.list[index].cityName + this.list[index].destName
                    visitData.addressDetail = this.list[index].address
                    visitData.measureMemo = this.list[index].measureMemo
                    visitData.addressInfo.province = this.list[index].stateName
                    visitData.addressInfo.city = this.list[index].cityName
                    visitData.addressInfo.district = this.list[index].destName
                    visitData.dptId = this.list[index].dptId
                    console.log("^^^^^^",visitData)
                    Storage.set('VOLUME_VISIT', visitData)
                    Storage.set('DATA', visitData)
                    this.$router.push("/reserve?type=D_MSRVISIT&from=myReserve");
                }
            }
        },
        created() {
            this.getReserve()
        }
    }
</script>
<style scoped lang="scss" type="text/scss">
    @import "../../assets/scss/common/reserve";
</style>
