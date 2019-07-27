<template>
    <div class="design">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
        <div>
            <div v-for="(item,index) in list" :key="index"  class="pain-row">
                <div class="row-user">
                    <label class="user-type" v-for="(item,index) in item.ctmmeasureDtMsrtypeDtos" :key="index" >{{item.gctMeasureClassInfoName}}</label>
                    <div class="user-name">{{item.dressedusrName}}</div>
                    <span class="delete" @click="dataDelete(index)">
                        <i class="iconfont icon-shanchu"></i>
                        删除
                    </span>
                </div>
                <div class="flex-between pdTb30">
                    <span>{{item.ctmmeasureHdDate | datetime}}</span>
                    <div @click="toggleSelected(index)">
                        详细数据
                        <i
                            class="iconfont icon-down fs36B"
                            :class="{rotatingUp:item.isSelected,rotatingDown:!item.isSelected}"
                        ></i>
                    </div>
                </div>
                <ul >
                    <li class="table-row" :class="item.isSelected? 'xuanzhong':'weixuanzhong'">

                        <div  v-for="(item,index) in item.ctmmeasureDtMsrtypeDtos"  :key="index" class="row-cell">
                                <div class="s_fl"  v-for="(item,index) in item.measureInfoList" :key="index">
                                    <div class="row-name">{{item.gctMeasureHdName}}</div>
                                    <div class="row-num">{{item.cleanValue}}</div>
                                </div>
                            <!-- <div v-else>
                                <div class="s_fl"  v-for="(item,index) in item.measureInfoList" :key="index">
                                    <div class="row-name">{{item.gctMeasureHdName}}</div>
                                    <div class="row-num">{{item.measureValue}}</div>
                                </div>
                            </div> -->
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <empty emptyText="暂无数据~" v-show="showEmpty"></empty>
        </van-pull-refresh>
        <!-- <div class="bottom" @click="dataConfirm()">
            预约量体
        </div> -->
    </div>
</template>
<script>
    // import _ from 'lodash'
    import {Volume, Cms, Payment,MeasureMaster} from "../../api/service";
     import {Toast, Icon, Field, Loading, Dialog, PullRefresh} from 'vant'
     import Empty from '../../components/EmptyContent.vue'

    export default {
        name: 'web-design',
        components:{
            'van-pull-refresh': PullRefresh,
            'empty': Empty
        },
        data() {
            return {
                list:[],
                countDodyData:null,
                isLoading: false,
                showEmpty: false
            }
        },
        computed: {

        },
        methods: {
            toggleSelected(index) {
                this.list[index].isSelected = !this.list[index].isSelected;
                console.log( this.list[index].isSelected )
            },
            //  下拉刷新
            onRefresh() {
                // this.list = []
                this.getListData()
            },
            dataDelete(index){
                if(this.list[index].id !==''){
                     let data ={
                        userId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        ids: this.list[index].ctmmeasureDtMsrtypeDtos[0].id,
                        ownCompanyId:Storage.get("COMPANYID").company_id,
                    }
                    Dialog.confirm({
                    title: '确定删除该条量体记录吗？',
                    confirmButtonText:'确定',
                    cancelButtonText:'取消'
                    }).then(() => {
                        Volume.delCtmMeasure(data).then(
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
                        }).catch(() => {
                        // on cancel
                    });
                 }
                // aikun a ,zyh xihuangwo,xiabbi

                // Dialog.confirm({
                // title: '确定删除该条量体记录吗？',
                // confirmButtonText:'确定',
                // cancelButtonText:'取消'
                //     }).then(() => {
                //     }).catch(() => {
                // });
            },
            dataConfirm(){
                this.$router.push("/reserve");
            },
            getListData(){
                var dataInfo = {
                    ctmUsrId: Storage.get('USER_INFO').usrId,
                    companyId: Storage.get('COMPANYID').company_id,
                    pageNum:0,
                    pageSize:0
                }
                console.log("$$$$$$",dataInfo)
                var list = [];
                Volume.getCtmmeasure(dataInfo).then(
                    (res) => {
                        this.countDodyData = res;
                        let countDodyDataLen = this.countDodyData.length
                        for (let i = 0; i < countDodyDataLen; i++) {
                            if(this.countDodyData[i].ctmmeasureDtMsrtypeDtos !== null){
                                var a_list = []
                                this.$set(this.countDodyData[i], "dressedusrName",this.countDodyData[i].dressedusrName);
                                this.$set(this.countDodyData[i], "measureLog",this.countDodyData[i].measureLog);
                                this.$set(this.countDodyData[i], "countData",a_list);
                                list.push(this.countDodyData[i])
                            }
                        }
                        for (var j = 0; j < list.length; j++) {
                                this.$set(list[j], "isSelected", true)
                            }
                        this.list = list
                        this.isLoading = false
                        if(list.length == 0) this.showEmpty = true
                    },
                    () => {
                        Toast("提交出错了~");
                    }
                );
            }
        },
        created() {
            this.getListData()
        }
    }
</script>
<style scoped lang="scss" type="text/scss">
     @import "../../assets/scss/common/countBodyData";
</style>
