<template>
    <div class="design">
        <div class="toast">{{toast}}</div>
        <div class="container" v-if="show">
            <van-tabs v-model="active">
                <!-- 上门量体tab begin -->
                <van-tab title="上门量体">
                    <div class="company-content">
                        <ul class="form">
                            <li class="form-row">
                                <label class="row-label" for="">联系人</label>
                                <input type="text" v-model="visit.name" placeholder="请输入您的名字">
                            </li>
                            <li class="form-row">
                                <label class="row-label" for="">联系方式</label>
                                <input type="text" v-model="visit.tel" placeholder="请输入联系方式">
                            </li>
                            <li class="form-row">
                                <div class="row-div" >预约时间</div>
                                <div class="input-dialog" @click="showDataList = true">
                                    <span v-if="visit.date == '' || visit.date == null">
                                        请选择量体日期
                                    </span>
                                    <span v-else>
                                        {{visit.date}}
                                    </span>
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">所在地区</div>
                                <div class="input-dialog" @click="showAreaList = true">
                                    <span v-if="visit.address == '' || visit.address == null">
                                        请选择城市地区
                                    </span>
                                    <span v-else>
                                        {{visit.address}}
                                    </span>
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            
                            <li class="form-row">
                                <div class="row-div" for="">具体地址</div>
                                <textarea v-model="visit.addressDetail" placeholder="请输入具体地址" id="" cols="30" rows="10"></textarea>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">备注</div>
                                <textarea v-model="visit.addMsg" id="" cols="30" rows="10"></textarea>
                            </li>
                        </ul>
                    </div>
                </van-tab>
                <!-- 上门量体tab end -->

                <!-- 到店量体tab begin -->
                <van-tab title="到店量体">
                    <div class="company-content">
                        <ul class="form">
                            <li class="form-row">
                                <label class="row-label" for="">联系人</label>
                                <input type="text" v-model="store.name" placeholder="请输入您的名字">
                            </li>
                            <li class="form-row">
                                <label class="row-label" for="">联系方式</label>
                                <input type="text" v-model="store.tel" placeholder="请输入联系方式">
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">预约时间</div>
                                <div class="input-dialog" @click="showDataList = true">
                                    <span v-if="store.date == '' || store.date == null">
                                        请选择量体日期
                                    </span>
                                    <span v-else>
                                        {{store.date}}
                                    </span>
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="" >所在地区</div>
                                <div class="input-dialog" @click="showAreaList = true">
                                    <span v-if="store.address == '' || store.address == null">
                                        请选择城市地区
                                    </span>
                                    <span v-else>
                                        {{store.address}}
                                    </span>
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">选择门店</div>
                                <div class="input-dialog" @click="jumpMap()">请选择量体门店
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <!-- <li class="form-row">
                                <div class="row-div" for="">具体地址</div>
                                <textarea placeholder="请输入具体地址" id="" cols="30" rows="10"></textarea>
                            </li> -->
                            <li class="form-row">
                                <div class="row-div" for="">备注</div>
                                <textarea id="" cols="30" rows="10"></textarea>
                            </li>
                        </ul>
                        
                    </div>
                    
                </van-tab>
                <!-- 到店量体tab end -->
            </van-tabs>
        </div>
        
        <!-- 第二步表格 -->
        <div class="company-content">
            <ul class="form" v-if="!show">
                <li class="form-row">
                    <label class="row-label" for="">您的身高</label>
                    <input type="number" placeholder="请输入您的身高">
                    <div class="dangwei">cm</div>
                </li>
                <li class="form-row">
                    <label class="row-label" for="">您的体重</label>
                    <input type="number" placeholder="请输入您的体重">
                    <div class="dangwei">kg</div>
                </li>
                <li class="form-row">
                    <label class="row-label" for="">您的中腰</label>
                    <input type="number" placeholder="请输入您的中腰">
                    <div class="dangwei">cm</div>
                </li>
                <li class="form-row">
                    <div class="row-div" for="">穿衣习惯</div>
                    <div class="input-radio">
                        <van-radio-group v-model="radio">
                            <van-radio name="1">紧身</van-radio>
                            <van-radio name="2">宽松</van-radio>
                        </van-radio-group>
                    </div>
                </li>
                <div class="submit" @click="postVolume">完成</div>
            </ul>
            
        </div>
        <div v-if="show" class="submit" @click="postVolume">提交预约</div>


        <!-- 省市区选择 -->
        <van-popup v-model="showAreaList" position="bottom">
            <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false"/>
        </van-popup>

        <!-- 日期选择 -->
        <van-popup v-model="showDataList" position="bottom">
            <van-datetime-picker v-model="currentDate" type="datetime" @confirm="dataChange"
                                 @cancel="showDataList = false" :min-date="minDate" :max-date="maxDate"/>
        </van-popup>
    </div>
</template>
<script>
    // import _ from 'lodash'
    import {citydata} from "../../assets/js/cityData";
    import {RadioGroup,Radio,Popup,Toast, Icon, Field, Loading, Dialog,Tab,Tabs,Area,DatetimePicker,Picker} from 'vant';
    import Storage from './../../util/storage';
    import {Volume, Cms, Payment} from "../../api/service";
    // import ISCC from '../../assets/js/custom_method'
    // import axios from 'axios'

    export default {
        name: 'web-design',
        components: {
            "van-popup": Popup,
            "van-area": Area,
            "van-datetime-picker": DatetimePicker,
            "van-picker": Picker,
            "van-tab": Tab,
            "van-tabs": Tabs,
            "van-radio-group":RadioGroup,
            "van-radio": Radio
        },
        data() {
            return {
                toast:'第一步：提交预约信息',
                maxDate: new Date(parseInt(new Date().getFullYear()), (parseInt(new Date().getMonth()) + 3), 1),
                minDate: new Date(),
                //当前日期设置
                currentDate: new Date(),
                //日期上拉框
                showDataList: false,
                volumeDialogFlag:true,
                // tab选中选项
                active:0,
                show: true,
                radio: '1',
                // 选中的省市区信息
                addressInfo: {},
                // 上门量体
                visit: {
                    name: "",
                    tel: "",
                    date: "",
                    address: "",
                    addressDetail: "",
                    addressInfo: {},
                    addMsg:''
                },
                // 到店量体
                store: {
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
                    dptId: ''
                },
                // 省市区数据
                showAreaList: false,
                // 选中的省市区信息
                areaList: citydata,
            }
        },
        computed: {

        },
        methods: {
            /**
             * 日期格式转换
             * @param value
             * @returns {string}
             */
            _formatDate(value) {
                const date = new Date(value);
                let y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate(),
                    h = date.getHours(),
                    i = date.getMinutes(),
                    s = date.getSeconds();

                if (m < 10) m = "0" + m;
                if (d < 10) d = "0" + d;
                if (h < 10) h = "0" + h;
                if (i < 10) i = "0" + i;
                if (s < 10) s = "0" + s;

                let t = y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
                return t;
            },
            /**
             * 选择日期
             * @param value
             */
            dataChange(value) {
                if(this.active == 0){
                    this.visit.dateVal = value;
                    this.visit.date = this._formatDate(value);

                } else {
                    this.store.dateVal = value;
                    this.store.date = this._formatDate(value);
                }
                this.showDataList = false;
            },
            /**
             * 跳转到地图
             */
            jumpMap() {
                if (!this.store.addressInfo.addressId) {
                    Toast("请先选择省市区");
                    return;
                }
                //  一期使用门店
                this.getShopAddr()
                Storage.set("VOLUME_STORE", this.store);
                this.$router.push("/addressMap?type=store");
            },
            //  获取到店量体地址列表
            getShopAddr () {
                let data = {
                    stateName: this.addressInfo.province,
                    cityName: this.addressInfo.district,
                    destName: this.addressInfo.city,
                }
                Volume.getShopAddr(data).then((res)=> {
                    this.shopColumns = []
                    let map = {}
                    res.forEach((item) => {
                        map.text = item.dptName
                        map.value = item.dptId
                        this.shopColumns.push(map)
                        map = {}
                    })
                }, (err)=> {}).then(()=>{
                    if(this.shopColumns.length > 0) {
                        this.showShopList = true
                    }else{
                        Toast('该地区内无可用门店~')
                    }
                })
            },
            /**
             * 省市区选择
             * @param value
             */
            areaChange(value) {
                this.$set(this.addressInfo, "province", value[0].name);
                this.$set(this.addressInfo, "district", value[1].name)
                this.$set(this.addressInfo, "city", value[2].name)
                if (value[2].code) {
                    this.addressInfo.addressId = value[2].code;
                } else if (value[1].code) {
                    this.addressInfo.addressId = value[1].code;
                } else {
                    this.addressInfo.addressId = value[0].code;
                }
                if (this.active == 0) {
                this.visit.address =
                        value[0].name + " " + value[1].name + " " + value[2].name;
                    this.visit.addressId = this.addressInfo.addressId;
                } else {
                    this.store.address =
                        value[0].name + " " + value[1].name + " " + value[2].name;
                    this.store.addressInfo = this.addressInfo;
                }
                this.store.addressDetail = ''
                this.showAreaList = false;
            },
            //  获取页面
            getPage() {
                let data = {
                    cmsTemplateCode: Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    cmsWebCode: pageCode.volume.name,
                    busContsCode: baseConstant.busContsCode
                };
                Cms.getUsrCmsInfoV2(data).then((res) => {
                    res.cmsModulepageHdList.forEach((item) => {
                        item.cmsBackpageDtDtoList.forEach((page) => {
                            if (page.cmsBackpageDtCode === "yylt01") {
                                this.pageData = page.cmsBackpageDttList;
                            }
                        });
                    });
                });
            },
            //  获取量体项目
            getVolumes() {
                let data = {
                    measureClassInfoCode: ""
                };
                Volume.getVolumes(data).then((res) => {
                }, (err) => {
                });
            },
            //  获取预约金
            getAmount() {
                let data = {};
                Volume.getMsrAmount(data).then(
                    (res) => {
                        this.amount = res;
                    },
                    (err) => {
                    }
                );
            },
            //  提交预约量体
            postVolume() {
                let data = {};
                let sexCode = "";
                let weChatInfo = Storage.get("WECHAT_INFO");
                console.log(weChatInfo);
                if (weChatInfo.sex === 2) {
                    sexCode = "D_FEMALE";
                } else {
                    sexCode = "D_MALE";
                }
                if (this.active === 0) {
                    if (
                        !this.visit.name ||
                        !this.visit.tel ||
                        !this.addressInfo.city ||
                        !this.visit.addressDetail ||
                        !this.visit.date
                    ) {
                        Toast("请先完善信息~");
                        this.btnLock = false;
                        return;
                    }
                    if(!isPhone(this.visit.tel)) {
                        Toast("请填写正确手机号~");
                        this.btnLock = false;
                        return;
                    }
                    data = {
                        msrWayCode: "D_MSRVISIT",
                        cargousrName: this.visit.name,
                        cargousrSex: sexCode,
                        cargoMobile: this.visit.tel,
                        stateName: this.addressInfo.province,
                        cityName: this.addressInfo.district,
                        destName: this.addressInfo.city,
                        address: this.visit.addressDetail,
                        orderTime: this.visit.date,
                        usrId: Storage.get('USER_INFO').usrId,
                        dptId: null,
                        shopId: Storage.get('USER_INFO').shopId
                    };
                } else{
                    if (
                        !this.store.name ||
                        !this.store.tel ||
                        !this.addressInfo.city ||
                        !this.store.addressDetail ||
                        !this.store.date
                    ) {
                        Toast("请先完善信息~");
                        this.btnLock = false;
                        return;
                    }
                    if(!isPhone(this.store.tel)) {
                        Toast("请填写正确手机号~");
                        this.btnLock = false;
                        return;
                    }
                    data = {
                        msrWayCode: "D_MSRSHOP",
                        cargousrName: this.store.name,
                        cargousrSex: sexCode,
                        cargoMobile: this.store.tel,
                        stateName: this.addressInfo.province,
                        cityName: this.addressInfo.district,
                        destName: this.addressInfo.city,
                        address: this.store.addressDetail,
                        orderTime: this.store.date,
                        usrId: Storage.get('USER_INFO').usrId,
                        dptId: this.store.dptId,
                        shopId: Storage.get('USER_INFO').shopId
                    };
                }
                Volume.saveVolume(data).then(
                    (res) => {
                        if (this.amount > 0) {
                            let orderData = {
                                usrId: Storage.get("USER_INFO").usrId,
                                paymentCode: "D_WEIXIN",
                                tradeTypeCode: "JSAPI",
                                paymentTypeCode: "D_FULL",
                                domainName: baseConstant.domain,
                                shopCode: Storage.get("USER_INFO").shopCode,
                                orderList: res.cardBillCode,
                                orderType: 'D_MSRORD',
                                openId: Storage.get("WECHAT_INFO").openid,
                                payAmount: this.amount
                            };
                            Payment.payOrder(orderData)
                                .then((config) => {
                                    if (typeof WeixinJSBridge == "undefined") {
                                        if (document.addEventListener) {
                                            document.addEventListener(
                                                "WeixinJSBridgeReady",
                                                onBridgeReady,
                                                false
                                            );
                                        } else if (document.attachEvent) {
                                            document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                                            document.attachEvent(
                                                "onWeixinJSBridgeReady",
                                                onBridgeReady
                                            );
                                        }
                                    } else {
                                        if (config.code === "200") {
                                            WeixinJSBridge.invoke(
                                                "getBrandWCPayRequest",
                                                {
                                                    appId: "wx45b40e5b82bd74d2", //公众号名称，由商户传入
                                                    timeStamp: config.timeStamp, //时间戳，自1970年以来的秒数
                                                    nonceStr: config.nonceStr, //随机串
                                                    package: config.prepayId,
                                                    signType: "MD5", //微信签名方式：
                                                    paySign: config.paySign //微信签名
                                                },
                                                function (resp) {
                                                    if (resp.err_msg == "get_brand_wcpay_request:ok") {
                                                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                                        that.btnLock = false;
                                                        Toast("订单提交成功~");
                                                    } else if (
                                                        resp.err_msg == "get_brand_wcpay_request:cancel"
                                                    ) {
                                                        // false
                                                        // alert('取消');
                                                        that.btnLock = false;
                                                    } else {
                                                        that.btnLock = false;
                                                        alert("支付出错了");
                                                    }
                                                }
                                            );
                                        }
                                    }
                                })
                                .then(() => {
                                    that.btnLock = false;
                                });
                        } else {
                            Toast("提交预约量体成功~");
                        }
                    },
                    () => {
                        Toast("提交出错了~");
                        this.btnLock = false;
                    }
                );
                this.show = false;
                this.toast = '第二步：填写身型信息'
                
            },
        },
        created() {
            this.getPage();
            this.getAmount();
            this.getVolumes();
            // Dialog.confirm({
            //     message: '汉狮要求使用你的地理位置，是否允许？',
            //     confirmButtonText: '是',
            //     cancelButtonText: '否'
            // }).then(() => {
            // }).catch(() => {
            // });
        }
    }
</script>
<style scoped lang="scss" type="text/scss">
    // @import "../../assets/scss/goods/web-design";
    @import "../../assets/scss/common/myReserve";
</style>
