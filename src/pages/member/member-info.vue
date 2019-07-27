<template>
    <div class="member-information">
        <div class="title">个人信息</div>
        <!--头像-->
        <div class="detail-cell">
            <label class="cell-title">头像</label>
            <div class="cell-content">
                <div class="fr user-img-cell">
                    <img :src="userInfo.photoThumb" onerror="errImg(event)" alt="">
                </div>
            </div>
        </div>
        <!--姓名-->
        <div class="detail-cell">
            <label class="cell-title">姓名</label>
            <div class="cell-content">
                <van-field
                v-model="username"
                type="text"
                clearable
                />
            </div>
        </div>
        <!--性别-->
        <div class="detail-cell">
            <label class="cell-title">性别</label>
            <div class="cell-content" @click="onShowpicker('sexPickerShow')">
                <p class="label-text">{{usersex}}</p>
            </div>
        </div>
        <!--手机号-->
        <div class="detail-cell">
            <label class="cell-title">手机号</label>
            <div class="cell-content">
                <!--<input v-model="usersex" type="" @click="onShowpicker('sexPickerShow')" disabled="disabled" >-->
                <p class="label-text color-gray">{{userphone}}<span class="fr pdL20 color-black" @click.stop="changePhone()">更换</span></p>
            </div>
        </div>
        <!--电子邮箱-->
        <div class="detail-cell">
            <label class="cell-title">电子邮箱</label>
            <div class="cell-content">
                <van-field
                    v-model="userEmail"
                    type="text"
                    @change="checkEmail"
                    clearable
                />
            </div>
        </div>
        <!--生日-->
        <div class="detail-cell">
            <label class="cell-title">生日</label>
            <div class="cell-content">
                <p class="label-text" @click="onShowpicker('birthdayPickerShow')">{{ userbirthday ? userbirthday : '请选择出生日期' }}</p>
            </div>
        </div>

        <div class="title" v-if="memberInfo.length > 0">身型信息</div>
        <!--会员属性-->
        <div class="detail-cell" :class="{'height-adj':item.selectClassCode === 'D_ALISTOF' }" v-for="item in memberInfo" :key="" v-if="item.showFlag === 1">
            <div class="cell-title" :class="{'heightAuto':item.selectClassCode === 'D_ALISTOF' }">
                <span>{{item.customName}}</span>
                <span class="cl-red" v-if="item.mustFlag === 1">*</span>
            </div>
            <div class="cell-content" v-if="item.selectClassCode === 'D_DOWNBOX' " @click="showPopup(item)">
                <input placeholder="请选择相关信息" class="van-field__control unshow" v-model="item.customValue" readonly="readonly">
                <label class="input-label">{{item.customValueName}}</label>
            </div>
            <div class="cell-content radius" v-if="item.selectClassCode === 'D_ALISTOF'">
                <van-radio-group v-model="item.customValue" class="clearfix" v-if="item.unfontClassCode === 'D_THERADIO'">
                    <van-radio v-for="(val,index) in item.choiceValues" :name="val.valueCode" :key="index">
                        <span class="min-width">{{val.valueName}}</span>
                    </van-radio>
                </van-radio-group>
                <van-checkbox-group v-model="item.customValueArr" v-if="item.unfontClassCode === 'D_MULTISELECT'">
                    <van-checkbox v-for="(val,index) in item.choiceValues" :name="val.valueCode" :key="index" @change="toggle(index)">
                        <span>{{val.valueName}}</span>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
            <div class="cell-content" v-if="item.inputClassCode === 'D_TEXTBOX' ">
                <van-field placeholder="请填写相关信息" class="van-field__control"
                   :data-value="item.customValue"
                   v-model="item.customValue"
                   :value="item.customValue"
                   :type="item.fieldType === 'D_INTEGER' ? 'tel' : 'text'"
                   @focus="getFoucs"
                   @input="typeLimit(item)"
                   @blur="typeCheck(item)"
                   clearable
                />
                <span class="unit-name" v-if="!!item.unitName">{{item.unitName}}</span>
            </div>
        </div>

        <!--性别弹窗-->
        <van-popup v-model="showUserSelect" position="bottom">
            <van-picker :columns="columns" @change="onSexChange" show-toolbar @cancel="onCancel('sexPickerShow')"
                        @confirm="onSexConfirm" class="picker-fixed" v-show="sexPickerShow"/>
        </van-popup>

        <!--生日弹窗-->
        <van-popup v-model="showUserSelect" position="bottom">
            <van-datetime-picker v-model="currentDate" type="date" :maxDate="maxDate" :min-date="minDate"
                                 @change="onBirthday" @cancel="onCancel('birthdayPickerShow')" @confirm="onBirthdayConfirm"
                                 class="picker-fixed" v-show="birthdayPickerShow"/>
        </van-popup>

        <!--底部按钮-->
        <div class="bottom-btn2" @click="putUserInfo">
            <p class="btn-txt">提交</p>
        </div>

        <!--会员属性选择弹窗 begin-->
        <van-popup v-model="showMemberSelect" position="bottom">
            <van-picker :columns="changeMemberInfo" show-toolbar @cancel="cancelMemberInfo" @confirm="changeMember"
                        class="picker-fixed"></van-picker>
        </van-popup>
        <!--会员属性选择弹窗 end-->

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
        CheckboxGroup,
        Checkbox
    } from "vant";
    import {UserService} from "../../api/service";
    import Storage from "../../util/storage";

    export default {
        components: {
            "van-field": Field,
            "van-icon": Icon,
            "van-picker": Picker,
            "van-datetime-picker": DatetimePicker,
            "van-popup": Popup,
            "van-radio-group": RadioGroup,
            "van-radio": Radio,
            "van-checkbox-group": CheckboxGroup,
            "van-checkbox": Checkbox,
        },
        data() {
            return {
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
                userSexCode: null,
                userphone: "",
                userbirthday: "",
                currentDate: new Date(1985, 0, 1),
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
                scrollTop:0,  // 滚动距离
                btnLock: false  // 按钮锁
            };
        },
        methods: {

            // 检查电子邮箱格式
            checkEmail () {
                if(!isEmail(this.userEmail)) {
                    Toast('请输入正确的电子邮箱~')
                    this.userEmail = ''
                }
            },

            //      生日和性别弹窗显示
            onShowpicker(attr) {
                this[attr] = true;
                this.showUserSelect = true
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
                this.onCancel('sexPickerShow')
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
                        this.currentDate.getFullYear(),
                        ("0" + parseInt(this.currentDate.getMonth() + 1)).slice(-2),
                        ("0" + this.currentDate.getDate()).slice(-2)
                    ];
                }
                this.userbirthday =
                    this.birthday[0] + "-" + this.birthday[1] + "-" + this.birthday[2];
                this.onCancel('birthdayPickerShow')
            },

            //      跳转更改绑定手机号
            changePhone() {
                this.$router.push("/change-phone");
            },

            //  获取个人信息
            getUserInfo() {
                let data = {};
                UserService.getUserInfo(data).then((res) => {
                    this.userInfo = res;
                    this.username = !!res.vipName ? res.vipName : null;
                    this.userEmail = !!res.email ? res.email : null;
                    if (!!res.sexCode && !!res.sexName) {
                        this.userSexCode = res.sexCode;
                        this.usersex = res.sexName;
                    }
                    this.userbirthday = !!res.solarcalendar ? res.solarcalendar : null;
                    this.userphone = res.mobilePhone;
                });
            },

            //  修改个人信息
            putUserInfo() {
                if(this.btnLock) return
                this.btnLock = true
                let map = {};
                let arr = [];
                for(let i=0; i<this.memberInfo.length; i++) {
                    let item = this.memberInfo[i]
                    if(item.showFlag === 1) {    //  只选择前端显示切不带图片的属性
                        if(item.mustFlag === 1) {    //  必填属性校验
                            if(item.unfontClassCode === 'D_MULTISELECT' && item.selectClassCode === 'D_ALISTOF') {    // 多选框模式
                                if(item.customValueArr.length >0){
                                    for(let j = 0; j<item.customValueArr.length; j++){
                                        map.customCode = item.customCode;
                                        map.customValue = item.customValueArr[j];
                                        arr.push(map);
                                        map = {};
                                    }
                                }else{
                                    Toast('请填写' + item.customName)
                                    this.btnLock = false
                                    return false
                                }
                            }else if(!item.customCode || !item.customValue) {
                                Toast('请填写' + item.customName)
                                this.btnLock = false
                                return false
                            }else{
                                map.customCode = item.customCode;
                                map.customValue = item.customValue;
                                arr.push(map);
                                map = {};
                            }
                        }else{
                            if(item.unfontClassCode === 'D_MULTISELECT' && item.selectClassCode === 'D_ALISTOF') {    // 多选框模式
                                if(item.customValueArr.length >0){
                                    for(let j = 0; j<item.customValueArr.length; j++){
                                        map.customCode = item.customCode;
                                        map.customValue = item.customValueArr[j];
                                        arr.push(map);
                                        map = {};
                                    }
                                }
                            }else{
                                //  非必填属性直接添加进数组
                                map.customCode = item.customCode;
                                map.customValue = item.customValue;
                                arr.push(map);
                                map = {};
                            }
                        }
                    }
                }
                let data = {
                    //  用户信息
                    solarCalendarStr: this.userbirthday,
                    sexCode: this.userSexCode,
                    email: this.userEmail,
                    usrCode: this.username
                };
                let memberData = {
                    //  会员属性
                    customs: arr
                };
                UserService.updateUserInfo(data)
                    .then((res) => {}, (err) => {
                        this.btnLock = false
                    })
                    .then(() => {
                        UserService.updateMemberInfo(memberData).then((res) => {
                            //  修改会员信息
                            if (res && res !== 0) {
                                this.$nextTick(() => {
                                    this.getUserInfo();
                                    this.getMemberInfo();
                                });
                            }
                            this.btnLock = false
                            Toast("修改信息成功~");
                        }),(err) => {
                            Toast(err.errorMsg)
                        };
                    })
                    .then(() => {
                        this.btnLock = false
                    });
            },

            //  获取会员自定义属性
            getMemberInfo() {
                let data = {
                    busContsCode: baseConstant.busContsCode
                };
                UserService.getMemberInfo(data).then((res) => {
                    this.memberInfo = res;
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
            },

            // 身型数据中数字类型的输入框中的值的输入限制
            typeLimit(item){
                if(item.fieldType === 'D_INTEGER') item.customValue = item.customValue.replace(/[^0-9.]+/,'')
            },

            //  校验身型数据中数字类型的输入框中的值
            typeCheck(item) {
                if(!item.customValue) return
                if(item.fieldType !== 'D_INTEGER') {
                    if(this.scrollTop > 0) window.scroll(0,this.scrollTop)
                    return
                }
                let rule = /^[0-9]+(.[0-9]{1,3})?$/
                if(!rule.test(item.customValue)) {
                    Toast(item.customName + '只允许输入不超过三位小数的数字~')
                    item.customValue = ''
                    return false
                }else{
                    if(!item.customValue) {
                        Toast(item.customName + '只允许输入不超过三位小数的数字~')
                        item.customValue = ''
                        return false
                    }
                    if(!!item.maxValue) {
                        if(Number(item.customValue) > Number(item.maxValue)) {
                            Toast(item.customName + '的最大值不能超过' + item.maxValue)
                            item.customValue = ''
                            return
                        }
                    }
                    if(!!item.minValue) {
                        if(Number(item.customValue) < Number(item.minValue)) {
                            Toast(item.customName + '的最小值为' + item.minValue)
                            item.customValue = ''
                            return
                        }
                    }
                    item.customValue = Number(item.customValue)
                    if(this.scrollTop > 0) window.scroll(0,this.scrollTop)
                }
            },

            //  输入框聚焦
            getFoucs(){
                if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                    this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || window.scrollY
                }
            },

            // 解决ios弹起软键盘后影响页面
            resetPage(){
                if (/iPhone|iPad|iPod/.test(navigator.userAgent) && this.scrollTop > 0) {
                    window.scroll(0,this.scrollTop)
                }
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
    .member-information{
        overflow: hidden;
        padding-bottom: computed(94);
        .title{
            font-size: computed(36);
            line-height: computed(36);
            margin: computed(30);
            color: #0D0E09;
            font-weight: bold;
        }
        .detail-cell{
            box-sizing: border-box;
            display: flex;
            height: computed(100);
            min-height: computed(100);
            margin: 0 computed(30);
            position: relative;
            border-bottom: solid 1px #e6e6e6;
            &:nth-child(1) {
             margin-top: computed(30);
            }
            &:last-child{
             border-bottom: none;
            }
            .cell-title{
                display: flex;
                flex: inherit;
                align-items: center;
                justify-content: inherit;
                width: computed(140);
                min-width: computed(140);
                font-size: computed(28);
                line-height: computed(30);
                color: #0D0E09;
                white-space: nowrap;
                overflow: hidden;
                &.heightAuto{
                    align-items: inherit;
                     margin-top: computed(30);
                 }
            }
            .cell-content{
                box-sizing: border-box;
                width: 100%;
                position: relative;
                margin-left: computed(10);
                padding-right: computed(40);
                text-align: left;
                .user-img-cell{
                    margin-top: computed(14);
                    width: computed(72);
                    height: computed(72);
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .label-text{
                    padding: 0 computed(10);
                    font-size: computed(30);
                    line-height: computed(100);
                    color: #0D0E09;
                }
                .color-gray{
                    color: #D2D2D2;
                }
                .color-black{
                    color: #0D0E09;
                }
                .van-radio{
                    float: left;
                    margin: computed(30);
                    margin-left: 0;
                    font-size: computed(28);
                    line-height: computed(30);
                }
                .min-width{
                    min-width: computed(90);
                }
                .unshow{
                    opacity: 0;
                    z-index: 2;
                }
                .input-label{
                    position: absolute;
                    top: 0;
                    left: 0;
                    font-size: computed(30);
                    line-height: computed(100);
                    color: #0D0E09;
                    z-index: 1;
                }
                .unit-name{
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: computed(30);
                    line-height: computed(100);
                    color: #D2D2D2;
                    z-index: 1;
                }
            }
            .cell-content input{
                display: block;
                box-sizing: border-box;
                width: 100%;
                height: computed(98);
                padding: 0 computed(10);
                border: none;
                font-size: computed(30);
                line-height: computed(100);
                color: #0D0E09;
                position: relative;
                /* 解决ios版微信浏览器的边框和阴影*/
                border-radius: 0;
                box-shadow:0 0 0 rgba(0,0,0,0);
                -webkit-appearance:none;
            }
        }
        .cl-red{
            color: #c41717;
        }
        .clearfix:after{
            content:".";
            display:block;
            height:0;
            clear:both;
            visibility:hidden
        }
        .height-adj{
            height: auto;
        }
    }

</style>