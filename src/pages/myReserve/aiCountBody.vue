<template>
    <div class="design v-design container">
        
        <div class="listdata">
            <div class="list_top">
                <div class="top_left">
                    <img src="../../assets/images/vouchers/red-user.png"/>
                    &nbsp;选择定制人
                </div>
                <div class="top_right" @click="newData">
                    + &nbsp;新增定制人
                </div>
            </div>
            <div class="list-content">
                <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
                    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                        <div class="content-box">
                            <div v-for="(item,index) in list" :key="index"  class="pain-row">
                                <div class="row-user">
                                    <div class="user-name">{{item.usrName}}</div>
                                    &nbsp;&nbsp;
                                    <div v-if="item.isDefaultFlag == 0" class="use-default" @click="setDefault(index)">设为默认</div>
                                    <div v-if="item.isDefaultFlag == 1" class="default">默认</div>
                                    <span class="delete" @click="updateData(index)">
                                        <!-- <i class="iconfont icon-shanchu"></i> -->
                                        编辑
                                    </span>
                                </div>
                                <ul >
                                    <li class="table-row"><div  v-for="(item,index) in sortList(item.figureDtos)"  :key="index" class="row-cell"><div v-if="item.isMutil" class="row-all">{{item.featureName}}:{{item.valueNames || item.values || '--'}}</div><div v-else class="row-half">{{item.featureName}}:{{item.valueNames || item.values || '--'}}</div>  
                                        </div>
                                    </li>
                                </ul>
                                <!-- <table>
                                    <tr v-for="(child,index) in sortList(item.figureDtos)" :key="index" v-if="">
                                        <td></td>
                                    </tr>
                                </table> -->
                                <div class="footer-content">
                                    <div class="footer-left" v-if="item.isDefaultFlag == 0" @click="dataDelete(index)">
                                        <i class="iconfont icon-shanchu"></i>
                                        删除
                                    </div>
                                    <div class="footer-right" @click="toggleSelected(index,item.id)">
                                        <i class="van-checkbox__icon iconfont" :class="[infoSid == item.id ? 'icon-xuanzhong' : 'icon-weixuanzhong']"></i>
                                        使用该尺寸
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-pull-refresh>
               </van-list>
            </div>
        </div>
        <!-- <empty emptyText="暂无数据~" v-show="showEmpty"></empty> -->
            
            <div class="ai_bottom" @click="dataConfirm()">
                {{confirm}}
            </div>
    </div>
</template>
<script>
    import row from './components/row'
    import { UserService } from "../../api/service";
    import {Volume, Cms, Payment,MeasureMaster} from "../../api/service";
     import {List,Toast, Icon, Field, Loading, Dialog , PullRefresh} from 'vant'
    import Storage from './../../util/storage'
    import Empty from '../../components/EmptyContent.vue'
    export default {
        name: 'web-design',
        components: {
            "van-list": List,
            'van-pull-refresh': PullRefresh,
            'empty': Empty,
            row
        },
        data() {
            return {
                pageNum: 1,
                loading: false,
                finished: true,
                isLoading: false,
                showEmpty: false,
                confirm:"下一步",
                list:[],//
                countDodyData:null,
                infoActive:0,
                infoSid:null
            }
        },
        computed: {
        },
        methods: {
            //  下拉刷新
            onRefresh() {
                this.pageNum = 1
                this.list = []
                this.getAiMeasure()
            },
            //  加载更多商品
            loadMore () {
                // console.log("加载更多商品")
                setTimeout(() => {
                    if (this.finished === true) {
                        Toast("没有更多了~");
                        return;
                    } else {
                        this.pageNum += 1;
                        this.getLoadAiMeasure();
                    }
                }, 100);
            },
            sortList(list){
                let column = [], towColunm = []
                if(!!list){
                    for(let i = 0; i < list.length; i++){
                        if(list[i].featureName.length + (list[i].valueNames || list[i].values || '--').length + 1 > 10){
                            list[i].isMutil = true
                            towColunm.push(list[i])
                        }else{
                            list[i].isMutil = false
                            column.push(list[i])
                        }
                    }
                }
                if(column.length > 0 && column.length%2!=0) column[column.length-1].isMutil = true 
                return column.concat(towColunm)
            },
            GetRequest(_url) {
                var url = _url; //获取url中"?"符后的字串
                var index =url.lastIndexOf("\?");
                url=url.substring(index,url.length);
                // console.log("youyouyou",url)
                var theRequest = new Object();  
                if (url.indexOf("?") != -1) {  
                    var str = url.substr(1);  
                    var strs = str.split("&");  
                    for(var i = 0; i < strs.length; i ++) {
                        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
                    }  
                } 
                return theRequest;  
            } ,
            setReserveStorage() {
                var sunData ={
                    measureOpCode:null,
                    partIds:null,
                    routeName:null,
                    yuyue:null,
                    v_data:null
                }
                if (!!Storage.get('reserveStorage') ){

                    sunData.yuyue = Storage.get('reserveStorage').yuyue
                    sunData.measureOpCode = Storage.get('reserveStorage').measureOpCode
                    sunData.partIds = Storage.get('reserveStorage').partIds
                    sunData.routeName = Storage.get('reserveStorage').routeName
                    sunData.v_data = Storage.get('reserveStorage').v_data
                }
                if(this.$route.query.successUrl != null && this.$route.query.successUrl != undefined){
                    var s_name = decodeURIComponent(this.$route.query.successUrl)
                    sunData.v_data = this.GetRequest(s_name)
                    // console.log("有sunData.v_data",sunData.v_data)
                    // console.log("s_name",s_name)
                    if(this.$route.query.successUrl == 'toEmb'){
                        sunData.routeName = 'goodsEmbroider'
                        sunData.partIds =this.$route.query.goodCodes
                        //  加个面料ID
                    }else{
                    if(s_name.indexOf('/goods-embroider') != -1){
                        sunData.routeName = 'goodsEmbroider'
                    }
                    if(s_name.indexOf('/order-settlement') != -1){
                        sunData.routeName = 'orderSettlement'
                    }
                    this.successUrl = decodeURIComponent(this.$route.query.successUrl)
                    }
                }
                Storage.set("reserveStorage", sunData);
            },
            newData() {
                this.$store.commit('aiMeasureBody/resetData')
                this.$router.push({
                    name: "aiAmountBody",
                    params:{
                        // fromPage:"aiCountBody",
                        actionPage:"newAdd"
                    }
                });
            },
            setDefault(index) {
                var data ={
                    id:this.list[index].id,
                    ownCompanyId:Storage.get("COMPANYID").company_id,
                    usrId: Storage.get('USER_INFO').usrId,
                    companyId: Storage.get('COMPANYID').company_id
                }
                Volume.setDefaultUser(data).then(
                    (res) => {
                        // console.log(res);
                        if(res == 1 ){
                        Toast("设为默认成功");
                        this.pageNum = 1
                        this.getAiMeasure();
                        }else{
                        Toast("设为默认失败"); 
                        }
                    },
                    () => {
                        Toast("提交出错了~");
                    }
                );
            },
            updateData(index) {
                var data ={
                    userName:this.list[index].usrName,
                    aiId:this.list[index].id,
                    fromPage:"aiCountBody",
                    data:[]
                }
                if(!!this.list[index].figureDtos){
                    // console.log(this.list[index].figureDtos)
                    for(var i= 0;i<this.list[index].figureDtos.length;i++){
                        var _data ={
                            id:this.list[index].figureDtos[i].vipFeatureInfoId,
                            values:this.list[index].figureDtos[i].valueNames||this.list[index].figureDtos[i].values,
                            featureCode:this.list[index].figureDtos[i].featureCode,
                            valueIds:this.list[index].figureDtos[i].values
                        }
                        data.data.push(_data)
                    }
                // console.log(data)
                }
                this.$store.commit('aiMeasureBody/resetData')
                this.$router.push({
                    name: "aiAmountBody",
                    params: data
                });
            },
            toggleSelected(index,sid) {
                this.infoActive = index
                this.infoSid = sid
                // this.list[index].isSelected = !this.list[index].isSelected;
                // console.log( this.list[index].isSelected )
            },
            dataDelete(index){                                                                                                                                                                                                                                                  
                if(this.list[index].id !==''){
                     let data ={
                        userId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        ids: this.list[index].id,
                        ownCompanyId:Storage.get("COMPANYID").company_id,
                    }
                    Dialog.confirm({
                    title: '是否删除该定制人信息',
                    confirmButtonText:'确定删除',
                    cancelButtonText:'取消'
                    }).then(() => {
                        Volume.delAiMeasure(data).then(
                            (res) => {
                                // console.log(res);
                                if(res == 1 ){
                                Toast("删除成功");
                                this.list.splice(index, 1);
                                this.infoActive = null
                                }else{
                                Toast("删除失败"); 
                                }
                            },
                            () => {
                                Toast("提交出错了~");
                            }
                        );
                        }).catch(() => {
                    });
                 }
            },
            dataConfirm(){
                var pickData = []
                let data = {
                    partCodes:Storage.get('toReserveParams').goodCodes
                };
                this.$store.commit('aiMeasureBody/resetData')
                var actionTap =null
                if(!this.infoActive && this.infoActive!=0) {
                    Toast("请选择定制人~")
                    return
                }
                // 判断是否必填
                if(!!this.list[this.infoActive].figureDtos){
                // if(false){
                    if(this.list[this.infoActive].figureDtos.length>0){
                        for(var j= 0; j<this.list[this.infoActive].figureDtos.length;j++){
                            // console.log(j,this.list[this.infoActive].figureDtos[j].values)
                            if(this.list[this.infoActive].figureDtos[j].mustFlag == 1 && !this.list[this.infoActive].figureDtos[j].values){
                                // console.log("有没填的项",this.list[this.infoActive].figureDtos[j])
                                actionTap = false
                                var vdata ={
                                    userName:this.list[this.infoActive].usrName,
                                    aiId:this.list[this.infoActive].id,
                                    fromPage:"aiCountBody",
                                    submitType:"submitType",
                                    data:[]
                                }
                    if(!!this.list[this.infoActive].figureDtos){
                        // console.log(this.list[this.infoActive].figureDtos)
                        for(var i= 0;i<this.list[this.infoActive].figureDtos.length;i++){
                            var _data ={
                                id:this.list[this.infoActive].figureDtos[i].vipFeatureInfoId,
                                values:this.list[this.infoActive].figureDtos[i].valueNames||this.list[this.infoActive].figureDtos[i].values,
                                featureCode:this.list[this.infoActive].figureDtos[i].featureCode,
                                valueIds:this.list[this.infoActive].figureDtos[i].values
                            }
                            vdata.data.push(_data)
                        }
                    // console.log(vdata)
                    }
                    this.$router.push({
                        name: "aiAmountBody",
                        params: vdata,
                        query:{
                            fromType:"goodOrder"
                        }
                    });
                     Toast('请完成定制人数据')
                                return
                                // console.log("1111",actionTap)
                            }else{
                                actionTap = true
                                // console.log("2222",actionTap)
                            }
                        }
                        // console.log("3333")
                    }else{
                        actionTap = true
                    }
                }else{
                    actionTap = true
                }
                // console.log("有routeName",actionTap)
                if(actionTap){

                    var liangtiData = this.list[this.infoActive]
                    // console.log("有liangtiData",liangtiData)
                    if(!!liangtiData.figureDtos){
                        for(var k =0;k < liangtiData.figureDtos.length;k++){
                            if(!liangtiData.figureDtos[k].values){
                                this.$set(liangtiData.figureDtos[k], "values", null)
                            }
                        }
                    }
                    // console.log(liangtiData)
                    this.$router.push({
                        name:Storage.get('reserveStorage').routeName,
                            params: {
                                measureOpCode:Storage.get('reserveStorage').measureOpCode,
                                liangti:liangtiData,
                                yuyue:Storage.get('reserveStorage').yuyue
                            },
                            query:Storage.get('reserveStorage').v_data
                    })
                }else{
                    var vdata ={
                        userName:this.list[this.infoActive].usrName,
                        aiId:this.list[this.infoActive].id,
                        fromPage:"aiCountBody",
                        submitType:"submitType",
                        data:[]
                    }
                    if(!!this.list[this.infoActive].figureDtos){
                        // console.log(this.list[this.infoActive].figureDtos)
                        for(var i= 0;i<this.list[this.infoActive].figureDtos.length;i++){
                            var _data ={
                                id:this.list[this.infoActive].figureDtos[i].vipFeatureInfoId,
                                values:this.list[this.infoActive].figureDtos[i].valueNames||this.list[this.infoActive].figureDtos[i].values,
                                featureCode:this.list[this.infoActive].figureDtos[i].featureCode,
                                valueIds:this.list[this.infoActive].figureDtos[i].values
                            }
                            vdata.data.push(_data)
                        }
                    // console.log(vdata)
                    }
                    this.$router.push({
                        name: "aiAmountBody",
                        params: vdata,
                        query:{
                            fromType:"goodOrder"
                        }
                    });
                     Toast('请完成定制人数据')
                }
            },
            getLoadAiMeasure(){
                var dataInfo = {
                    partCodes:Storage.get('toReserveParams').goodCodes,
                    usrId: Storage.get('USER_INFO').usrId,
                    companyId: Storage.get('COMPANYID').company_id,
                    pageNum:this.pageNum,
                    pageSize:5
                }
                Volume.getAiMeasure(dataInfo).then(
                    (res) => {
                        this.countDodyData = res.list;
                        let countDodyDataLen = this.countDodyData.length
                        for (let i = 0; i < countDodyDataLen; i++) {
                            if(this.countDodyData[i].ctmmeasureDtMsrtypeDtos !== null){
                                this.list.push(this.countDodyData[i])
                            }
                        }
                        if(res.pageNum >= res.pages){
                            // console.log(this.finished)
                            this.finished = true;
                        }else{
                            this.finished = false;
                        }
                        this.isLoading = false
                        this.loading = false;
                    },
                    () => {
                        this.finished = true;
                        Toast("接口出错~");
                    }
                );
            },
            
            getAiMeasure(flag){
                var dataInfo = {
                    partCodes:Storage.get('toReserveParams').goodCodes,
                    usrId: Storage.get('USER_INFO').usrId,
                    companyId: Storage.get('COMPANYID').company_id,
                    pageNum:1,
                    pageSize:5
                }
                let list = []
                // console.log("$$$$$$",Storage.get('toReserveParams'))
                Volume.getAiMeasure(dataInfo).then(
                    (res) => {
                        this.countDodyData = res.list;
                        let countDodyDataLen = this.countDodyData.length
                        for (let i = 0; i < countDodyDataLen; i++) {
                            if(this.countDodyData[i].ctmmeasureDtMsrtypeDtos !== null){
                                var a_list = []
                                // this.infoSid = this.countDodyData[0].id
                                this.$set(this.countDodyData[i], "dressedusrName",this.countDodyData[i].dressedusrName);
                                this.$set(this.countDodyData[i], "measureLog",this.countDodyData[i].measureLog);
                                if(!!this.$route.query.addData){
                                    if(this.$route.query.addData == this.countDodyData[i].id){
                                        this.infoActive = i
                                        this.infoSid = this.$route.query.addData
                                        // console.log("新增addid",this.infoSid)
                                    }
                                }else{
                                    this.infoSid = this.countDodyData[0].id
                                }
                                list.push(this.countDodyData[i])
                            }
                        }
                        for (var j = 0; j < list.length; j++) {
                            this.$set(list[j], "isSelected", true)
                        }
                        if(res.pageNum >= res.pages){
                            this.finished = true;
                        }else{
                            this.finished = false;
                        }
                        this.list = list
                        this.isLoading = false
                        this.loading = false;
                        if(res.list.length == 0 && !flag){
                            this.showEmpty = true
                            this.$router.replace({
                                    name:'aiAmountBody',
                                    query:{
                                        fromType:'goodOrder',
                                        successUrl:this.$route.query.successUrl
                                    }
                            })
                        }
                        
                    },
                    () => {
                        Toast("提交出错了~");
                    }
                );
            }
        },
        created() {
            this.setReserveStorage()
            this.getAiMeasure()
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
<style scoped lang="scss" type="text/scss">
     @import "../../assets/scss/common/countBodyData";
     .list-content{
         height: 100%;
     }
     .table-row .row-cell:nth-last-child(1){
         border-bottom:none;
                float: left;
                // width: 100%!important;
                line-height: computed(86);
                // height:computed(86);
                display: block;
     }
     .v-design{
        //  height: computed1(1200);
        padding-bottom: 7.04648vh;
        .van-list{
            width: 100%;
        }
        .listdata{
            width: 100%;
        }
     }
     .ai_bottom{
         width: 100vw;
        height: 7.04648vh;
        line-height: 7.04648vh;
        background: #c41717;
        position: fixed;
        bottom: 0px;
        left: 0px;
        text-align: center;
        font-size: 4vw;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: white;
     }
     .row-cell{
         display: inline-block;
        //  width: 100%;
         border-bottom:computed(1) solid rgba(219,219,219,1);
        //  border-left:computed(1) solid rgba(219,219,219,1);
         .row-half{
            //  border:computed(1) solid rgba(219,219,219,1);
             padding-left: computed(20);
            // float: left;
            width: computed(322);
            // height:computed(86);
            line-height: computed(70);
            display: block;
         }
         &:nth-child(2n+1){
             .row-half{
                border-right:computed(1) solid rgba(219,219,219,1);
             }
         }
         &:nth-child(2n+2){
             .row-half{
                 border-right:none;
             }
         }
         .row-all{
            //  border:computed(1) solid rgba(219,219,219,1);
               padding-left: computed(20);
                // float: left;
                min-width: computed(666)!important;
                line-height: computed(86);
                // height:computed(86);
                // display: block;
         }
        
        .row-name1{
                // height: computed(65);
                min-width: computed(115);
                font-size:computed(28);
                font-weight:500;
                color:rgb(119, 39, 39);
                display: inline-block;
                text-align: right;
        }
        .row-num1{
            border:1px solid rgba(219,219,219,1);
            // height: computed(65);
            min-width: computed(110);
            font-size:computed(28);
            font-weight:500;
            color:rgba(102,102,102,1);
            display: inline-block;
            text-align: left;
        }
    }
     .footer-content{
         overflow: hidden;
         height: computed(80);
        //  height: computed(150);
         line-height: computed(80);
         .footer-left{
             float: left;
             font-size:computed(24);
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(102,102,102,1);
         }
         .footer-right{
             float: right;
             font-size:computed(28);
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(102,102,102,1);
         }
     }
     .list_top{
         height: computed(90);
         line-height: computed(90);
         background-color: white;
         padding: 0 computed(30);
         overflow: hidden;
         .top_left{
            float: left;
            font-size:computed(28);
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(13,14,9,1);
             img{
                 width: computed(28);
                 height: computed(28);
             }

         }
         .top_right{
             float: right;
             font-size:computed(26);
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(196,23,23,1);

         }
     }
     .default{
         display: inline-block;
         width:computed(50);
            height:computed(30);
            line-height: computed(30);
            text-align: center;
            font-size:computed(22);
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(196,23,23,1);
            background:rgba(255,227,227,1);
     }
     .use-default{
         width:computed(120);
        height:computed(30);
        line-height: computed(30);
        background:rgba(245,245,245,1);
        float: left;
        margin: computed(30) 0 0 computed(20);
        text-align: center;
        font-size:computed(22);
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(102,102,102,1);
     }
</style>
