<template>
  <div class="member-information">
    <!--会员属性-->
    <div class="detail-cell"
     :class="[item.selectClassCode === 'D_ALISTOF' ? 'top-margin' : '']"
     v-for="(item, index)  in memberInfo" :key="index">
      <div
      :class="[item.selectClassCode === 'D_ALISTOF' && item.showPicFlag === 1 ? 'none-title' : 'cell-title']"
      >
        <span>{{item.customName}}</span>
        <span class="red-star" v-if="item.isRequired== true">*</span>
        <span v-else>&nbsp;</span>
      </div>
      <div
        class="cell-content"
        v-if="item.selectClassCode === 'D_DOWNBOX' "
        @click="showPopup(item)"
      >
        <input
          placeholder="请选择相关信息"
          class="van-field__control"
          v-model="item.customValueName"
          readonly="readonly"
        >
      </div>
      <div class="cell-content" v-if="item.inputClassCode === 'D_TEXTBOX' ">
        <input
          placeholder="请填写相关信息"
          class="van-field__control"
          :data-value="item.customValue"
          v-model="item.customValue"
          :value="item.customValueName"
          :type="item.fieldType === 'D_INTEGER' ? 'tel' : 'text'"
          @focus="getFoucs"
          @input="typeLimit(item,$event)"
          @blur="typeCheck(item)"
        >
      </div>
      <div class="cell-content radius" v-if="item.selectClassCode === 'D_ALISTOF' &&  item.showPicFlag === 0">
        <van-radio-group v-model="item.customValue" v-if="item.unfontClassCode == 'D_THERADIO'">
          <van-radio
            v-for="(val,index) in item.choiceValues"
            :name="val.valueCode"
            :key="index"
          >{{val.valueName}}</van-radio>
        </van-radio-group>
        <van-checkbox-group v-model="item.customValueArr" v-if="item.unfontClassCode == 'D_MULTISELECT'">
          <van-checkbox
            v-for="(val,index) in item.choiceValues"
            :name="val.valueCode"
            :key="index"
            @change="toggle(index)"
          >
            {{val.valueName}}
          </van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="cell-content model-div" v-if="item.selectClassCode === 'D_ALISTOF'  && item.showPicFlag === 1">
                <div >
                    <div class="mod-tel">
                        {{item.customName}}
                        <span class="red-star" v-if="item.isRequired== true">*</span>
                        <span v-else>&nbsp;</span>
                    </div>
                    <ul >
                          <li  class="mod-item" v-for="(item1, index1)  in item.choiceValues" :key="index1" >
                              <div v-if="item.unfontClassCode == 'D_THERADIO'" @click="toggleSelected(index,index1)">
                                <div class="type-img" :class="[ item1.choiceFlag == 1 ? 'pain-red' : 'pain-white']">
                                    <div class="item-tip" v-if="item1.choiceFlag == 1 "><img src="../assets/images/common/choose.png" alt=""></div>
                                    <img :src="getImg(item1.pictFileUrl)" alt="">
                                </div>
                                <div class="type-tel">{{item1.valueName}}</div>
                                <div class="type-content">{{item1.memo}}</div>
                              </div>
                              <div v-if="item.unfontClassCode == 'D_MULTISELECT'"  @click="muchToggleSelected(index,index1)">
                                <div class="type-img" :class="[item1.choiceFlag == 1 ? 'pain-red' : 'pain-white']">
                                    <div class="item-tip" v-if="item1.choiceFlag == 1"><img src="../assets/images/common/choose.png" alt=""></div>
                                    <img :src="getImg(item1.pictFileUrl)" alt="">
                                </div>
                                <div class="type-tel">{{item1.valueName}}</div>
                                <div class="type-content">{{item1.memo}}

                                </div>
                              </div>
                          </li> 
                    </ul>
                </div>
      </div>
    </div>
    <!--底部按钮-->
    <button class="bottom-btn3" @click="putUserInfo">
      <p class="btn-txt">提交</p>
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
    <van-popup v-model="mobilePhoneDolag">
      <div class="box">
        <div class="wrapper phone-box">
          <div class="form-box">
            <input type="tel" placeholder="请输入手机号" class="wd100" v-model="phoneNum">
          </div>
          <div class="form-box">
            <input type="tel" class="captcha-text wd70 fl" v-model="captcha" placeholder="请输入验证码">
            <button
              class="captcha-btn color-red wd30 fr"
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
import { UserService } from "../api/service";
import Storage from "../util/storage";
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
      changeMemberInfo: []
    };
  },
  methods: {
        toggleSelected(index,index1) {
             for (let i = 0, l = this.memberInfo[index].choiceValues.length; i < l; i++) {
                 this.memberInfo[index].choiceValues[i].choiceFlag = 0
             }
              this.memberInfo[index].choiceValues[index1].choiceFlag = 1
              this.memberInfo[index].customValue = this.memberInfo[index].choiceValues[index1].valueCode
            // this.memberInfo[index].choiceValues[index1].defaultFlag = !this.inBack[index].isActive;
        },
        muchToggleSelected(index,index1) {
             if(this.memberInfo[index].choiceValues[index1].choiceFlag == 1){
               this.memberInfo[index].choiceValues[index1].choiceFlag = 0
               
               for(let i= 0;i<this.memberInfo[index].customValueArr.length;i++){
                 if(this.memberInfo[index].choiceValues[index1].valueCode == this.memberInfo[index].customValueArr[i]){
                     this.memberInfo[index].customValueArr.splice(i,1)
                 }
               }
             }else{
               this.memberInfo[index].choiceValues[index1].choiceFlag = 1
               this.memberInfo[index].customValueArr.push(this.memberInfo[index].choiceValues[index1].valueCode)
             }
        },
    toggle1(index) {
      // this.$refs.checkboxes[index].toggle();
    },
    // 身型数据中数字类型的输入框中的值的输入限制
    typeLimit(item, e) {
      if (item.fieldType === 'D_INTEGER') item.customValue = item.customValue.replace(/[^0-9.]+/, '')
    },
    //  校验身型数据中数字类型的输入框中的值
    typeCheck(item) {
      if(!item.customValue) return
      if (item.fieldType !== 'D_INTEGER') {
        if (this.scrollTop > 0) window.scroll(0, this.scrollTop)
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
        if (this.scrollTop > 0) window.scroll(0, this.scrollTop)
      }
    },

    //  输入框聚焦
    getFoucs() {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || window.scrollY
      }
    },
    // 解决ios弹起软键盘后影响页面
    resetPage() {
      if (/iPhone|iPad|iPod/.test(navigator.userAgent) && this.scrollTop > 0) {
        window.scroll(0, this.scrollTop)
      }
    },
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
      this.memberInfo.forEach((item) => {
        //  会员属性
        if (item.isRequired == 1) {
          if(item.inputClassCode == 'D_SELECTBOX' && item.selectClassCode == 'D_ALISTOF' && item.unfontClassCode == 'D_MULTISELECT'){
            if(item.customValueArr.length == 0){
              Toast("必填项" + item.customName + "未填，请填写");
              lock = false;
              return;
            }
          }else{
            if (item.customValue == '' || item.customValue == null || item.customValue == undefined) {
              Toast("必填项" + item.customName + "未填，请填写");
              lock = false;
              return;
            }
          }
        }
        if(item.inputClassCode == 'D_SELECTBOX' && item.selectClassCode == 'D_ALISTOF' && item.unfontClassCode == 'D_MULTISELECT'){
          if(item.customValueArr.length != 0){
            for(let m = 0;m<item.customValueArr.length;m++){
               map.customCode = item.customCode;
               map.customValue = item.customValueArr[m];
               arr.push(map);
               map = {};
            }
          }
        }else{
          map.customCode = item.customCode;
          map.customValue = item.customValue;
          arr.push(map);
          map = {};
        }
        
      });
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
        if (res.mobilePhone !== null) {
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
               this.s_lock = false
            } else {
              saleMeasure = await this.cb();
              this.s_lock = false
            }
          }
          let memberData = {
            //  会员属性
            customs: arr,
            saleMeasureHdId: saleMeasure.id
          };
          // _that.$emit('watchChild', '我是从子组件传过来的内容！！！');
          this.updateUser(data, memberData)
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
          Toast("修改信息成功~");
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
        busContsCode: baseConstant.busContsCode,
        partCodes: this.partIds
      };
      UserService.getMemberInfo(data).then((res) => {
        let _length = res.length
        var _data = []
        for (let j = 0; j < _length; j++) {
          if (res[j].showFlag == 1) {
            _data.push(res[j])
          }
        }
        if(res.length == 0){
            this.$router.replace({
                name: 'submitSuccess',
                path: '/submitSuccess',
                params: {
                  billCode: this.otherBillCode,
                  type: this.s_type
                }
              })
        }
        this.memberInfo = _data;
      });
    },

    //  会员属性确认
    changeMember(value) {
      this.memberInfo.forEach((item) => {
        
        if (item.customCode === this.memberType) {
          item.customValue = value.value;
          item.customValueName = value.text;
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
      this.memberType = item.customCode;
      item.choiceValues.forEach((item) => {
        arr.value = item.valueCode;
        arr.text = item.valueName;
      
        this.changeMemberInfo.push(arr);
        arr = {}
      });
      this.showMemberSelect = true;
    }
  },
  created() {
    this.getUserInfo();
    this.getMemberInfo();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.top-margin{
   border-top: computed1(20) solid  rgba(245,245,245,1);
}
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
    height: computed(370);
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
      height:computed1(70);
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
      width: computed(140);
      min-width: computed(140);
      font-size: computed(30);
      line-height: computed(30);
      white-space: nowrap;
      overflow: hidden;
      font-weight: 500;
      color: rgba(13, 14, 9, 1);
    }
    .cell-content {
      width: 100%;
      // margin-left: computed(10);
      text-align: left;
      margin-top: computed(28);
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
</style>