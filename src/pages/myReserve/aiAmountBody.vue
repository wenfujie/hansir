<template>
  <div class="member-information ">
    <div class="aiTop">
      <img class="aiImg" src="../../assets/images/common/word.png"/>
      <span class="aiTitle">填写基本尺寸</span>
    </div>

    <div class="detail-cell">
      <div class="cell-title">

        <span>姓名</span>
        <span class="red-star">*</span>
      </div>
      <!-- 默认姓名框 -->
        <div class="cell-content pain_row" >
          <van-field
            placeholder="此姓名用于制作水洗标"
            clearable
            class="van-field__control"
            v-model="userName"
            type='text'
          />
        </div>
    </div>
    <!--会员属性-->
    <div class="detail-cell"
         :class="[item.selectClassDictCode === 'D_FEATURE_CHOTYPE_OPEN' ? 'top-margin' : '']"
         v-for="(item, index)  in memberInfo" :key="index">

        <div :class="[item.selectClassDictCode === 'D_FEATURE_CHOTYPE_OPEN' && (item.inputClassDictCode=='D_FEATURE_WRITETYPE_SELECT' || item.showPicFlag === 1) ? 'none-title' : 'cell-title']">
        <!-- <div :class="[item.selectClassDictCode === 'D_FEATURE_CHOTYPE_OPEN' && item.showPicFlag === 1 ? 'none-title' : 'cell-title']"> -->
            <span>{{item.featureName}}</span>
            <span class="red-star" v-if="item.mustFlag== true">*</span>
            <span v-else>&nbsp;</span>
        </div>
      <!-- 下拉框 -->
        <div class="cell-content inputDown" v-if="item.selectClassDictCode === 'D_FEATURE_CHOTYPE_DOWN' && item.inputClassDictCode== 'D_FEATURE_WRITETYPE_SELECT'" @click="showPopup(item)">
            <input :placeholder="item.inputDesc" class="van-field__control" v-model="item.valuemName" readonly unselectable="on" onfocus="this.blur()">
        </div>

      <!-- 文本框 -->
      <div class="cell-content pain_row" v-if="item.inputClassDictCode === 'D_FEATURE_WRITETYPE_TEXT' ">
        <!-- <input
          placeholder="请填写相关信息"
          class="van-field__control"
          :data-value="item.customValue"
          v-model="item.customValue"
          :value="item.customValueName"
          :type="item.fieldType === 'D_INTEGER' ? 'tel' : 'text'"
          @focus="getFoucs"
          @input="typeLimit(item,$event)"
          @blur="typeCheck(item)"
          :maxlength="item.fieldLength"
        > -->
        <van-field
                :placeholder="item.inputDesc"
                @input="aaa(item)"
                clearable
                class="van-field__control"
                :data-value="item.values"
                v-model="item.values"
                v-inputfix
                :value="item.customValueName"
                type="text"
                @change="typeLimit(item,$event)"
                ref="loseFocus"
        />
      </div>


      <!-- 没图单多选框 -->
      <div class="cell-content radius"
           v-if="item.selectClassDictCode == 'D_FEATURE_CHOTYPE_OPEN' &&  item.showPicFlag == 0">

        <!--<van-radio-group v-model="item.values" v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_ONE'" @change="setStoreInfo">-->
          <!--<van-radio-->
                  <!--v-for="(val,index) in item.valueDtoList"-->
                  <!--:name="val.id"-->
                  <!--:key="index"-->
          <!--&gt;{{val.valuemName}}-->
          <!--</van-radio>-->
        <!--</van-radio-group>-->
        <!--<van-checkbox-group v-model="item.valuesArr" v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'" @change="setStoreInfo">-->
          <!--<van-checkbox-->
                  <!--v-for="(val,index) in item.valueDtoList"-->
                  <!--:name="val.id"-->
                  <!--:key="index"-->
                  <!--@change="toggle(val)"-->
          <!--&gt;-->
            <!--{{val.valuemName}}-->
          <!--</van-checkbox>-->
        <!--</van-checkbox-group>-->
          <div v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_ONE' || item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'">
            <div class="mod-tel">
              {{item.featureName}}
              <span class="red-star" v-if="item.mustFlag== true">*</span>
              <span v-else>&nbsp;</span>
            </div>
            <!--单选列表-->
            <ul class="check-list pdT30" v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_ONE'">
              <li :class="['check-item',{'selected':item.values == child.id}]"
                  v-for="(child,index) in item.valueDtoList"
                  @click="item.values = child.id"
                  :key="index">
                {{child.valuemName}}
                <img src="@/assets/images/common/choose.png" v-show="item.values == child.id">
              </li>
            </ul>
            <!--多选列表-->
            <ul class="check-list pdT30" v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'">
              <li :class="['check-item',{'selected':item.valuesArr.indexOf(child.id) != -1}]"
                  v-for="(child,index) in item.valueDtoList"
                  @click="handleCheckItem(child,item.valuesArr)"
                  :key="index">
                {{child.valuemName}}
                <img src="@/assets/images/common/choose.png" v-show="item.valuesArr.indexOf(child.id) != -1">
              </li>
            </ul>
          </div>

        <!--旧版 无图 单选 多选列表-->
        <!--<van-radio-group v-model="item.values" v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_ONE'">-->
          <!--<van-radio-->
                  <!--v-for="(val,index) in item.valueDtoList"-->
                  <!--:name="val.id"-->
                  <!--:key="index"-->
          <!--&gt;{{val.valuemName}}</van-radio>-->
        <!--</van-radio-group>-->

        <!--<van-checkbox-group v-model="item.valuesArr" v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'">-->
          <!--<van-checkbox-->
            <!--v-for="(val,index) in item.valueDtoList"-->
            <!--:name="val.id + ''"-->
            <!--:key="index"-->
            <!--@change="toggle(val)"-->
          <!--&gt;-->
            <!--{{val.valuemName}}-->
          <!--</van-checkbox>-->
        <!--</van-checkbox-group>-->
      </div>
      <!-- 带图选择框 begin -->
      <div class="cell-content model-div"
           v-if="item.selectClassDictCode === 'D_FEATURE_CHOTYPE_OPEN'  && item.showPicFlag === 1">
        <div>
          <div class="mod-tel">
            <!-- <img class="mod_img" src="../../assets/images/volume/feature.png"/> -->
            {{item.featureName}}
            <span class="red-star" v-if="item.mustFlag== true">*</span>
            <span v-else>&nbsp;</span>
          </div>
          <ul>
            <li class="mod-item" v-for="(item1, index1)  in item.valueDtoList" :key="index1">
              <div v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_ONE'" @click="toggleSelected(index,index1)">
                <div class="type-img" :class="[ item1.defaultFlag == 1 ? 'pain-red' : 'pain-white']">
                  <div class="item-tip" v-if="item1.defaultFlag == 1 "><img src="../../assets/images/common/choose.png" alt=""></div>
                  <img :src="getImg(item1.fileUrl)" alt="">
                </div>
                <div class="type-tel">{{item1.valuemName}}</div>
                <div class="type-content">{{item1.memo}}</div>
              </div>
              <div v-if="item.unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'"
                   @click="muchToggleSelected(index,index1)">
                <div class="type-img" :class="[item1.defaultFlag == 1 ? 'pain-red' : 'pain-white']">
                  <div class="item-tip" v-if="item1.defaultFlag == 1"><img src="../../assets/images/common/choose.png"
                                                                           alt=""></div>
                  <img :src="getImg(item1.fileUrl)" alt="">
                </div>
                <div class="type-tel">{{item1.valuemName}}</div>
                <div class="type-content">
                  {{item1.memo}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 带图选择框 end -->
    </div>
    <!--底部按钮-->
    <!-- 保存 -->
    <button class="bottom-btn3" @click="putUserInfo">
      <p class="btn-txt">{{confirm}}</p>
    </button>
    <!--性别弹窗-->
    <van-popup v-model="showUserSelect" position="bottom">
      <van-picker
        :columns="columns"
        @change="onSexChange"
        show-toolbar
        @cancel="onCancel('sexPickerShow')"
        @confirm="onSexConfirm"
        class="picker-fixed"
        v-show="sexPickerShow"
      />
    </van-popup>
    <!--生日弹窗-->
    <van-popup v-model="showUserSelect" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :maxDate="maxDate"
        :min-date="minDate"
        @change="onBirthday"
        @cancel="onCancel('birthdayPickerShow')"
        @confirm="onBirthdayConfirm"
        class="picker-fixed"
        v-show="birthdayPickerShow"
      />
    </van-popup>
    <!--会员属性选择弹窗 begin-->
    <van-popup v-model="showMemberSelect" position="bottom">
      <van-picker
        :columns="changeMemberInfo"
        show-toolbar
        @cancel="cancelMemberInfo"
        @confirm="changeMember"
        class="picker-fixed"
      ></van-picker>
    </van-popup>
    <!--会员属性选择弹窗 end-->
    <!-- 电话号码弹出框 begin-->
    <van-popup
    v-model="mobilePhoneDolag"
    @click-overlay ="closeDolag">
      <div class="box">
        <div class="wrapper phone-box">
          <div class="form-box">
            <!-- <input type="tel" placeholder="请输入手机号" class="wd100" v-model="phoneNum"> -->
            <van-field
              placeholder="请输入手机号"
              v-inputfix
              clearable
              class="wd100"
              v-model="phoneNum"
              type="tel"
            />
          </div>
          <div class="form-box">
            <!-- <input type="tel" class="captcha-text wd70 fl" v-model="captcha" placeholder="请输入验证码"> -->
            <van-field
              placeholder="请输入验证码"
              v-inputfix
              clearable
              class="captcha-text wd60 fl"
              v-model="captcha"
              type="tel"
            />
            <button
              class="captcha-btn color-red wd40 fr"
              :class="[captchaLocked == true ? 'disabled' : '']"
              @click="checkPhone"
            >{{captchaText}}</button>
          </div>
          <div class="bottom-btn" @click="bindPhone">立即绑定</div>
        </div>
      </div>
    </van-popup>
    <!-- 电话号码弹出框 end-->
  </div>
</template>
<script>
import {
  Field,
  Icon,
  Picker,
  DatetimePicker,
  Toast,
  Popup,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup
} from "vant";
import { UserService } from "../../api/service";
import Storage from "../../util/storage";
export default {
  name: 'BodyDataForm',
  props: {
    msg: String,
    chichun: Number,
    s_type: Boolean,
    otherBillCode: String,
    partIds: String,
    cb: {
      type: Function
    }
  },
  components: {
    "van-field": Field,
    "van-icon": Icon,
    "van-picker": Picker,
    "van-datetime-picker": DatetimePicker,
    "van-popup": Popup,
    "van-radio-group": RadioGroup,
    "van-checkbox-group": CheckboxGroup,
    "van-checkbox": Checkbox,
    "van-radio": Radio
  },
  data() {
    return {
      fontVal:null,
      actionPage:null,
      userName:'',
      aiId:null,
      confirm:"下一步",
      s_lock:true,
      s_list: ['a', 'b', 'c'],
      s_result: ['a', 'b'],
      phoneNum: '',  // 绑定手机号
      captcha: '',  //验证码
      captchaText: '获取验证码',  // 文字提示
      captchaLocked: false,  // 获取验证码按钮锁
      time: 60,  // 倒计时时间
      checkStatus: false,  // 手机号是否允许绑定状态
      btnLock: false,  //  绑定手机号按钮锁
      mobilePhoneDolag: false,
      username: "",
      userEmail: "",
      columns: [
        {
          text: "男",
          value: "D_MALE"
        },
        {
          text: "女",
          value: "D_FEMALE"
        }
      ],
      sexPickerShow: false,
      birthdayPickerShow: false,
      usersex: "",
      userSexCode: "",
      userphone: "",
      userbirthday: "",
      currentDate: "",
      maxDate: new Date(),
      minDate: new Date(1900, 1, 1),
      userheight: "",
      userweight: "",
      userwaist: "",
      userInfo: {},
      memberInfo: [],
      showUserSelect: false,
      showMemberSelect: false,
      memberType: "",
      changeMemberInfo: [],
      haveTwo:false,
      actionType:null,
      currentId:null,
    };
  },
  methods: {
        bubbleSort(arr){
           var len = arr.length;
          for(var i = 0; i < len; i++){
              for(var j = 0; j < len - 1 - i; j++){
                  if(arr[j].showSeq > arr[j+1].showSeq) {//相邻元素两两对比
                      var temp = arr[j+1];//元素交换
                      arr[j+1] = arr[j];
                      arr[j] = temp;
                  }
              }
          }
          return arr;

        },
        closeDolag(){
            this.s_lock = true
            // console.log(this.s_lock)
        },
      // 无图多选列表 点击列表项
      handleCheckItem(child,checkList){
          let searchIndex = checkList.indexOf(child.id);
          if(searchIndex != -1){
              checkList.splice(searchIndex,1);
          }else{
              checkList.push(child.id);
          }
      },
        NumberCheck(num) {
            var str = num;
            var len1 = str.substr(0, 1);
            var len2 = str.substr(1, 1);
            //如果第一位是0，第二位不是点，就用数字把点替换掉
            if (str.length > 1 && len1 == 0 && len2 != ".") {
                str = str.substr(1, 1);
            }
            //第一位不能是.
            if (len1 == ".") {
                str = "";
            }
            //限制只能输入一个小数点
            if (str.indexOf(".") != -1) {
                var str_ = str.substr(str.indexOf(".") + 1);
                if (str_.indexOf(".") != -1) {
                    str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
                }
            }
            //正则替换，保留数字和小数点
            str = str.replace(/[^\d^\.]+/g,'')
            //如果需要保留小数点后两位，则用下面公式
//                str = str.replace(/\.\d\d$/,'')
            return str;
        },
        aaa(item){
          // console.log(">>>>>>>",item)
          if(item.fieldTypeDictCode == 'D_FEATURE_COLTYPE_INT' ){
             item.values = this.NumberCheck(item.values)
          }else{
             item.values = item.values
          }
          // this.fontVal = this.NumberCheck(this.fontVal);
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
          },
        setReserveStorage() {
            var sunData ={
                measureOpCode:null,
                partIds:null,
                routeName:null,
                yuyue:null,
                v_data:null
            }
            // console.log(0);
              if (!!Storage.get('reserveStorage')){
                  // console.log("777",Storage.get('reserveStorage').routeName)
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
        toggleSelected(index,index1) {
            // console.log("111");
             for (let i = 0, l = this.memberInfo[index].valueDtoList.length; i < l; i++) {
                 this.memberInfo[index].valueDtoList[i].defaultFlag = 0
             }
              this.memberInfo[index].valueDtoList[index1].defaultFlag = 1
              this.memberInfo[index].values = this.memberInfo[index].valueDtoList[index1].id
              // console.log(this.memberInfo[index].values)
            // this.memberInfo[index].choiceValues[index1].defaultFlag = !this.inBack[index].isActive;
        },
        muchToggleSelected(index,index1) {
             if(this.memberInfo[index].valueDtoList[index1].defaultFlag == 1){
               this.memberInfo[index].valueDtoList[index1].defaultFlag = 0

               for(let i= 0;i<this.memberInfo[index].valuesArr.length;i++){
                 if(this.memberInfo[index].valueDtoList[index1].id == this.memberInfo[index].valuesArr[i]){
                     this.memberInfo[index].valuesArr.splice(i,1)
                 }
               }
             }else{
               this.memberInfo[index].valueDtoList[index1].defaultFlag = 1
               this.memberInfo[index].valuesArr.push(this.memberInfo[index].valueDtoList[index1].id)
             }
             this.memberInfo[index].values =this.memberInfo[index].valuesArr.join(',')
             console.log(this.memberInfo[index].values)
        },
    toggle(val) {
      // console.log(val)
    },
    // 身型数据中数字类型的输入框中的值的输入限制
    typeLimit(item, e) {
      // console.log(item.values, item.fieldTypeDictCode)
      if(e.type=="change" && !!item.fieldLength){
        item.values = item.values.substring(0, item.fieldLength)
      }
      if (item.fieldTypeDictCode === 'D_FEATURE_COLTYPE_INT')
      {
         item.values = item.values.replace(/[^0-9.]+/, '')
      }
      if(!!item.minValue){
         if(parseFloat(item.values)<parseFloat(item.minValue)){
             Toast('请输入不小于' + item.minValue)
             item.values = ''
         }
      }
      if(!!item.maxValue){
         if(parseFloat(item.values)>parseFloat(item.maxValue)){
             Toast('请输入不大于' + item.maxValue)
             item.values = ''
         }
      }
    },
    //  校验身型数据中数字类型的输入框中的值
    typeCheck(item) {
      if(!item.customValue) return
      if (item.fieldType !== 'D_INTEGER') {
        // if (this.scrollTop > 0) window.scroll(0, this.scrollTop)
        return
      }
      let rule = /^[0-9]+(.[0-9]{1,3})?$/
      if (!rule.test(item.customValue)) {
        Toast(item.customName + '只允许输入不超过三位小数的数字~')
        item.customValue = ''
        return false
      } else {
        if (!item.customValue) {
          Toast(item.customName + '只允许输入不超过三位小数的数字~')
          item.customValue = ''
          return false
        }
        if (!!item.maxValue) {
          if (Number(item.customValue) > Number(item.maxValue)) {
            Toast(item.customName + '的最大值不能超过' + item.maxValue)
            item.customValue = ''
            return
          }
        }
        if (!!item.minValue) {
          if (Number(item.customValue) < Number(item.minValue)) {
            Toast(item.customName + '的最小值为' + item.minValue)
            item.customValue = ''
            return
          }
        }
        item.customValue = Number(item.customValue)
        // if (this.scrollTop > 0) window.scroll(0, this.scrollTop)
      }
    },
    //  输入框聚焦
    getFoucs() {
      // this.$refs.loseFocus.blur()
      // console.log(this.$refs)
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || window.scrollY
      }
    },
    // 解决ios弹起软键盘后影响页面
    // resetPage() {
    //   if (/iPhone|iPad|iPod/.test(navigator.userAgent) && this.scrollTop > 0) {
    //       window.scroll(0, this.scrollTop)
    //   }
    // },
    //  校验手机号是否绑定
    checkPhone() {
      if (this.captchaLocked === true) {
        return
      }
      // 校验手机号正确性
      if (!isPhone(this.phoneNum)) {
        Toast('请填写正确的手机号')
        return
      } else {
        let data = {
          ctmUsrId: Storage.get('USER_INFO').ctmUsrId,
          mobile: this.phoneNum,
          buscontsId: baseConstant.busContsCode
        }
        UserService.checkPhone(data).then((res) => {
          this.checkStatus = true
          this.getCaptcha()
        }, (err) => {
          Toast('该手机号已绑定')
        })
      }
    },
    // 获取验证码
    getCaptcha() {
      if (this.captchaLocked === true || this.checkStatus === false) { // 判断是否可以发送验证码
        return
      }
      this.captchaLocked = true
      let phone = this.phoneNum
      let data = {
        mobile: phone
      }
      UserService.getCaptcha(data).then((res) => {
      }, (err) => { })
      this.countDown()
    },
    // 倒计时
    countDown() {
      let that = this
      that.captchaLocked = true
      that.captchaText = '验证码已发送'
      let interval = window.setInterval(function () {
        that.captchaText = '重新获取' + that.time + 's'
        if ((that.time--) <= 0) {
          that.time = 60
          that.captchaLocked = false
          that.captchaText = '获取验证码'
          window.clearInterval(interval)
        }
      }, 1000)
    },
    // 绑定手机号
    bindPhone() {
      this.$emit('watchChild', '我是从子组件传过来的内容！！！');
      if (this.btnLock === true) {
        return
      }
      this.btnLock = true
      if (!isPhone(this.phoneNum)) {
        Toast('请填写正确的手机号')
        this.btnLock = false
        return false
      }
      if (this.checkStatus == false) {
        Toast('该手机号已经被绑定了~')
        this.btnLock = false
        return false
      }
      if (!this.captcha) {
        Toast('请先填写验证码')
        this.btnLock = false
        return false
      }
      let data = {
        mobilePhone: this.phoneNum,
        registCode: this.captcha,
        verifyType: "D_VERIFYLOG"
      }
      //  验证手机号和验证码
      UserService.checkCaptcha(data).then(() => {
        // 绑定手机号
        let bindData = {
          mobile: this.phoneNum
        }
        UserService.bindMobile(bindData).then(() => {
          Toast('绑定手机号成功~')
          this.mobilePhoneDolag = false
          this.s_lock = true
          this.putUserInfo()
          //this.$router.push("/member-center")
          // window.history.go(-1)
        }, () => {
          Toast('绑定手机出错~')
        })
      }, (err) => {
        Toast('手机验证码错误')
      }).then(() => {
        this.btnLock = false
      })
    },

    //      取消性别和生日弹窗
    onCancel(attr) {
      this[attr] = false;
      this.showUserSelect = false
    },

    //      性别change事件
    onSexChange(picker, value, index) {
      this.sexName = value;
    },

    //      性别confirm事件
    onSexConfirm() {
      if (!this.sexName) {
        //          没有选择时点击确定默认选中第一项
        this.sexName = this.columns[0];
      }
      this.usersex = this.sexName.text;
      this.userSexCode = this.sexName.value;
      this.sexPickerShow = false;
    },
    //      生日change事件
    onBirthday(picker, values, index) {
      this.birthday = picker.getValues();
    },

    //     生日confirm事件
    onBirthdayConfirm() {
      if (!this.birthday) {
        //          没有选择时点击确定默认选中第一项
        this.birthday = [
          this.minDate.getFullYear(),
          ("0" + parseInt(this.minDate.getMonth() + 1)).slice(-2),
          ("0" + this.minDate.getDate()).slice(-2)
        ];
      }
      this.userbirthday =
        this.birthday[0] + "-" + this.birthday[1] + "-" + this.birthday[2];
      this.birthdayPickerShow = false;
    },
    //  获取个人信息
    getUserInfo() {
      let data = {};
      UserService.getUserInfo(data).then((res) => {
        this.userInfo = res;
        this.username = !!res.usrName ? res.usrName : "";
        this.userEmail = !!res.email ? res.email : "";
        if (!!res.sexCode && !!res.sexName) {
          this.userSexCode = res.sexCode;
          this.usersex = res.sexName;
        }
        this.userbirthday = !!res.solarcalendar ? res.solarcalendar : "";
        this.userphone = res.mobilePhone;
      });
    },
    //  修改个人信息
    async putUserInfo() {
      let map = {};
      let arr = [];
      let lock = true;
      // try {
           if (!this.userName){
            Toast("请填写姓名");
            lock = false;
            return
          }
          //  this.memberInfo.forEach((item) => {
            for(var m = 0; m< this.memberInfo.length;m++ ){
          //  会员属性
          // console.log("this.userName",this.memberInfo)
          if (this.memberInfo[m].mustFlag == 1) {
            // if (item.values == ''|| this.values == null) {
            // if (item.values == ''||this.values == null) {
            //   console.log("11所有走item",item)
            //   Toast("请填写" + item.featureName);
            //   lock = false;
            //   throw new Error("EndIterative");
            // }
            if(this.memberInfo[m].inputClassDictCode == 'D_FEATURE_WRITETYPE_SELECT' && this.memberInfo[m].selectClassDictCode == 'D_FEATURE_CHOTYPE_OPEN' && this.memberInfo[m].unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'){
              if(this.memberInfo[m].valuesArr.length == 0){
                Toast("请填写" + this.memberInfo[m].featureName);
                lock = false;
                return;
              }
            }else{
              if (this.memberInfo[m].values == '' || this.memberInfo[m].values == null || this.memberInfo[m].values == undefined) {
                Toast("请填写" + this.memberInfo[m].featureName);
                lock = false;
                return;
              }
            }
          }

            }
          // });
          // if(item.inputClassCode == 'D_SELECTBOX' && item.selectClassCode == 'D_FEATURE_CHOTYPE_OPEN' && item.unfontClassCode == 'D_MULTISELECT'){
          //   if(item.customValueArr.length != 0){
          //     for(let m = 0;m<item.customValueArr.length;m++){
          //        map.customCode = item.customCode;
          //        map.customValue = item.customValueArr[m];
          //        arr.push(map);
          //        map = {};
          //     }
          //   }
          // }else{
          //   map.customCode = item.customCode;
          //   map.customValue = item.customValue;
          //   arr.push(map);
          //   map = {};
          // }

      // } catch(e) {
      //     if(e.message!="EndIterative") throw e;
      // };
      let saleMeasure = {}
      let data = {
        //  用户信息
        solarCalendarStr: this.userbirthday,
        sexCode: this.userSexCode,
        email: this.userEmail,
        usrCode: this.username
      };
      if (lock == true && this.s_lock == true) {
        this.s_lock = false
        let res = await UserService.getUserInfo({});
        if (!!res.mobilePhone) {
          if (typeof this.cb === "function") {
            if (this.chichun == 1) {
              this.$router.replace({
                name: 'submitSuccess',
                path: '/submitSuccess',
                params: {
                  billCode: this.otherBillCode,
                  type: this.s_type
                }
              })
            } else {
              saleMeasure = await this.cb();
            }
          }
          // sunjd
          let Message =[]
          for(var k = 0;k<this.memberInfo.length;k++){
             var v_data = {
                "vipFeatureInfoId": "",
                "featureCode": "",
                "values": null
             }

             if (this.memberInfo[k].id !="" || this.memberInfo[k].featureCode !=""){
                v_data.vipFeatureInfoId = this.memberInfo[k].id
                // console.log(v_data.vipFeatureInfoId)
                v_data.featureCode = this.memberInfo[k].featureCode

                if(this.memberInfo[k].fieldTypeDictCode == 'D_FEATURE_COLTYPE_INT'){
                  v_data.values = parseFloat(this.memberInfo[k].values)
                }else{
                  v_data.values = this.memberInfo[k].values
                  if (this.memberInfo[k].selectClassDictCode == 'D_FEATURE_CHOTYPE_OPEN' &&  this.memberInfo[k].showPicFlag == 0 &&this.memberInfo[k].unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE') {

                     v_data.values =this.memberInfo[k].valuesArr.join(',')
                  }
                }
             }
             Message.push(v_data)
          }
          let UUData ={
              "usrName": this.userName,
              "features": Message
          }
          // console.log("all below",this.aiId)
          if(this.aiId != '' && this.aiId != null){
              this.$set(UUData,"id",this.aiId);
          }
          // go 第二步  走编辑

          if(!!this.haveTwo && this.$route.params.fromPage == 'aiCountBody'){
                // console.log("走编辑-----》",this.$route.params)
                // console.log("提交的东西",UUData)
                var mdata ={
                    userName:this.$route.params.usrName,
                    aiId:this.$route.params.aiId,
                    fromPage:"aiCountBody",
                    data:this.$route.params.data,
                    measureOpCode:Storage.get('reserveStorage').measureOpCode,
                          liangti:UUData,
                          yuyue:Storage.get('reserveStorage').yuyue
                }
                if(this.actionType == 'goodOrder'){
                    this.$set(mdata, "fromType",'goodOrder');
                }
                this.$router.push({
                     name:'bodyFeature',
                      params: mdata,
                      query:Storage.get('reserveStorage').v_data

              })
            return
          }
          // add
          if(!!this.haveTwo && this.actionPage == 'newAdd'){
            //  console.log("newAddnewAddnewAddnewAdd")
                this.$router.push({
                     name:'bodyFeature',
                      params: {
                          measureOpCode:Storage.get('reserveStorage').measureOpCode,
                          liangti:UUData,
                          yuyue:Storage.get('reserveStorage').yuyue,
                          actionPage:"newAdd"
                      },
                      query:Storage.get('reserveStorage').v_data

              })
            return
          }
          if(this.haveTwo){
                this.$router.push({
                     name:'bodyFeature',
                      params: {
                          measureOpCode:Storage.get('reserveStorage').measureOpCode,
                          liangti:UUData,
                          yuyue:Storage.get('reserveStorage').yuyue,
                          fromType:'goodOrder'
                      },
                      query:Storage.get('reserveStorage').v_data

              })
            return
          }
          // actionType 直接提交
          // console.log("yuhong",this.actionType)

          if(this.actionType == 'goodOrder'){
              this.$router.replace({
                     name:Storage.get('reserveStorage').routeName,
                      params: {
                          measureOpCode:Storage.get('reserveStorage').measureOpCode,
                          liangti:UUData,
                          yuyue:Storage.get('reserveStorage').yuyue
                      },
                      query:Storage.get('reserveStorage').v_data
              })
             return
          }
          var cData = {
                  "id":UUData.id,
                  "usrName": UUData.usrName,
                  "features": UUData.features
              }
          // let memberData = {
          //   customs: arr,
          //   saleMeasureHdId: saleMeasure.id
          // };
          UserService.updateAiMemberBodyInfo(cData).then((res) => {
            //  修改会员信息
            if (res && res !== '') {
              this.$router.replace({
                name:'aiCountBody',
                query:{
                  addData:res
                }
              })
              // this.$nextTick(() => {
              //   this.getUserInfo();
              //   this.getMemberInfo();
              // });
              }
              if(!!cData.id){
                Toast("编辑成功");
              }else{
                Toast("新增成功");
              }
          });
          // _that.$emit('watchChild', '我是从子组件传过来的内容！！！');
          // this.updateUser(data, memberData)
          this.s_lock =false
        }
        else {
          this.mobilePhoneDolag = true
        }
      }
    },
    updateUser(data, memberData) {
      if (memberData.saleMeasureHdId != undefined && memberData.saleMeasureHdId != null && memberData.saleMeasureHdId != '') {
        UserService.updateMemberBodyInfo(memberData).then((res) => {
          //  修改会员信息
          if (res && res !== 0) {
            this.$nextTick(() => {
              this.getUserInfo();
              this.getMemberInfo();
            });
          }
          Toast("新增成功~");
        });
      } else {
        // sjd
        var s_data = {
          billCode: this.otherBillCode,
          spVipCustomsSaveDto: memberData,
          usrId: Storage.get('USER_INFO').usrId,
          ownCompanyId: Storage.get("COMPANYID").company_id,
          companyId: Storage.get("COMPANYID").company_id
        }
        UserService.updateChimaInfo(s_data).then((res) => {
          //  修改会员信息
          if (res && res !== 0) {
            this.$nextTick(() => {
              this.getUserInfo();
              this.getMemberInfo();
            });
          }
          Toast("修改信息成功~");
        });
      }
    },
    //  获取会员自定义属性
    getMemberInfo() {
      let data = {
        partCodes:Storage.get('toReserveParams').goodCodes
        // partCodes: this.partIds
      };
      UserService.getAiMemberInfo(data).then((res) => {
        let _length = res.length
        var _data = []
        // console.log(this.$route.params)

        // 编辑
        if(this.$route.params.fromPage == 'aiCountBody'){

            this.userName = this.$route.params.userName
            this.$store.commit('aiMeasureBody/setData',{
                storeKey: 'aiUserName',
                storeValue: this.userName
            })
            this.aiId = this.$route.params.aiId

            for (let key in res){
                for(var i= 0; i<this.$route.params.data.length;i++){
                  if(res[key].id == this.$route.params.data[i].id){
                     if(res[key].featureTypeDictCode == "D_FEATURE_TYPE_BODY"){
                        this.haveTwo = true
                        this.confirm ='下一步'
                     }
                     if(res[key].featureTypeDictCode == "D_FEATURE_TYPE_BASE"){
                     this.$set(res[key], "values",'');
                     this.$set(res[key], "value",'');
                     this.$set(res[key], "valuemName",'');
                     this.$set(res[key], "valuesArr",[]);
                     if(res[key].selectClassDictCode === 'D_FEATURE_CHOTYPE_DOWN'){
                       if(!this.$route.params.data[i].valueIds){
                          if(!!res[key].valueDtoList){
                            for(var l = 0; l<res[key].valueDtoList.length;l++){
                                if(res[key].valueDtoList[l].defaultFlag == 1){
                                  res[key].valuesArr.push(res[key].valueDtoList[l].id)
                                  res[key].values = res[key].valueDtoList[l].id
                                  res[key].valuemName =res[key].valueDtoList[l].valuemName
                                }
                            }
                          }
                        }else{
                          res[key].values = this.$route.params.data[i].valueIds
                          res[key].valuemName = this.$route.params.data[i].values
                        }
                     }
                     else if(res[key].selectClassDictCode === 'D_FEATURE_CHOTYPE_OPEN'){
                        //  如果没有值的情况下
                        // res[key].values = this.$route.params.data[i].valueIds
                        if(!this.$route.params.data[i].valueIds){
                          if(!!res[key].valueDtoList){
                            for(var l = 0; l<res[key].valueDtoList.length;l++){
                                if(res[key].valueDtoList[l].defaultFlag == 1){
                                  res[key].valuesArr.push(res[key].valueDtoList[l].id)
                                  res[key].values = res[key].valueDtoList[l].id
                                  res[key].valuemName =res[key].valueDtoList[l].valuemName
                                }
                            }
                          }
                        }
                        if(!!this.$route.params.data[i].valueIds){
                          // console.log("this.$route.params.data[i].valueIds",res[key])
                           if(res[key].unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_ONE'){
                              res[key].values = Number(this.$route.params.data[i].valueIds);
                              // console.log("more",res[key].values)
                              if(res[key].showPicFlag === 1){
                                 for(var n = 0 ; n <res[key].valueDtoList.length;n++){
                                     if(res[key].valueDtoList[n].id == this.$route.params.data[i].valueIds){
                                          res[key].valueDtoList[n].defaultFlag = 1

                                     }else{
                                          res[key].valueDtoList[n].defaultFlag = 0
                                     }
                                 }
                              }
                           }
                           if(res[key].unfoldClassDictCode == 'D_FEATURE_SHOWTYPE_MORE'){
                             var Arr = this.$route.params.data[i].valueIds.split(',');
                               Arr.forEach((item,index)=>{
                                   Arr[index] = Number(item);
                               })
                               res[key].valuesArr = Arr;
                               res[key].values = this.$route.params.data[i].valueIds
                               if(res[key].showPicFlag === 1){
                                 for(var n = 0 ; n <res[key].valueDtoList.length;n++){
                                   if(Arr.length > 0){
                                      for(var z = 0 ; z<Arr.length;z++){
                                        if(res[key].valueDtoList[n].id == Arr[z]){
                                              res[key].valueDtoList[n].defaultFlag = 1
                                              break;
                                        }else{
                                              res[key].valueDtoList[n].defaultFlag = 0
                                        }
                                      }
                                   }
                                 }

                              }
                           }

                        }
                        // console.log("oooo",res[key].valuesArr)
                     }else{
                       res[key].values = this.$route.params.data[i].values
                     res[key].valuemName = this.$route.params.data[i].values

                     }
                    
                     _data.push(res[key])
                     }
                  }
                }
            }
            _data = this.bubbleSort(_data);
            // console.log("有筛选出来",JSON.parse(JSON.stringify(_data)))
            this.memberInfo = _data;
            this.setFormValue()
          return
        }
        // 新增
        if(this.$route.params.actionPage == "newAdd"){
           this.actionPage = "newAdd"
        }
        for (let key in res){
            // console.log("有item哟",res[key])
            if(res[key].featureTypeDictCode == 'D_FEATURE_TYPE_BODY'&& res[key].showFlag === 1){
              this.haveTwo =true
            }
            if(res[key].featureTypeDictCode == 'D_FEATURE_TYPE_BASE'&& res[key].showFlag === 1){
              this.$set(res[key], "values",'');
              this.$set(res[key], "valuesArr",[]);
              this.$set(res[key], "valuemName",'');
              if(res[key].selectClassDictCode == 'D_FEATURE_CHOTYPE_OPEN' || res[key].selectClassDictCode == 'D_FEATURE_CHOTYPE_DOWN'){
                  if(!!res[key].valueDtoList){
                    for(var l = 0; l<res[key].valueDtoList.length;l++){
                        if(res[key].valueDtoList[l].defaultFlag == 1){
                          res[key].valuesArr.push(res[key].valueDtoList[l].id)
                          res[key].values = res[key].valueDtoList[l].id
                          res[key].valuemName =res[key].valueDtoList[l].valuemName
                        }
                    }
                  }
                  // console.log("脸好痛",res[key].valueDtoList)
              }
              _data.push(res[key])
            }
        }
        if(this.haveTwo == false){
            this.confirm = '保存'
        }
        // 无数据情况
        // if(res.length == 0){
        //       this.$router.replace({
        //          name:Storage.get('reserveStorage').routeName,
        //             params: {
        //                 measureOpCode:Storage.get('reserveStorage').measureOpCode,
        //                 liangti:'',
        //                 yuyue:Storage.get('reserveStorage').yuyue
        //             },
        //             query:Storage.get('reserveStorage').b_data
        //       })
        // }
        _data = this.bubbleSort(_data);
        this.memberInfo = _data;
        // console.log("排序后的数组",this.memberInfo)
        this.setFormValue()
      })
    },
    //  会员属性确认
    changeMember(value) {
      // console.log(value)
      // console.log(this.memberType)
      this.memberInfo.forEach((item) => {
        if (item.id === this.memberType && item.id == this.currentId) {
          // item.id = value.value;
          item.valuemName = value.text;
          item.values = value.value;
          // console.log(item.values)
        }
      });
      this.showMemberSelect = false;
      this.changeMemberInfo = [];
    },
    //  关闭会员属性弹窗
    cancelMemberInfo() {
      this.showMemberSelect = false;
      this.changeMemberInfo = [];
    },

    //  显示会员属性修改弹窗
    showPopup(item) {
      this.changeMemberInfo = []
      let arr = {};
      this.memberType = item.id;
      // console.log("有",item)
      this.currentId= item.id
      item.valueDtoList.forEach((item) => {
        arr.value = item.id;
        arr.text = item.valuemName;
        this.changeMemberInfo.push(arr);
        arr = {}
      });
      this.showMemberSelect = true;
    },

      //  初始化存储页面带参
      setPageParams() {
          if(!!this.$route.query) {
              let canSetData = false
              for(let key in this.$route.query) {
                  if(!!key) canSetData = true
              }
              if(canSetData) {
                  let aiParams = this.$store.state.aiMeasureBody.aiParams
                  aiParams.query = this.$route.query
                  this.$store.commit('aiMeasureBody/setData',{
                      storeKey: 'aiParams',
                      storeValue: aiParams
                  })
              }
          }
          if(!!this.$route.params) {
              let canSetData = false
              for(let key in this.$route.params) {
                  if(!!key) canSetData = true
              }
              if(!!canSetData) {
                  let aiParams = this.$store.state.aiMeasureBody.aiParams
                  aiParams.params = this.$route.params
                  this.$store.commit('aiMeasureBody/setData',{
                      storeKey: 'aiParams',
                      storeValue: aiParams
                  })
              }
          }
      },

      //  从仓库中获取数据并赋值给页面
      setFormValue() {
          //  获取表单信息
          let memberInfo = this.$store.state.aiMeasureBody.aiFormData
          if(!memberInfo || memberInfo.length < 0) {
              //  初始化填充仓库中的数据
              this.$store.commit('aiMeasureBody/setData', {
                  storeKey: 'aiFormData',
                  storeValue: this.memberInfo
              })
          }else{
              let memberInfoMap = {}
              //  从仓库中取值渲染给表单
              memberInfo.forEach((item) => {
                  memberInfoMap[item.id] = item
              })
              for(let key in memberInfoMap) {
                  this.memberInfo.forEach((item) => {
                      if(item.id == key) {
                          item.value = memberInfoMap[key].value
                          item.valuemName = memberInfoMap[key].valuemName
                          item.values = memberInfoMap[key].values
                          item.valuesArr = memberInfoMap[key].valuesArr
                          return
                      }
                  })
              }
          }
          //  获取用户名信息
          let usrName = this.$store.state.aiMeasureBody.aiUserName
          if(!!usrName) this.userName = usrName
      },

      //  同步更新vuex仓库内的数据
      setStoreInfo() {
          this.$store.commit('aiMeasureBody/setData', {
              storeKey: 'aiFormData',
              storeValue: this.memberInfo
          })
          this.$store.commit('aiMeasureBody/setData', {
              storeKey: 'aiUserName',
              storeValue: this.userName
          })
      }
  },
  created() {
    this.setPageParams()
    // console.log("走新增-----》",this.$route.params)
    // console.log("i'm ok11111")
    this.setReserveStorage()
    if (this.$route.query.fromType == 'goodOrder') {
        this.actionType = 'goodOrder'
    }
    this.getUserInfo();
    // console.log("晋江",this.$route.params.formPage)
    // if(this.$route)
    this.getMemberInfo();
  },
    beforeRouteLeave(to, from, next){
      this.setStoreInfo()
        next()
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.inputDown input{
     color: transparent!important;
      text-shadow: 0 0 0 #000;
}
.aiTop{
  margin-top: computed(30);
  margin-left:computed(30);
  margin-bottom: computed(28);
}
.aiImg{
  width: computed(28);
  height: computed(28);
}
.aiTitle{
  margin-left: computed(14);
  font-size:computed(28);
font-family:PingFang-SC-Bold;
font-weight:bold;
color:rgba(13,14,9,1);
}
// .top-margin{
//    border-top: computed1(20) solid  rgba(245,245,245,1);
// }
.pain-red{
  border: computed(3) solid rgba(196, 23, 23, 1);
}
.pain-white{
  border: computed(3) solid white;
}
.item-tip{

   position: absolute;
   top:computed1(-14);
   right: computed(-1);
   img{
    //  width: 100%;
    //  height: 100%;
    width: computed(24)!important;
   height: computed1(24)!important;

   }
}
.none-title{
  display: none;
}
.model-div {
  .mod-tel {
    .mod_img{
        width: computed(30);
        height: computed(30);
    }
    font-size: computed(30);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: #0d0e09;
    margin-bottom: computed(32);
  }
  ul{
    margin-left: computed(10);
    display: inline-block;
  }
  .mod-item {
    width: computed(203);
    max-height: computed(370);
    display: inline-block;
    float: left;
    margin-right: computed(30);
    margin-bottom: computed(10);
    &:nth-child(3n) {
         margin-right: computed(0);
        }
    .type-img {
      position: relative;
      width: computed(210);
      height: computed(210);
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .type-tel {
      font-size: computed(30);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(13, 14, 9, 1);
      margin-top: computed(20);
      margin-bottom: computed(17);
    }
    .type-content {
       text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
      max-height:computed1(70);
      font-size: computed(24);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }
  }
}
.box {
  width: computed(700);
  height: computed(400);
  padding: computed(20) 0;
}
.member-information {
  overflow: hidden;
  padding-bottom: computed(94);
  .bottom-btn3 {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height: computed(94);
    // padding: computed(11) computed(30);
    border: none;
    background: #ffffff;
    color: #ffffff;
    text-align: center;
    .btn-txt {
      font-size: computed(30);
      line-height: computed(72);
      background: rgba(196, 23, 23, 1);
    }
    z-index: 2;
  }
  .title {
    font-size: computed(28);
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    line-height: computed(36);
    margin: computed(30);
  }
  .detail-cell {
    box-sizing: border-box;
    display: flex;
    // height: computed(88);
    padding: 0 computed(30);
    position: relative;
    margin-bottom: computed(30);
    &:nth-child(1) {
      margin-top: computed(30);
    }
    &:last-child {
      border-bottom: none;
    }

    .cell-title {
      display: flex;
      flex: inherit;
      align-items: center;
      justify-content: inherit;
      min-width: computed(220);
      font-size: computed(30);
      line-height: computed(30);
      overflow: hidden;
      font-weight: 500;
      color: rgba(13, 14, 9, 1);
    }
    .cell-content {
      width: 100%;
      // margin-left: computed(10);
      text-align: left;
      // margin-top: computed(28);
      .user-img-cell {
        margin-top: computed(14);
        width: computed(72);
        height: computed(72);
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .label-text {
        padding: 0 computed(10);
        font-size: computed(30);
        line-height: computed(100);
        color: #0d0e09;
      }
      .color-gray {
        color: #d2d2d2;
      }
      .color-black {
        color: #0d0e09;
      }
      .van-radio {
        float: left;
        margin-top: computed(30);
        margin-right: computed(30);
        font-size: computed(28);
        line-height: computed(30);
      }
    }
    .cell-content input {
      background: rgba(246, 246, 246, 1);
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: computed(88);
      padding: 0 computed(32);
      border: none;
      font-size: computed(30);
      line-height: computed(88);
      color: #0d0e09;
      position: relative;
      /* 解决ios版微信浏览器的边框和阴影*/
      border-radius: 0;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      -webkit-appearance: none;
    }
  }
}
.red-star {
  color: red;
}
  .check-list{
    display: flex;
    flex-wrap: wrap;
    .check-item{
      text-align: center;
      border: computed(1) solid #999;
      line-height: computed(64);
      padding: 0 computed(15);
      min-width: computed(100);
      position: relative;
      font-size: computed(28);
      margin: 0 computed(25) computed(25) 0;
      &.selected{
        border-color: $maincolor;
        color: $maincolor;
      }
      img{
        position: absolute;
        top:0;
        right: 0;
        width: computed(24);
        height: computed(24);
      }
    }
  }
</style>