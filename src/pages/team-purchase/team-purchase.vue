/*
* createTime：2018/11/20
* author：en.chen
* description:
*/
<template>
    <div class="team-purchase">

        <!--页面元素 begin-->
        <div class="team-purchase-content mgT20" v-for="item in pageData" :key="" v-if="item.fileType === '1'">
            <img :src="getImg(item.coverFileUrl)" onerror="errImg(event)">
            <!--<p class="team-purchase-text" v-if="item.cmsBackpageDttName !== null">{{item.cmsBackpageDttName}}</p>-->
        </div>
        <!--页面元素 end-->

        <!--弹窗按钮 begin-->
        <div class="bottom-btn" v-if="showForm === false" @click="showForm = !showForm">企业团购</div>
        <!--弹窗按钮 end-->

        <!--弹窗表格 begin-->
        <van-popup lock-scroll="true" class="team-purchase-popup" v-model="showForm" position="bottom" :overlay="false">
            <div class="form-content">
                <i class="iconfont icon-guanbi" @click="showForm = false"></i>
                <p class="title fs36 black">填写表格</p>
                <div class="form-item">
                    <label class="form-item-label">联系人</label>
                    <div class="form-item-content">
                        <van-field v-model="purchaseInfo.contactName" placeholder="输入姓名，洽谈团购业务" v-inputfix clearable />
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-item-label">联系电话</label>
                    <div class="form-item-content">
                        <van-field v-model="purchaseInfo.contactNumber" type="number" placeholder="请输入手机号，24小时内一对一服务" v-inputfix clearable />
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-item-label">选择地区</label>
                    <div class="form-item-content" @click="showAreaList = true">
                        <van-field v-model="purchaseInfo.addrName" placeholder="请选择地区" v-inputfix unselectable="on" readonly />
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-item-label">团购类目</label>
                    <div class="form-item-content">
                        <van-field v-model="purchaseInfo.grpcustomProject" placeholder="意向品类及采购预算" v-inputfix clearable />
                    </div>
                </div>
                <div class="bottom-btn" v-if="showForm === true" @click="postPurchase">立即提交</div>
            </div>
        </van-popup>
        <!--弹窗表格 end-->

        <!-- 省市区选择 -->
        <van-popup class="area-box-popup" lock-scroll="true" v-model="showAreaList" position="bottom" style="z-index: 9999999">
            <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false" unselectable="on" v-inputfix />
        </van-popup>

    </div>
</template>
<script>
    import { Popup, Area, Toast, Picker } from "vant";
    import { Cms, Base, TeamPurchase } from "../../api/service";
    import { cityData } from '../../assets/js/cityData'
    export default {
        components: {
            "van-popup": Popup,
            "van-area": Area,
            "van-picker": Picker
        },
        data() {
            return {
                pageData: [],  // 页面数据
                showForm: false,  // 控制表单弹窗显示变量
                purchaseInfo: {
                    contactName : '',
                    contactNumber : '',
                    addrName: '',
                    destCode: '',
                    grpcustomProject: ''
                },
                areaList: cityData,  //  省市区列表
                showAreaList: false, //  控制省市区弹窗显示变量
                btnLock: false  //  按钮锁
            }
        },
        methods: {
            //  获取页面
            getPage() {
                let data = {
                    cmsTemplateCode: Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    cmsWebCode: pageCode.teamPurchase.name,
                    busContsCode: baseConstant.busContsCode
                };
                Cms.getUsrCmsInfoV2(data).then((res) => {
                    res.cmsModulepageHdList.forEach((item) => {
                        if(!!item.cmsBackpageDtDtoList){
                            item.cmsBackpageDtDtoList.forEach((page) => {
                                if (page.cmsBackpageDtCode === "qiyetuangou") {
                                    this.pageData = page.cmsBackpageDttList;
                                }
                            });
                        }
                    });
                });
            },

            //  选择省市区
            areaChange(value) {
                this.purchaseInfo.addrName = value[0].name + " " + value[1].name + " " + value[2].name;
                this.purchaseInfo.destCode = value[2].code
                scrollTo(0, pageYOffset)
                this.showAreaList = false
            },

            //  提交表单
            postPurchase() {
                if(this.btnLock) return
                this.btnLock = true
                if(!this.purchaseInfo.contactName) {
                    Toast('请输入姓名~')
                    this.btnLock = false
                    return
                }
                if(!isPhone(this.purchaseInfo.contactNumber)) {
                    Toast('请输入正确的手机号~')
                    this.btnLock = false
                    return
                }
                if(!this.purchaseInfo.destCode) {
                    Toast('请先选择省市区~')
                    this.btnLock = false
                    return
                }
                if(!this.purchaseInfo.grpcustomProject) {
                    Toast('请填写采购信息~')
                    this.btnLock = false
                    return
                }
                TeamPurchase.getPointDetail(this.purchaseInfo).then((res) => {
                    if(res) {
                        Toast('提交成功~')
                    }
                    this.showForm = false
                    this.purchaseInfo = {
                        contactName : '',
                        contactNumber : '',
                        addrName: '',
                        destCode: '',
                        grpcustomProject: ''
                    }
                    this.btnLock = false
                },() =>{
                   Toast('提交失败~')
                    this.btnLock = false
                })
            },

        },
        created() {
            this.getPage()
//            this.getCityData()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .team-purchase{
        box-sizing: border-box;
        min-height: 100%;
        position: relative;
        .team-purchase-content{
            position: relative;
            img{
                display: block;
                width: 100%;
            }
            .team-purchase-text{
                position: absolute;
                width: 100%;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                text-align: center;
                font-size: computed(28);
                line-height: computed(30);
                color: #ffffff;
            }
        }
        .form-content{
            position: relative;
            overflow: hidden;
            padding-bottom: computed(98);
            background: #ffffff;
            z-index: 3;
            .icon-guanbi{
                position: absolute;
                top: computed(30);
                right: computed(30);
                font-size: computed(30);
                line-height: computed(30);
                color: #333333;
            }
            .title{
                margin-top: computed(30);
                line-height: computed(38);
                text-align: center;
            }
            .form-item{
                display: flex;
                margin: computed(30);
                height: computed(88);
                font-size: computed(30);
                line-height: computed(88);
                .form-item-label{
                    flex: 1;
                }
                .form-item-content{
                    width: computed(540);
                    height: 100%;
                    .van-cell{
                        padding-left: computed(10);
                    }
                    input{
                        box-sizing: border-box;
                        display: block;
                        width: 100%;
                        height: 100%;
                        padding-left: computed(10);
                        border: none;
                    }
                }
            }
        }
        .team-purchase-popup{
            position: absolute;
            bottom: 0;
        }
        .area-box-popup{
            /*position: absolute;*/
            bottom: 0;
        }
    }
</style>