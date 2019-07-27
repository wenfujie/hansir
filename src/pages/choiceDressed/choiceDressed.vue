<template>
    <div class="design">
        <div class="toast">{{toast}}</div>
        <div class="container" v-if="show">
            <van-tabs v-model="active">
                <!-- 量体数据tab begin -->
                <van-tab title="量体数据" >
                    <div class="pain-content" v-if="countDodyData.length > 0">
                        <div class="company-content" v-for="(item,index) in countDodyData" :key="index">
                            <div class="content-title" >
                                <div class="left-div" @click="toggleSelected(index)">
                                    <i class="iconfont" :class="item.isSelected? 'icon-xuanzhong':'icon-weixuanzhong'"></i>
                                </div>
                                <div class="right-div">
                                    <div class="right-name">联系人:{{item.dressedusrName}}</div>
                                    <div class="right-time">量体时间：{{item.measureLog}} </div>
                                </div>
                            </div>
                            <ul class="content-table">
                                <li class="table-row">
                                    <div class="row-cell" v-for="(item,index) in item.Array" :key="index">
                                        <div class="row-name">{{item.gctMeasureHdName}}</div>
                                        <div class="row-num">{{item.measureValue}}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-else class="empty-content">
                        <p>暂无数据</p>
                    </div>
                </van-tab>
                <!-- 量体数据tab end -->

                <!-- 历史预约单tab begin -->
                <van-tab title="历史预约单">
                    <div class="pain-content" v-if="history.length > 0">
                        <div class="company-content"  v-for="(item,index) in history"  :key="index">
                                <div class="content-title">
                                    <div class="left-div" @click="toggleHistory(index)">
                                        <i class="iconfont" :class="item.isSelected? 'icon-xuanzhong':'icon-weixuanzhong'"></i>
                                    </div>
                                    <div class="right-div">
                                        <div class="right-name">联系人：{{item.cargousrName}}</div>
                                        <div class="right-time">量体时间：{{item.orderTime}} </div>
                                    </div>
                                </div>
                                <ul class="content-table">
                                    <li class="info-row" v-if="item.cargoMobile">
                                        <label for="">联系电话:</label>
                                        <span>{{item.cargoMobile}}</span>
                                    </li>
                                    <li class="info-row" v-if="item.msrWayName">
                                        <label for="">量体方式:</label>
                                        <span>{{item.msrWayName}}</span>
                                    </li>
                                    <li class="info-row" v-if="item.address">
                                        <label for="">量体地址：</label>
                                        <span>{{item.stateName}} {{item.cityName}}{{item.destName}}{{item.address}}</span>
                                    </li>
                                </ul>
                        </div>
                    </div>
                    <div v-else class="empty-content">
                        <p>暂无数据</p>
                    </div>
                </van-tab>
                <!-- 历史预约单tab end -->

                <!-- 预约量体tab begin -->
                <van-tab title="预约量体">
                    <div class="tab-swich">
                        <div class="item_first" @click="tabSelect">
                            <i class="iconfont" :class="tabIsSelect? 'icon-xuanzhong':'icon-weixuanzhong'"></i>
                            门店量体
                        </div>
                        <div class="item_second" @click="tabSelect">
                            <i class="iconfont" :class="!tabIsSelect? 'icon-xuanzhong':'icon-weixuanzhong'"></i>
                            上门量体
                        </div>
                    </div>
                    <div class="company-content" v-if="tabIsSelect">
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
                                <div class="input-dialog" @click="jumpMap()">
                                    
                                    <span v-if="store.addressDetail == '' || store.addressDetail == null">
                                        请选择量体门店
                                    </span>
                                    <span v-else>
                                        {{store.addressDetail}}
                                    </span>
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <!-- <li class="form-row">
                                <div class="row-div" for="">具体地址</div>
                                <textarea placeholder="请输入具体地址" cols="30" rows="10"></textarea>
                            </li> -->
                            <li class="form-row">
                                <div class="row-div" for="">备注</div>
                                <textarea v-model="store.measureMemo" cols="30" rows="10"></textarea>
                            </li>
                        </ul>
                    </div>
                    <div class="company-content" v-if="!tabIsSelect" >
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
                                <textarea v-model="visit.addressDetail" placeholder="请输入具体地址" cols="30" rows="10"></textarea>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">备注</div>
                                <textarea v-model="visit.measureMemo" cols="30" rows="10"></textarea>
                            </li>
                        </ul>
                    </div>
                </van-tab>
                <!-- 预约量体tab end -->
            </van-tabs>
        </div>
        
        <!-- 第二步表格 -->
        <div class="company-content">
            <van-data-From v-if="!show"></van-data-From>
            <!-- <ul class="form" v-if="!show">
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
            </ul> -->
        </div>
        <div v-if="show" class="dressed-sure" @click="submitChoice">确定</div>
        <!-- 省市区选择 -->
        <van-popup v-model="showAreaList" position="bottom">
            <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false"/>
        </van-popup>
        <!-- 日期选择 -->
        <van-popup v-model="showDataList" position="bottom">
            <van-datetime-picker v-model="currentDate" type="datetime" @confirm="dataChange"
                                 @cancel="showDataList = false" :min-date="minDate" :max-date="maxDate"/>
        </van-popup>

        <van-popup v-model="showDalog">
            <div class="successBox">
                <ul>
                    <li class="li-row">
                        <div class="Icon_success">
                            <img src="../../assets/images/volume/Icon_success.png" alt="">
                        </div>
                    </li>
                    <li class="li-row">
                        <div class="li-word">
                        填写成功!
                        </div>
                    </li>
                    <li class="li-row">
                        <div class="li-word1">
                        着装师将尽快与您联系
                        </div>
                    </li>
                    <li class="li-row">
                        <div class="li-action">
                        查看预约&nbsp;>
                        </div>
                    </li>
                </ul>
                <div class="closeIcon">
                    <img src="../../assets/images/volume/Pop_close.png" alt="">
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
    // import _ from 'lodash'
    import { Base } from '../../api/service';
    import {RadioGroup,Radio,Popup,Toast, Icon, Field, Loading, Dialog,Tab,Tabs,Area,DatetimePicker,Picker} from 'vant';
    import Storage from './../../util/storage';
    import {Volume, Cms, Payment} from "../../api/service";
    import BodyDataForm from '@/components/BodyDataForm.vue';
    // import ISCC from '../../assets/js/custom_method'
    // import axios from 'axios'
    export default {
        components: {
            "van-popup": Popup,
            "van-area": Area,
            "van-datetime-picker": DatetimePicker,
            "van-picker": Picker,
            "van-tab": Tab,
            "van-tabs": Tabs,
            "van-radio-group":RadioGroup,
            "van-radio": Radio,
            "van-data-From":BodyDataForm
        },
        data() {
            return {
                isAllSeleted:'',
                toast:'选择量体方式',
                maxDate: new Date(parseInt(new Date().getFullYear()), (parseInt(new Date().getMonth()) + 3), 1),
                minDate: new Date(),
                //当前日期设置
                currentDate: new Date(),
                //日期上拉框
                showDataList: false,
                volumeDialogFlag:true,
                // tab选中选项
                active:0,
                showDalog: false,
                show: true,
                radio: '1',
                // 选中的省市区信息
                addressInfo: {},
                // 上门量体
                visit: {
                    name:"",
                    tel: "",
                    date: "",
                    address: "",
                    addressDetail: "",
                    addressInfo: {},
                    addMsg:'',
                    measureMemo:''
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
                    dptId: '',
                    customMemo:'',
                    measureMemo:''
                },
                // 省市区数据
                showAreaList: false,
                // 选中的省市区信息
                areaList: {},
                // 量体数据列表
                countDodyData: [],
                // 历史数据列表
                history:[],
                // 当前选中的tab
                tabIsSelect:true,
                selectIndex:null        
            }
        },
        computed: {

        },
        methods: {
            //  获取省市区
            getCityData () {
                Base.getDestnation().then((res) => {
                    let provinceMap = {}
                    let cityMap = {}
                    let countyMap = {}
                    res.list.forEach((item) => {
                        if(item.destTypeId === res.code[0]) {
                            provinceMap[item.code] = item.name
                        }
                        if(item.destTypeId === res.code[1]) {
                            cityMap[item.code] = item.name
                        }
                        if(item.destTypeId === res.code[2]) {
                            countyMap[item.code] = item.name
                        }
                    })
                    this.areaList.province_list = provinceMap
                    this.areaList.city_list = cityMap
                    this.areaList.county_list = countyMap
                })
            },
            tabSelect() {
                this.tabIsSelect = !this.tabIsSelect
            },
            submitChoice() {
                if (this.active == 0){
                    if (this.selectIndex !==null){
                        let index = this.selectIndex
                        this.$set(this.countDodyData[index], "statusCodes", 'MEASURE_FINISHED');
                        Storage.set("settlementData", this.countDodyData[index]);
                        window.history.go(-1);
                    }
                }
                if (this.active == 1){
                    if (this.historyIndex !==null){
                        let index = this.historyIndex
                        this.$set(this.history[index], "statusCodes",'MEASURE_UNFINISH');
                        console.log(this.history[index]);
                        Storage.set("settlementData", this.history[index]);
                        window.history.go(-1);
                    }
                }
                if (this.active == 2){
                    this.postVolume();
                    // this.$set(this.store, "statusCodes", MEASURE_FINISHED);
                    // Storage.set("settlementData", this.countDodyData[index]);
                    // window.history.go(-1);
                }
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
                if (this.tabIsSelect == false) {
                    if (
                        !this.visit.name ||
                        !this.visit.tel ||
                        !this.addressInfo.city ||
                        !this.visit.addressDetail ||
                        !this.visit.date
                    ) {
                        console.log("666666",this.visit);
                        console.log("666666",this.addressInfo.city);
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
                        cityName: this.addressInfo.city,
                        destName: this.addressInfo.district,
                        address: this.visit.addressDetail,
                        orderTime: this.visit.date,
                        usrId: Storage.get('USER_INFO').usrId,
                        dptId: null,
                        shopId: Storage.get('USER_INFO').shopId,
                        companyId:239,
                        measureMemo:this.visit.measureMemo,
                    };
                    let _data = {}
                    Volume.saveVolume(data).then(
                    (res) => {
                            let details = res
                            this.$set(_data,"result", details);
                            Storage.set("settlementData", details);
                            Toast("提交了~");
                            window.history.go(-1);
                        },
                        (err) => {
                            Toast("提交出错了~");
                        }
                    );
                    
                } else{
                    if (
                        !this.store.name ||
                        !this.store.tel ||
                        !this.addressInfo.city ||
                        !this.store.addressDetail ||
                        !this.store.date
                    ) {
                        console.log("666666",this.visit);
                        console.log("666666",this.addressInfo.city);
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
                        cityName: this.addressInfo.city,
                        destName: this.addressInfo.district,
                        address: this.store.addressDetail,
                        orderTime: this.store.date,
                        usrId: Storage.get('USER_INFO').usrId,
                        dptId: this.store.dptId,
                        shopId: Storage.get('USER_INFO').shopId,
                        measureMemo:this.store.measureMemo
                    };
                    let _data = {}
                    Volume.saveVolume(data).then(
                    (res) => {
                            let details = res
                            this.$set(_data,"result", details);
                            Storage.set("settlementData", details);
                            Toast("提交了~");
                            window.history.go(-1);
                        },
                        (err) => {
                            Toast("提交出错了~");
                            
                        }
                    );
                }
            },
            /**
             * 选择按钮
             * 
             */
            toggleHistory(index) {
                this.historyIndex = index
                let data = !this.history[index].isSelected
                console.log(data);
                let historyLen = this.history.length
                for (let i = 0;i < historyLen; i++) {
                    this.history[i].isSelected = false
                }
                this.history[index].isSelected = data
            },
            /**
             * 选择按钮
             * 
             */
            toggleSelected(index) {
                this.selectIndex = index
                let data = !this.countDodyData[index].isSelected
                console.log(index);
                let countDodyDataLen = this.countDodyData.length
                for (let i = 0;i < countDodyDataLen; i++) {
                    this.countDodyData[i].isSelected = false
                }
                this.countDodyData[index].isSelected = data
            },
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
                if(this.tabIsSelect == false){
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
                this.getShopAddr()
                Storage.set("VOLUME_STORE", this.store);
                this.$router.replace("/addressMap?type=choiceDressed&from=choiceDressed");
                // this.$router.push("/addressMap?type=store");
            },
            //  获取到店量体地址列表
            getShopAddr () {
                let data = {
                    stateName: this.addressInfo.province,
                    cityName: this.addressInfo.city,
                    destName: this.addressInfo.district,
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
                this.$set(this.addressInfo, "city", value[1].name)
                this.$set(this.addressInfo, "district", value[2].name)
                if (value[2].code) {
                    this.addressInfo.addressId = value[2].code;
                } else if (value[1].code) {
                    this.addressInfo.addressId = value[1].code;
                } else {
                    this.addressInfo.addressId = value[0].code;
                }
                if (this.tabIsSelect == false) {
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
            }
        },
        created() {
            this.getCityData ();
            let ptiParthdId = this.$route.query.ptiParthdId
            if(this.$route.query.fromPage =='settlement'){
                Storage.set("ptiParthdId",ptiParthdId);
            }
            if(this.$route.query.from =='myReserve'){
                if(this.$route.query.type == 'D_MSRVISIT'){
                    this.active = 0;
                    this.visit = Storage.get("VOLUME_VISIT");
                }
                if(this.$route.query.type == 'D_MSRSHOP'){
                    this.active = 1;
                    this.store = Storage.get("VOLUME_STORE");
                }
            }
            if(this.$route.query.from == 'map'){
                this.active = 2;
                this.tabIsSelect = true;                
                if(Storage.get("VOLUME_STORE") != null||Storage.get("VOLUME_STORE") != ''){
                    this.store = Storage.get("VOLUME_STORE");
                    this.addressInfo = this.store.addressInfo
                }
            }
            // if(Storage.get("VOLUME_STORE") != null||Storage.get("VOLUME_STORE") != ''){
            //         console.log(1111122222);
            //         let storeData = Storage.get('VOLUME_STORE')
            //         this.store = storeData 
            //         this.addressInfo = storeData.addressInfo;     
            // }
            this.getPage();
            this.getAmount();
            this.getVolumes();
            let data ={
                ownCompanyId:Storage.get('COMPANYID').company_id,
                statusCodes:'D_INFINISH',
                partIds: Storage.get('ptiParthdId'),
                ctmUsrId:Storage.get('USER_INFO').usrId,
                companyId:Storage.get('COMPANYID').company_id
            }
            let data2 ={
                usrId: Storage.get('USER_INFO').usrId,
                companyId: Storage.get('COMPANYID').company_id,
                searchUsrId: Storage.get('USER_INFO').usrId,
                statusCodes: 'MEASURE_HISTORY',
                hasOrd:0,
                pageNum: 1,
                pageSize: 5
            }
            Volume.getVolumeList(data2).then(
                (res) => {
                    this.history = res.list;
                    let historyLen = this.history.length
                    for (let i = 0; i < historyLen; i++) {
                        this.$set(this.history[i], "isSelected", false)
                    }
                },
                () => {
                    Toast("请求有误了~");
                }
            );
            Volume.getMeasureType(data).then(
                (res) => {
                    this.countDodyData = res;
                    let countDodyDataLen = this.countDodyData.length
                    for (let i = 0; i < countDodyDataLen; i++) {
                        this.$set(this.countDodyData[i], "isSelected", false);
                        // console.log(this.countDodyData[i].usrId);
                        // console.log(this.countDodyData[i].cargousrName);
                        // console.log(this.countDodyData[i].ctmMeasureHdCode);
                        let dataInfo = {
                            ctmUsrId: this.countDodyData[i].usrId,
                            msrModeTypeCode: 'D_ACTUALMSR',
                            dressedUsrName: this.countDodyData[i].dressedusrName,
                            billCode: this.countDodyData[i].billCode
                        }
                        Volume.getMeasureInfo(dataInfo).then(
                            (res) => {
                                // console.log("99999999",res[0].referenceList[0].measureInfoList);
                                // var measuser_data =  res[0].referenceList[0].measureInfoList;
                                let referenceList = res[0].referenceList;
                                let measuser_data = [];
                                // console.log("referenceList", referenceList)
                                this.$set(this.countDodyData[i], "Array", measuser_data);
                                for (let j = 0; j < referenceList.length; j++){
                                    // if(!referenceList[i].measureInfoList) continue;
                                    measuser_data = measuser_data.concat(referenceList[j].measureInfoList)
                                    // measuser_data.push(referenceList[j].measureInfoList)
                                    if(j == referenceList.length - 1){
                                        console.log("measuser_data",measuser_data, i)
                                        this.$set(this.countDodyData[i], "Array", measuser_data);
                                    }
                                }
                                // _that.list = res.list
                                // console.log("xxxxxxxxxxxxxx",this.countDodyData[i]);
                            },
                            () => {
                                Toast("请求有误了~");
                            }
                        );
                        
                    }
                    this.list = res.list
                },
                () => {
                    Toast("请求有误~");
                }
            );
            // let data1 ={
            //     ctmUsrId: 1066,
            //     msrModeTypeCode: 'D_ACTUALMSR',
            //     dressedUsrName: '多福多寿',
            //     billCode: '7932659'
            // }
            // Volume.getMeasureInfo(data1).then(
            //     (res) => {
            //         console.log("99999999",res[0].referenceList[0].measureInfoList);
            //         // _that.list = res.list
            //     },
            //     () => {
            //         Toast("提交出错了~");
            //     }
            // );
            let history = [
                {src: "../../assets/images/Suit1.png"},
                {src: "../../assets/images/Suit1.png"},
                {src: "../../assets/images/Suit1.png"},
                {src: "../../assets/images/Suit1.png"},
                {src: "../../assets/images/Suit1.png"},
                {src: "../../assets/images/Suit1.png"}
            ];
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
    @import "../../assets/scss/common/choiceDressed";
    .empty-content{
        height: calc(100vh - #{computed(240)});
    }
</style>
