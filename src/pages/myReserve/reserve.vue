<template>
  <div class="design pain-style">
    <div class="toast">{{toast}}</div>
    <div class="container" v-if="show">
      <van-tabs v-model="active" :line-width="150" @change="data_change()">
        <!-- 上门量体tab begin -->
        <van-tab title="上门量体">
          <div class="company-content">
            <ul class="form">
              <li class="form-row">
                <label class="row-label" for>联系人</label>
                <!-- <input type="text" v-model="visit.name" placeholder="请输入您的名字"> -->
                <van-field
                    placeholder="请输入您的名字"
                    clearable
                    v-inputfix
                    class="van_input"
                    v-model="visit.name"
                    type="text"
                />
              </li>
              <li class="form-row">
                <label class="row-label" for>联系方式</label>
                <!-- <input type="text" v-model="visit.tel" placeholder="请输入联系方式"> -->
                <van-field
                    placeholder="请输入联系方式"
                    clearable
                    v-inputfix
                    class="van_input"
                    v-model="visit.tel"
                    type="text"
                />
              </li>
              <li class="form-row">
                <div class="row-div">预约时间</div>
                <div class="input-dialog" @click="jumpTime()">
                  <span v-if="visit.date == '' || visit.date == null">请选择量体日期</span>
                  <span v-else>{{visit.date}}</span>
                  <div class="icon-img">
                    <i class="iconfont icon-gengduo"></i>
                  </div>
                </div>
              </li>
              <li class="form-row">
                <div class="row-div" for>所在地区</div>
                <div class="input-dialog" @click="showAreaList = true">
                  <span v-if="visit.address == '' || visit.address == null">请选择城市地区</span>
                  <span v-else>{{visit.address}}</span>
                  <div class="icon-img">
                    <i class="iconfont icon-gengduo"></i>
                  </div>
                </div>
              </li>
              <li class="form-row">
                <div class="row-div" for>具体地址</div>
                <!-- <textarea v-model="visit.addressDetail" placeholder="请输入具体地址" cols="30" rows="10"></textarea> -->
                <van-field
                    placeholder="请输入具体地址"
                    clearable
                    v-inputfix
                    class="van_input van_textarea"
                    v-model="visit.addressDetail"
                    type="textarea"
                />
              </li>
              <li class="form-row">
                <div class="row-div" for>备注</div>
                <van-field
                    placeholder="请输入备注"
                    clearable
                    v-inputfix
                    class="van_input van_textarea"
                    v-model="visit.measureMemo"
                    type="textarea"
                />
                <!-- <textarea v-model="visit.measureMemo" cols="30" rows="10"></textarea> -->
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
                <label class="row-label" for>联系人</label>
                <!-- <input type="text" v-model="store.name" placeholder="请输入您的名字"> -->
                <van-field
                    placeholder="请输入您的名字"
                    clearable
                    v-inputfix
                    class="van_input"
                    v-model="store.name"
                    type="text"
                />
              </li>
              <li class="form-row">
                <label class="row-label" for>联系方式</label>
                <!-- <input type="text" v-model="store.tel" placeholder="请输入联系方式"> -->
                <van-field
                    placeholder="请输入联系方式"
                    clearable
                    v-inputfix
                    class="van_input"
                    v-model="store.tel"
                    type="text"
                />
              </li>
              <li class="form-row">
                <div class="row-div" for>所在地区</div>
                <div class="input-dialog" @click="showAreaList1 = true">
                  <span v-if="store.address == '' || store.address == null">请选择城市地区</span>
                  <span v-else>{{store.address}}</span>
                  <div class="icon-img">
                    <i class="iconfont icon-gengduo"></i>
                  </div>
                </div>
              </li>
              <li class="form-row">
                <div class="row-div" for>选择门店</div>
                <div class="input-dialog" @click="jumpMap()">
                  <span v-if="store.addressDetail == '' || store.addressDetail == null">请选择量体门店</span>
                  <span v-else>{{store.addressDetail}}</span>
                  <div class="icon-img">
                    <i class="iconfont icon-gengduo"></i>
                  </div>
                </div>
              </li>
              <li class="form-row">
                <div class="row-div">预约时间</div>
                <div class="input-dialog" @click="jumpTime()">
                  <span v-if="store.date == '' || store.date == null">请选择量体日期</span>
                  <span v-else>{{store.date}}</span>
                  <div class="icon-img">
                    <i class="iconfont icon-gengduo"></i>
                  </div>
                </div>
              </li>
              <!-- <li class="form-row">
                                <div class="row-div" for="">具体地址</div>
                                <textarea placeholder="请输入具体地址" cols="30" rows="10"></textarea>
              </li>-->
              <li class="form-row">
                <div class="row-div" for>备注</div>
                <van-field
                    placeholder="请输入备注"
                    clearable
                    v-inputfix
                    class="van_input van_textarea"
                    v-model="visit.measureMemo"
                    type="textarea"
                />
                <!-- <textarea v-model="store.measureMemo" cols="30" rows="10"></textarea> -->
              </li>
            </ul>
          </div>
        </van-tab>
        <!-- 到店量体tab end -->
      </van-tabs>
    </div>

    <!-- 第二步表格 -->
    <div class="company-content">
      <van-data-From
        v-if="!show"
        :cb="postVolume"
        :chichun="sun_chichun"
        :otherBillCode="otherBillCode"
        :v_type ="v_type"
        :partIds="partIds"
        :routeName = 'routeName'
        :sendAmount ="sendAmount"
        :sendMainFabricId ="sendMainFabricId"
        :yuyueData="yuyueData"
        :queryData="queryData"
        :successUrl = 'successUrl'
        :measureOpCode='measureOpCode'
        :s_type="s_type"
        v-on:listenToChildEvent="postVolume"
      ></van-data-From>
    </div>
    <div v-if="show" class="submit" @click="postVolume1">{{submitWord}}</div>
    <!-- 省市区选择 -->
    <van-popup v-model="showAreaList" position="bottom">
      <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false"/>
    </van-popup>
    <van-popup v-model="showAreaList1" position="bottom">
      <van-area :area-list="areaList1" @confirm="areaChange" @cancel="showAreaList1 = false"/>
    </van-popup>
    <!-- 日期选择 -->
    <van-popup v-model="showDataList" position="bottom">
      <van-picker
        show-toolbar
        title="可选日期"
        :columns="columns"
        @change="onChange"
        @cancel="showDataList = false"
        @confirm="dataChange"
      />
      <!-- 
      <van-datetime-picker
                v-model="currentDate"
                type="datetime"
                @confirm="dataChange"
                @cancel="showDataList = false"
                :min-date="minDate"
                :max-date="maxDate"
      />-->
    </van-popup>

    <van-popup v-model="showDalog" class="pain-dalog" :close-on-click-overlay="false">
      <div class="successBox">
        <ul>
          <li class="li-row">
            <div class="Icon_success">
              <img src="../../assets/images/volume/Icon_success.png" alt>
            </div>
          </li>
          <li class="li-row">
            <div class="li-word">填写成功!</div>
          </li>
          <li class="li-row">
            <div class="li-word1">着装师将尽快与您联系</div>
          </li>
          <li class="li-row">
            <div class="li-action" @click="jumpMyReserve1">
              查看预约&nbsp;
              <i class="iconfont icon-gengduo"></i>
            </div>
          </li>
        </ul>
      </div>
    </van-popup>
    
  </div>
</template>
<script>
// import _ from 'lodash'
import { cityData } from '../../assets/js/cityData';
import payment from '../../util/payment';
import { Base } from '../../api/service';
import { RadioGroup, Radio, Popup, Toast, Icon, Field, Loading, Dialog, Tab, Tabs, Area, DatetimePicker, Picker } from 'vant';
import Storage from '../../util/storage';
import { Volume, Cms, Payment, UserService } from "../../api/service";
import BodyDataForm from '@/components/BodyDataForm.vue';
import letter from './components/letter';
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
    "van-radio-group": RadioGroup,
    "van-radio": Radio,
    "van-data-From": BodyDataForm,
    "van-field": Field,
    letter
  },
  data() {
    return {
      submitWord:'提交预约',
      submitData:{
         measureOpCode:null,
         liangti:null,
         yuyue:null
      },
        columns: [
            ],
      successUrl:null,   
      partIds: null,
      routeName:null,
      sendAmount:null,
      sendMainFabricId:null,
      yuyueData:null,
      queryData:null,
      v_type:null,
      measureOpCode:null,
      otherBillCode: null,
      s_type: null,
      sun_chichun: 0,
      toast: '第一步：提交预约信息',
      maxDate: new Date(parseInt(new Date().getFullYear()), (parseInt(new Date().getMonth()) + 3), 1),
      minDate: new Date(),
      //当前日期设置
      currentDate: new Date(),
      //日期上拉框
      showDataList: false,
      volumeDialogFlag: true,
      // tab选中选项
      active: 0,
      showDalog:false,
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
        measureMemo: ''
      },
      // 到店量体
      store: {
        name: "",
        tel: "",
        address: "",
        addressDetail: "",
        date: "",
        addressInfo: {
          province: '',
          district: '',
          city: ''
        },
        dptId: '',
        measureMemo: ''
      },
      // 省市区数据
      showAreaList: false,
      showAreaList1: false,
      // 选中的省市区信息
      areaList: {},
      areaList1: cityData,
      id: null,
      cardNo: null,
      a_array: null,
      billCode: null,
      rtlOrdHdCode: null,
      saleOrdDtId: null,
      saleOrdDtList: null
    }
  },
  computed: {
  },
  methods: {
    getQueryString (url){
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
                reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
                arr_url = reg_url.exec(url),
                ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },
    async destoryed (to) {
        this.$route.meta.keepAlive = false;
    },
    data_change() {
      Storage.set("sun_active", { active: this.active });
      this.addressInfo = {}
    },
    onConfirm() {

    },
    onCancel() {
    },
    onChange(picker, values) {
      picker.setColumnValues(1, this.a_array[values[0]]);
    },
    getCityData1() {
      Base.getDestnation().then((res) => {
        let provinceMap = {}
        let cityMap = {}
        let countyMap = {}
        res.list.forEach((item) => {
          if (item.destTypeId === res.code[0]) {
            provinceMap[item.code] = item.name
          }
          if (item.destTypeId === res.code[1]) {
            cityMap[item.code] = item.name
          }
          if (item.destTypeId === res.code[2]) {
            countyMap[item.code] = item.name
          }
        })
        this.areaList1.province_list = provinceMap
        this.areaList1.city_list = cityMap
        this.areaList1.county_list = countyMap
      })
    },
    //  获取省市区
    getCityData() {
      var data = {
        cardNo: this.cardNo,
        usrId: Storage.get('USER_INFO').usrId,
        companyId: Storage.get("COMPANYID").company_id,
        masterWayCode: 'D_MSRVISIT'
      }
      Volume.getDoorAddr(data).then((res) => {
        let provinceMap = {}
        let cityMap = {}
        let countyMap = {}
        res.forEach((item, index) => {
          provinceMap[item.provinceCode] = item.provinceName
          cityMap[item.cityCode] = item.cityName
          countyMap[item.districtCode] = item.districtName
          // if (item.destTypeId === res.code[0]) {
          //     provinceMap[item.code] = item.name
          // }
          // if (item.destTypeId === res.code[1]) {
          //     cityMap[item.code] = item.name
          // }
          // if (item.destTypeId === res.code[2]) {
          //     countyMap[item.code] = item.name
          // }
        })
        this.areaList.province_list = provinceMap
        this.areaList.city_list = cityMap
        this.areaList.county_list = countyMap
      })
    },
    parentReceive(message) {
      this.postVolume()
    },
    /**
     * 日期格式转换
     * @param value
     * @returns {string}
     */
    _formatDate(value) {
      let s_value = value[0] + ' ' + value[1] + ':00'
      // const date = new Date(s_value);
      var date = new Date(Date.parse(s_value.replace(/-/g, "/")));
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
      if (this.active == 0) {
        this.visit.dateVal = value;
        this.visit.date = this._formatDate(value);
      } else {
        this.store.dateVal = value;
        this.store.date = this._formatDate(value);
      }
      this.showDataList = false;
    },
    jumpTime() {
      if (this.active == 0) {
        let data = {
          ownCompanyId: Storage.get("COMPANYID").company_id,
          buscontscode: 'D_BUSCONTS_WSC',
          cardNo: this.cardNo,
          dptCode: Storage.get("USER_INFO").shopCode,
          usrId: Storage.get('USER_INFO').usrId,
          companyId: Storage.get("COMPANYID").company_id
        }
        Volume.getVolumeTime(data).then((res) => {
          let s_array = []
          let a_array = {}
          let firstRow = null
          for (var i = 0; i < res.length; i++) {
            s_array.push(res[i].ymd)
            firstRow = res[0].ymd
          }
          for (var j = 0; j < res.length; j++) {
            var b_array = []
            for (var k = 0; k < res[j].hourList.length; k++) {
              // a_array.push(res[j].hourList[k])
              b_array.push(res[j].hourList[k])
              this.$set(a_array, res[j].ymd, b_array)
            }
          }
          this.a_array = a_array
          this.columns = [
            {
              values: s_array,
              className: 'column1'
            },
            {
              values: a_array[firstRow],
              className: 'column2'
            }
          ]
          this.showDataList = true
        }, (err) => { }).then(() => {
        })
      } else {
        if (Storage.get("VOLUME_STORE") != null || Storage.get("VOLUME_STORE") != '') {
          if (Storage.get("VOLUME_STORE").dptCode != null & Storage.get("VOLUME_STORE").dptCode != '' & Storage.get("VOLUME_STORE").dptCode != undefined) {
            let data = {
              ownCompanyId: Storage.get("COMPANYID").company_id,
              buscontscode: 'D_BUSCONTS_WSC',
              cardNo: this.cardNo,
              dptCode: Storage.get("VOLUME_STORE").dptCode,
              usrId: Storage.get('USER_INFO').usrId,
              companyId: Storage.get("COMPANYID").company_id
            }
            Volume.getVolumeTime(data).then((res) => {
              let s_array = []
              let a_array = {}
              let firstRow = null
              for (var i = 0; i < res.length; i++) {
                s_array.push(res[i].ymd)
                firstRow = res[0].ymd
              }
              for (var j = 0; j < res.length; j++) {
                var b_array = []
                for (var k = 0; k < res[j].hourList.length; k++) {
                  // a_array.push(res[j].hourList[k])
                  b_array.push(res[j].hourList[k])
                  this.$set(a_array, res[j].ymd, b_array)
                }
              }
              this.a_array = a_array
              this.columns = [
                {
                  values: s_array,
                  className: 'column1'
                },
                {
                  values: a_array[firstRow],
                  className: 'column2'
                }
              ]
              this.showDataList = true
            }, (err) => { }).then(() => {
            })
          }
          else {
            Toast("请先选择门店");
          }
        }
      }
    },
    /**
     * 跳转到地图
     */
    jumpMap() {
      if (!this.store.addressInfo.addressId) {
        Toast("请先选择省市区");
        return;
      }
      // this.getShopAddr()
      this.store.date = ''
      Storage.set("VOLUME_STORE", this.store);
      this.$router.push("/addressMap?type=store&from=reserve");
      // this.$router.push("/addressMap?type=store");
    },
    jumpMyReserve1() {
      this.$router.replace("/myReserve");
    },
    /**
     * 
     * 跳转我的预约
     */
    jumpMyReserve() {
      // this.$router.push("/myReserve");
      this.$router.replace({
        name: 'submitSuccess',
        path: '/submitSuccess',
        params: {
          billCode: Storage.get("rtlOrdHdCode").billCode
        }
      })

    },
    //  获取到店量体地址列表
    getShopAddr() {
      let data = {
        stateName: this.addressInfo.province,
        cityName: this.addressInfo.city,
        destName: this.addressInfo.district,
        cardNo: this.cardNo,
        usrId: Storage.get('USER_INFO').usrId,
        ownCompanyId: Storage.get("COMPANYID").company_id,
        companyId: Storage.get("COMPANYID").company_id,
      }
      Volume.getShopAddr(data).then((res) => {
        this.shopColumns = []
        let map = {}
        res.forEach((item) => {
          map.text = item.dptName
          map.value = item.dptId
          this.shopColumns.push(map)
          map = {}
        })
      }, (err) => { }).then(() => {
        if (this.shopColumns.length > 0) {
          this.showShopList = true
        } else {
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
      if (this.active == 0) {
        this.visit.addressInfo = this.addressInfo
        this.visit.address =
          value[0].name + " " + value[1].name + " " + value[2].name;
        this.visit.addressId = this.addressInfo.addressId;
      } else {
        this.store.addressInfo = this.addressInfo
        this.store.address =
          value[0].name + " " + value[1].name + " " + value[2].name;
        this.store.addressInfo = this.addressInfo;
      }
      this.store.addressDetail = ''
      this.showAreaList = false;
      this.showAreaList1 = false;
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
    postVolume1() {
      let data = {};
      let sexCode = "";
      let weChatInfo = Storage.get("WECHAT_INFO");
      if (this.active === 0) {
        if (
          !this.visit.name 
        ) {
          Toast("请填写姓名，姓名为必填项");
          this.btnLock = false;
          return;
        }
        if (!isPhone(this.visit.tel)) {
          Toast("请填写正确手机号~");
          this.btnLock = false;
          return;
        }
        if (
          !this.visit.addressDetail 
        ) {
          Toast("请填写地址详情，地址详情为必填项");
          this.btnLock = false;
          return;
        }
        if (
          !this.visit.date
        ) {
          Toast("请填写日期，日期为必填项");
          this.btnLock = false;
          return;
        }
        
        data = {
          msrWayCode: "D_MSRVISIT",
          cargousrName: this.visit.name,
          cargousrSex: 'D_MALE',
          cargoMobile: this.visit.tel,
          stateName: this.visit.addressInfo.province,
          cityName: this.visit.addressInfo.city,
          destName: this.visit.addressInfo.district,
          address: this.visit.addressDetail,
          measureMemo: this.visit.measureMemo,
          orderTime: this.visit.date,
          usrId: Storage.get('USER_INFO').usrId,
          dptId: null,
          shopId: Storage.get('USER_INFO').shopId,
          companyId: Storage.get("COMPANYID").company_id,
          rtlOrdHdCode: this.rtlOrdHdCode,
          saleOrdDtList: this.saleOrdDtList
        };
      } else {
        if (
          !this.store.name 
        ) {
          Toast("请填写姓名，姓名为必填项");
          this.btnLock = false;
          return;
        }
        if (!isPhone(this.store.tel)) {
          Toast("请填写正确手机号~");
          this.btnLock = false;
          return;
        }
        if (
          !this.store.addressDetail
        ) {
          Toast("请填写地址详情，地址详情为必填项");
          this.btnLock = false;
          return;
        }
        if (
          !this.store.date
        ) {
          Toast("请填写日期，日期为必填项");
          this.btnLock = false;
          return;
        }
        data = {
          msrWayCode: "D_MSRSHOP",
          cargousrName: this.store.name,
          cargousrSex: sexCode,
          cargoMobile: this.store.tel,
          stateName: this.store.addressInfo.province,
          cityName: this.store.addressInfo.city,
          destName: this.store.addressInfo.district,
          address: this.store.addressDetail,
          orderTime: this.store.date,
          usrId: Storage.get('USER_INFO').usrId,
          dptId: this.store.dptId,
          shopId: Storage.get('USER_INFO').shopId,
          measureMemo: this.store.measureMemo,
          rtlOrdHdCode: this.rtlOrdHdCode,
          saleOrdDtList: this.saleOrdDtList
        };
      }
      console.log("yuhong",JSON.stringify(data))
      window.scrollTo(0, 5);
      console.log(this.routeName)
      this.yuyueData = data
      var _data = {
          yuyue:data,
          routeName:this.routeName,
          measureOpCode:this.measureOpCode,
          billCode: this.otherBillCode,
          b_data:this.queryData,
          partIds:this.partIds,
          type: this.s_type,
      }
      Storage.set("reserveStorage", _data);
      // sjd
      // this.show = false;
      this.$router.push({
        name: 'aiCountBody',
        path: '/aiCountBody',
        params: _data,
        query:{
            successUrl:this.$route.query.successUrl
        }
      })
      this.toast = '第二步：填写身型信息'
    },
    //  提交预约量体
    async postVolume() {
      let data = {};
      let sexCode = "";
      let that = this;
      let weChatInfo = Storage.get("WECHAT_INFO");
      console.log("$$$$$$$")
      if (this.active === 0) {
        if (
          !this.visit.name 
        ) {
          Toast("请填写姓名，姓名为必填项");
          this.btnLock = false;
          return;
        }
        if (!isPhone(this.visit.tel)) {
          Toast("请填写正确手机号~");
          this.btnLock = false;
          return;
        }
        if (
          !this.visit.addressDetail 
        ) {
          Toast("请填写地址详情，地址详情为必填项");
          this.btnLock = false;
          return;
        }
        if (
          !this.visit.date
        ) {
          Toast("请填写日期，日期为必填项");
          this.btnLock = false;
          return;
        }
        data = {
          id: null,
          msrWayCode: "D_MSRVISIT",
          cargousrName: this.visit.name,
          cargousrSex: 'D_MALE',
          cargoMobile: this.visit.tel,
          stateName: this.visit.addressInfo.province,
          cityName: this.visit.addressInfo.city,
          destName: this.visit.addressInfo.district,
          address: this.visit.addressDetail,
          orderTime: this.visit.date,
          usrId: Storage.get('USER_INFO').usrId,
          dptId: null,
          shopId: Storage.get('USER_INFO').shopId,
          measureMemo: this.visit.measureMemo,
          companyId: Storage.get("COMPANYID").company_id,
          rtlOrdHdCode: this.rtlOrdHdCode,
          saleOrdDtList: this.saleOrdDtList
        };
      } else {
        if (
          !this.store.name 
        ) {
          Toast("请填写姓名，姓名为必填项");
          this.btnLock = false;
          return;
        }
        if (!isPhone(this.store.tel)) {
          Toast("请填写正确手机号~");
          this.btnLock = false;
          return;
        }
        if (
          !this.store.addressDetail 
        ) {
          Toast("请填写地址详情，地址详情为必填项");
          this.btnLock = false;
          return;
        }
        if (
          !this.store.date
        ) {
          Toast("请填写日期，日期为必填项");
          this.btnLock = false;
          return;
        }
        data = {
          id: null,
          msrWayCode: "D_MSRSHOP",
          cargousrName: this.store.name,
          cargousrSex: sexCode,
          cargoMobile: this.store.tel,
          stateName: this.store.addressInfo.province,
          cityName: this.store.addressInfo.city,
          destName: this.store.addressInfo.district,
          address: this.store.addressDetails,
          orderTime: this.store.date,
          usrId: Storage.get('USER_INFO').usrId,
          dptId: this.store.dptId,
          shopId: Storage.get('USER_INFO').shopId,
          measureMemo: this.store.measureMemo,
          rtlOrdHdCode: Storage.get('rtlOrdHdCode').billCode,
          saleOrdDtList: Storage.get('saleOrdDtList')
        };
      }
      if (Storage.get("DATA") !== '' && Storage.get("DATA") !== undefined && Storage.get("DATA") !== null) {
        data.id = Storage.get("DATA").id
      }
      let saveResult = {}
      console.log(data)
      // let saveResult=await  Volume.saveVolume(data);
      await Volume.saveVolume(data).then(
        (res) => {
          saveResult = res;
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
            if (Storage.get("DATA") !== '' && Storage.get("DATA") !== undefined && Storage.get("DATA") !== null) {
              var sdata = {
                ownCompanyId: Storage.get("COMPANYID").company_id,
                saleHdId: Storage.get("DATA").id
              }
              Volume.getSaleMeasureId(sdata).then(
                (res) => {
                  this.$set(orderData, "orderList", res.cardBillCode);
                  Payment.payOrder(orderData).then((config) => {
                    if (config.code === "200") {
                      let wxconfig = {
                        timeStamp: config.timeStamp,
                        nonceStr: config.nonceStr,
                        package: config.prepayId,
                        paySign: config.paySign,
                        successUrl: '/reserve?status=success',
                        failUrl: '/reserve?status=fail'
                      }
                      payment.miniProgramPay(wxconfig, wxconfig.successUrl, wxconfig.failUrl)
                      // this.showDalog = true;
                      if (!!Storage.get("route")) {
                        if (Storage.get("route").routes == "myReserve") {
                          this.showDalog = true;
                          Storage.remove('route');
                          Storage.remove('DATA');
                          return;
                        }
                      }
                      this.jumpMyReserve();
                    } else {
                      Toast('支付出错了~')
                      that.btnLock = false
                      return
                    }
                  }).then(() => {
                    that.btnLock = false
                  });
                },
                () => {
                  Toast("提交出错了~");
                }
              );
            }
            else {
              Payment.payOrder(orderData).then((config) => {
                if (config.code === "200") {
                  let wxconfig = {
                    timeStamp: config.timeStamp,
                    nonceStr: config.nonceStr,
                    package: config.prepayId,
                    paySign: config.paySign,
                    successUrl: '/reserve?status=success',
                    failUrl: '/reserve?status=fail'
                  }
                  payment.miniProgramPay(wxconfig, wxconfig.successUrl, wxconfig.failUrl)
                  // this.showDalog = true;
                  if (!!Storage.get("route")) {
                    if (Storage.get("route").routes == "myReserve") {
                      this.showDalog = true;
                      Storage.remove('route');
                      Storage.remove('DATA');
                      return;
                    }
                  }
                  this.jumpMyReserve()
                } else {
                  Toast('支付出错了~')
                  that.btnLock = false
                  return
                }
              }).then(() => {
                that.btnLock = false
              });
            }
          } else {
            // this.showDalog = true;
            if (!!Storage.get("route")) {
              if (Storage.get("route").routes == "myReserve") {
                this.showDalog = true;
                Storage.remove('route');
                Storage.remove('DATA');
                return;
              }
            }
            this.jumpMyReserve()
            Toast("提交预约成功");
          }
          Storage.remove('route');
          Storage.remove('DATA');
        },
        () => {
          Toast("提交出错了~");
          this.btnLock = false;
        }
      );
      return saveResult;
    }
  },
  // 
  watch: {
      '$route':function (to, from) {
          console.log("222222");
          console.log('~~~~~~~~~~~',from)
          if (to.path == "/addressMap") {
              from.meta.keepAlive = true;
          } else {
              from.meta.keepAlive = false;
          }
      }
  },
  // activated () {
  //     console.log("有activated")
  // },
  created() {
    let adata = {
      usrId: Storage.get('USER_INFO').usrId,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      companyId: Storage.get("COMPANYID").company_id
    }
    UserService.getUserInfo(adata).then(
      (res) => {
        this.cardNo = res.cardNo
        this.getCityData()
      },
      () => {
      }
    );
    if (this.$route.query.status == 'success') {
      // this.showDalog = true;
      if (Storage.get("route").routes == "myReserve") {
        this.showDalog = true;
        return;
      }
      this.jumpMyReserve()
      Toast("提交预约成功");
    }
    if (this.$route.query.status == 'fail') {
      // this.showDalog = true;
      if (Storage.get("route").routes == "myReserve") {
        this.showDalog = true;
        return;
      }
      this.jumpMyReserve()
      Toast("提交预约成功");
    }
//
    if (this.$route.query.from == 'myReserve') {
      var route = 'myReserve'
      Storage.set("route", { routes: route });
      if (this.$route.query.type == 'D_MSRVISIT') {
        this.active = 0;
        this.visit = Storage.get("VOLUME_VISIT");
        let currentTime = new Date().getTime();
        if (currentTime > new Date(this.visit.date).getTime()) {
          Toast("该预约单时间已过期");
          this.visit.date = ''
        }
        this.id = Storage.get("VOLUME_VISIT").id
        this.addressInfo = this.visit.addressInfo
      }
      if (this.$route.query.type == 'D_MSRSHOP') {
        this.active = 1;
        this.store = Storage.get("VOLUME_STORE");
        let currentTime = new Date().getTime();
        if (currentTime > new Date(this.store.date).getTime()) {
          Toast("该预约单时间已过期");
          this.store.date = ''
        }
        this.addressInfo = this.store.addressInfo
        this.id = Storage.get("VOLUME_STORE").id
      }
      var ndata ={
          id:this.id,
          usrId: Storage.get('USER_INFO').usrId,
          ownCompanyId: Storage.get("COMPANYID").company_id,
          companyId: Storage.get("COMPANYID").company_id
      }
      // sjd
      Volume.getVolumeGoodsCode(ndata).then((res) => {
          if(res.skuInfoList.length == 1){
              this.partIds = res.skuInfoList[0].ptiPartHdCode
          }
          if(res.skuInfoList.length > 1){
              for(var k=0;k<res.skuInfoList.length;k++){
                 if(k == 0 ){
                    this.partIds = res.skuInfoList[0].ptiPartHdCode
                 }else{
                    this.partIds =this.partIds + ',' + res.skuInfoList[k].ptiPartHdCode
                 }
              }
          }
          console.log("有返回东西哟",this.partIds)
      })
    }
    if(!!Storage.get("s_router")){
      if (this.$route.query.from == 'map' || Storage.get("s_router").fromPage =='map') {
        this.active = 1;
        if (Storage.get("VOLUME_STORE") != null || Storage.get("VOLUME_STORE") != '') {
          this.store = Storage.get("VOLUME_STORE")
          this.addressInfo = this.store.addressInfo
        }
      }
      Storage.remove('s_router');
    }
    //        this.getPage();
    this.getAmount();
    this.getVolumes();
    var s_active = Storage.get("sun_active");
    if (!!s_active) {
      this.active = s_active.active
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
// @import "../../assets/scss/goods/web-design";
@import "../../assets/scss/common/myReserve";
.van_input{
  box-sizing: border-box;
    padding-left: 4.26667vw;
    padding-right: 9.33333vw;
    width: 72vw;
    height: 11.73333vw;
    background: #f6f6f6;
    font-size: 4vw;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: #999999;
    outline: none;
    -webkit-appearance: none;
    border-radius: 0;
    border: none;
    display: inline-flex;
}
.van_textarea{
  height:20vw;
}
</style>
