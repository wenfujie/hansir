/*
* createTime：2018/11/12
* author：en.chen
* description:  量体师账户信息
*/
<template>
    <div class="master-center bg-gray" :class="{ 'flex-vbox' : emptyStatus === true }">

        <!-- 量体师信息及页签固定 -->
        <div class="top-box">

            <!--量体师账户头部 begin-->
            <div class="center-header">
                <div class="avatar"><img src="" onerror="errImg(event)"></div>
                <p class="phoneNum">{{masterInfo.mobile}}</p>
                <div class="shop-address">
                    <p>当前店铺位置</p>
                    <p>{{masterInfo.address + masterInfo.dptName}}<span class="change-address-btn" @click="changeAddr">更新</span></p>
                </div>
            </div>
            <!--量体师账户头部 end-->

            <!--量体列表页签 begin-->
            <div class="list-status flex-between bg-white">
                <div class="status-btn" :class="{ 'act' : listStatus === 'MEASURE_UNFINISH' }" @click="changeStatus('MEASURE_UNFINISH')" >待量体{{waitData.count > 0 ? waitData.count : null}}</div>
                <div class="status-btn" :class="{ 'act' : listStatus === 'MEASURE_FINISHED' }" @click="changeStatus('MEASURE_FINISHED')" >已完成{{finishedData.count > 0 ? finishedData.count : null}}</div>
            </div>
            <!--量体列表页签 end-->

        </div>
        <!-- 量体师信息及页签固定 -->

        <!-- 量体数据列表 begin -->
            <div class="volume-list" v-if="emptyStatus === false && pageData.length>0">
                <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
                    <ul>
                        <li class="list-item bg-white" v-for="(item,index) in pageData" :key="">
                            <div class="item-header flex-between">
                                <p class="item-time">预约时间：{{item.orderTime}}</p>
                                <p class="item-status">{{item.statusName}}</p>
                            </div>
                            <div class="item-content">
                                <p>联系人：{{item.cargousrName}}</p>
                                <p>联系方式：<a class="phone-tip">{{item.cargoMobile}}</a></p>
                                <p>量体方式：{{item.msrWayName}}</p>
                                <p>量体地址：{{item.stateName}}{{item.cityName}}{{item.destName}}{{item.address}}</p>
                            </div>
                            <div class="item-btn" v-if="listStatus === 'MEASURE_UNFINISH'" @click="editData(item)">
                                <i class="iconfont icon-bianji"></i>填写量体数据
                            </div>
                            <div class="item-btn" v-if="listStatus === 'MEASURE_FINISHED'" @click="getOrderData(item)">
                                量体数据<i class="iconfont icon-down" :class="{ 'act': item.showData === true }"></i>
                            </div>
                            <div class="measure-data" v-if="listStatus === 'MEASURE_FINISHED' && item.showData === true">
                                <ul class="measure-data-list van-clearfix">
                                    <li class="measure-data-item fl" v-for="data in item.measureData" :key="">
                                        <span>{{data.gctMeasureHdName}}</span>
                                        <span>{{data.measureValue}}</span>
                                    </li>
                                    <p class="empty-data" v-if="!item.measureData">暂无数据</p>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </van-list>
            </div>
        <!-- 量体数据列表 end -->

        <!--量体数据为空状态下的缺省提示 begin-->
        <div class="empty-content bg-gray" v-if="emptyStatus === true"></div>
        <!--量体数据为空状态下的缺省提示 end-->

    </div>
</template>
<script>
    import { List, Toast } from 'vant';
    import { MeasureMaster } from '../../api/service';
    import Storage from "../../util/storage";
    import wx from "weixin-js-sdk";
    export default {
        components: {
            'van-list': List
        },
        data() {
            return {
                masterInfo: {},
                listStatus: 'MEASURE_UNFINISH',  //  MEASURE_UNFINISH表示待量体，MEASURE_FINISHED表示已完成
                pageData: [],  //  不同量体状态下的数据
                waitData: {     //  待量体数据列表
                    list: [],
                    pageNo: 1,
                    count: null,
                    finished: false,
                    isEmpty: null
                },
                finishedData: {    //  已完成数据列表
                    list: [],
                    pageNo: 1,
                    count: null,
                    finished: false,
                    isEmpty: null
                },
                emptyStatus: null,  // 量体列表数据是否为空
                loading: false,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                pageNo: 1,
                pageSize: 10
            }
        },
        methods: {

            //  获取量体师信息
            getMasterInfo() {
                let data = {}
                MeasureMaster.getInfo(data).then((res) => {
                    this.masterInfo = res
                })
            },

            //  初始化加载页面
            getPage () {
                //  加载待量体列表首页数据
                let waitData = {
                    statusCodes: 'MEASURE_UNFINISH',
                    personUsrId: Storage.get('MEASURE_USER').usrId,
                    pageNum: 1,
                    pageSize: 10
                }
                MeasureMaster.getVolumeList(waitData).then((res) =>{
                    //  数据合并
                    this.waitData.list = res.list
                    this.pageData = res.list
                    this.waitData.count = res.total
                    //  判断是否可以加载更多
                    if(this.waitData.list.length >= res.total || this.waitData.pageNo >= res.pages) {
                        this.waitData.finished = true
                        this.finished = true
                    }
                    //  判断待量体状态内容是否为空
                    if(this.waitData.list.length <= 0) {
                        this.emptyStatus = true
                        this.waitData.isEmpty = true
                    }else{
                        this.emptyStatus = false
                        this.waitData.isEmpty = false
                    }
                    this.loading = false
                })
                //  加载已完成列表首页数据
                let finishedData = {
                    statusCodes: 'MEASURE_FINISHED',
                    personUsrId: Storage.get('MEASURE_USER').usrId,
                    pageNum: 1,
                    pageSize: 10
                }
                MeasureMaster.getVolumeList(finishedData).then((res) =>{
                    //  已完成列表的会员量体数据默认不加载、不显示
                    res.list.forEach((item) => {
                        item.hasData = false
                        item.showData = false
                    })
                    //  数据合并
                    this.finishedData.list = res.list
                    this.finishedData.count = res.total
                    //  判断是否可以加载更多
                    if(this.finishedData.list.length >= res.total || this.finishedData.pageNo >= res.pages) {
                        this.finishedData.finished = true
                    }
                    //  判断已完成状态内容是否为空
                    if(this.finishedData.list.length <= 0) {
                        this.finishedData.isEmpty = true
                    }else{
                        this.finishedData.isEmpty = false
                    }
                    this.loading = false
                })
            },

            //  切换量体状态
            changeStatus (status) {
                if(status === this.listStatus) {
                    return
                }else{
                    if(status === 'MEASURE_UNFINISH') {    //  切换至待量体状态
                        this.pageData = this.waitData.list
                        this.emptyStatus = this.waitData.isEmpty
                        this.finished = this.waitData.finished
                        this.pageNo = this.waitData.pageNo
                    }else if(status === 'MEASURE_FINISHED'){    //  切换至已完成状态
                        this.pageData = this.finishedData.list
                        this.emptyStatus = this.finishedData.isEmpty
                        this.finished = this.finishedData.finished
                        this.pageNo = this.finishedData.pageNo
                    }
                    this.listStatus = status
                }
            },

            //  加载更多
            loadMore () {
                if(this.finished === true) {
                    Toast('没有更多了~')
                    return
                }else{
                    this.pageNo += 1
                    this.loadList()
                }
            },

            //  根据量体工单状态查询分页
            loadList () {
                if(this.finished === true) {
                    return
                }
                let data = {
                    statusCodes: this.listStatus,
                    personUsrId: Storage.get('MEASURE_USER').usrId,
                    pageNum: this.pageNo,
                    pageSize: 10
                }
                MeasureMaster.getVolumeList(data).then((res) => {
                    if (this.listStatus === 'MEASURE_UNFINISH') {    //  待量体状态
                        //  待量体数据合并
                        this.waitData.list.push.apply(this.waitData.list,res.list)
                        //  分页参数
                        this.waitData.pageNo = res.pageNum
                        //  判断是否可以加载更多
                        if(res.isLastPage === true || this.waitData.list.length >= res.total || this.waitData.pageNo >= res.pages) {
                            this.waitData.finished = true
                            this.finished = true
                        }
                    }else if(this.listStatus === 'MEASURE_FINISHED') {    // 已完成状态
                        //  已完成列表的会员量体数据默认不加载、不显示
                        res.list.forEach((item) => {
                            item.hasData = false
                            item.showData = false
                        })
                        //  已完成数据合并
                        this.finishedData.list.push.apply(this.finishedData.list,res.list)
                        //  分页参数
                        this.finishedData.pageNo = res.pageNum
                        //  判断是否可以加载更多
                        if(res.isLastPage === true || this.finishedData.list.length >= res.total || this.finishedData.pageNo >= res.pages) {
                            this.finishedData.finished = true
                            this.finished = true
                        }
                    }
                    //  隐藏加载动效
                    this.loading = false
                })
            },

            //  根据量体工单号查询量体数据
            getOrderData (item) {

                //  判断隐藏和显示
                if(item.showData === true) {
                    item.showData = !item.showData
                    return
                }

                //  判断是否存在数据
                if(item.hasData === false) {
                    let data = {
                        ctmUsrId: item.usrId,
                        msrModeTypeCode: 'D_ACTUALMSR',
                        dressedUsrName: item.cargousrName,
                        billCode: item.ctmMeasureHdCode
                    }
                    MeasureMaster.getMeasureInfo(data).then((res) => {
                        item.measureData = []
                        if(res.length && res[0].referenceList !== null && res[0].referenceList.length > 0 && res[0].referenceList[0].measureInfoList.length > 0) {
                            res[0].referenceList.forEach((bodyData) => {
                                item.measureData.push.apply(item.measureData,bodyData.measureInfoList)
                                item.hasData = true
                            })
                        }
                        this.$nextTick(() => {
                            item.showData = !item.showData
                        })
                    })
                }else if(item.hasData === true) {
                    item.showData = !item.showData
                }

            },

            //  跳转编辑量体数据的页面
            editData(item){
                this.$router.push('/measure-master/measure-data?saleCode=' + item.billCode + '&orderCode=' + item.rtlOrdHdId + '&measureCode=' + item.ctmMeasureHdCode)
            },

            //  跳转微信小程序体图
            changeAddr() {
                let measureData = {
                    destCode: this.masterInfo.destCode,
                    usrId: Storage.get('MEASURE_USER').usrId,
                    companyId: Storage.get('MEASURE_COMPANYID').company_id,
                    lat: this.masterInfo.lat,  // 纬度
                    lon: this.masterInfo.lon,  // 经度
                    latTypeCode: this.masterInfo.latTypeCode,
                    lngTypeCode: this.masterInfo.lngTypeCode
                }
                wx.miniProgram.redirectTo({
                    url: '/page/addressMap/addressMap?measureData=' + encodeURIComponent(JSON.stringify(measureData))
                })
            }

        },
        created() {
            this.getMasterInfo()
            this.getPage()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .master-center{
        min-height: 100vh;
        overflow: hidden;
        position: relative;
        .top-box{
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 3;
            .center-header{
                height: computed(320);
                background: url("../../assets/images/measure-master/header_background.png") no-repeat top center;
                background-size: 100%;
                overflow: hidden;
                .avatar{
                    width: computed(120);
                    height: computed(120);
                    border-radius: 50%;
                    margin: computed(30) auto 0 auto;
                    overflow: hidden;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .phoneNum{
                    margin: computed(20) 0 computed(12) 0;
                    font-family: 'San-Francisco-Display-Medium';
                    font-size: computed(36);
                    line-height: computed(38);
                    color: #ffffff;
                    text-align: center;
                }
                .shop-address{
                    margin-bottom: computed(24);
                    font-family: 'PingFang-SC-Medium';
                    font-size: computed(26);
                    line-height: computed(40);
                    color: #999999;
                    p{
                        text-align: center;
                        .change-address-btn{
                            margin-left: computed(20);
                            padding: 0 computed(16);
                            font-size: computed(28);
                            line-height: computed(40);
                            background: #ffffff;
                            color: #0D0E09;
                            -webkit-border-radius: computed(4);
                            -moz-border-radius: computed(4);
                            border-radius: computed(4);
                        }
                    }
                }
            }
            .list-status{
                .status-btn{
                    box-sizing: border-box;
                    flex: 1;
                    height: computed(80);
                    font-size: computed(30);
                    line-height: computed(80);
                    text-align: center;
                    border-bottom: solid computed(4) #ffffff;
                    &.act{
                        transition: ease-in .3s;
                        color: #C41717;
                        border-color: #C41717;
                    }
                }
            }
        }
        .volume-list{
            margin-top: computed(420);
            .list-item{
                margin-top: computed(20);
                padding: 0 computed(30);
                .item-header{
                    border-bottom: solid 1px #DBDBDB;
                    line-height: computed(100);
                    .item-time{
                        flex: 1;
                        font-size: computed(30);
                        color: #0D0E09;
                        font-weight: bold;
                    }
                    .item-status{
                        font-size: computed(26);
                        color: #C30D22;
                    }
                }
                .item-content{
                    padding-bottom: computed(30);
                    border-bottom: solid 1px #DBDBDB;
                    p{
                        margin-top: computed(25);
                        font-size: computed(28);
                        line-height: computed(30);
                        color: #0D0E09;
                        .phone-tip{
                            margin-top: computed(25);
                            font-size: computed(28);
                            line-height: computed(30);
                            color: #0D0E09;
                            text-decoration: underline;
                        }
                    }
                }
                .item-btn{
                    font-size: computed(28);
                    line-height: computed(88);
                    text-align: center;
                    color: #0D0E09;
                    .icon-bianji{
                        margin-right: computed(10);
                        font-size: computed(28);
                        line-height: computed(88);
                    }
                    .icon-down{
                        margin-left: computed(10);
                        font-size: computed(28);
                        line-height: computed(88);
                        transition: all .3s;
                        &.act{
                            display: inline-block;
                            vertical-align: bottom;
                            transform: rotate(-180deg);
                        }
                    }
                }
                .measure-data{
                    .measure-data-list{
                        .measure-data-item{
                            box-sizing: border-box;
                            display: flex;
                            justify-content: space-around;
                            width: 33.333%;
                            height: computed(86);
                            border-bottom: solid 1px #DBDBDB;
                            font-size: computed(28);
                            line-height: computed(86);
                            color: #666666;
                            text-align: center;
                            overflow: hidden;
                        }
                        .empty-data{
                            font-size: computed(28);
                            line-height: computed(86);
                            color: #666666;
                            text-align: center;
                        }
                    }
                }
            }
        }
        .empty-content{
            margin-top: computed(400);
            height: auto;
            flex: 1;
        }
    }
</style>