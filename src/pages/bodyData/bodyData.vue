<template>
    <div class="member-information">
        <div class="title" v-if="memberInfo.length > 0">请填写身材数据，为您匹配更合适的量体师</div>
        <!--会员属性-->
        <div class="detail-cell" v-for="(item,index) in memberInfo" :key="index">
            <div class="cell-title">
                <span class="red-star" v-if="item.mustFlag==1">*</span><span v-else>&nbsp;</span><span>{{item.customName}}</span>
            </div>
            <div class="cell-content" v-if="item.selectClassCode === 'D_DOWNBOX' " @click="showPopup(item)">
                <input placeholder="请选择相关信息" class="van-field__control" v-model="item.customValue" readonly="readonly">
            </div>
            <div class="cell-content radius" v-if="item.selectClassCode === 'D_ALISTOF' ">
                <van-radio-group v-model="item.customValue">
                    <van-radio v-for="(val,index) in item.choiceValues" :name="val.valueCode" :key="index">
                        {{val.valueName}}
                    </van-radio>
                </van-radio-group>
            </div>
            <div class="cell-content" v-if="item.inputClassCode === 'D_TEXTBOX' ">
                <input placeholder="请填写相关信息" class="van-field__control" v-model="item.customValue" :type="item.fieldType === 'D_INTEGER' ? 'number' : 'text'">
            </div>
        </div>
        <!--底部按钮-->
        <div class="bottom-btn3" @click="putUserInfo">
            <p class="btn-txt">提交</p>
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
        Radio
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

            //      跳转更改绑定手机号
            changePhone() {
                this.$router.push("/change-phone");
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
            putUserInfo() {
                let map = {};
                let arr = [];
                let lock = true;
                this.memberInfo.forEach((item) => {
                    //  会员属性
                    if(item.mustFlag == 1){
                        
                        if ( item.customValue == ''|| item.customValue == null||item.customValue == undefined){
                            Toast("必填项" + item.customName +"未填，请填写");
                            lock = false;
                            return;
                        }
                    }
                    console.log(item);
                    map.customCode = item.customCode;
                    map.customValue = item.customValue;
                    arr.push(map);
                    map = {};
                });
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
                let _that = this
                if(lock == true){
                UserService.updateUserInfo(data)
                    .then((res) => {}, (err) => {})
                    .then(() => {
                        UserService.updateMemberInfo(memberData).then((res) => {
                            //  修改会员信息
                            if (res && res !== 0) {
                                this.$nextTick(() => {
                                    this.getUserInfo();
                                    this.getMemberInfo();
                                });
                            }
                            if(this.$route.query.fromPage =='settlement'){
                                let billCode = this.$route.query.billCode
                                this.$router.push({
                                    name:"waitShip",
                                    params:{
                                        billCode:this.$route.query.billCode,
                                        from:'bodyData'
                                    }
                                })
                                // this.$router.push("/waitShip?from=bodyData&billCode=" + billCode);
                            }
                            Toast("修改信息成功~");
                        });
                    });
                }
            },

            //  获取会员自定义属性
            getMemberInfo() {
                let data = {
                    busContsCode: baseConstant.busContsCode
                };
                UserService.getMemberInfo(data).then((res) => {
                     let _length = res.length
                    var _data = []
                    for(let j= 0 ;j<_length;j++){
                       if(res[j].showFlag ==1){
                           _data.push(res[j])
                       } 
                    }
                    console.log("$$$$",_data)
                    this.memberInfo = _data;
                });
            },

            //  会员属性确认
            changeMember(value) {
                this.memberInfo.forEach((item) => {
                    if (item.customCode === this.memberType) {
                        item.customValue = value;
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
                let arr = {};
                this.memberType = item.customCode;
                item.choiceValues.forEach((item) => {
                    arr = item.valueCode;
                    this.changeMemberInfo.push(arr);
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
    .red-star{
            color: red;
    }
    .member-information{
        overflow: hidden;
        padding-bottom: computed(94);
        .bottom-btn3{
            box-sizing: border-box;
            height: computed(94);
            padding: computed(11) computed(30);
            border: none;
            background: #ffffff;
            color: #ffffff;
            text-align: center;
            .btn-txt{
                font-size: computed(30);
                line-height: computed(72);
                background:rgba(196,23,23,1);
            }
            z-index: 2;
        }
        .title{
            font-size:computed(28);
            font-weight:500;
            color:rgba(153,153,153,1);
            line-height: computed(36);
            margin: computed(30);
        }
        .detail-cell{
            box-sizing: border-box;
            display: flex;
            height: computed(88);
            margin: 0 computed(30);
            position: relative;
            margin-bottom: computed(30);
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
                font-size: computed(30);
                line-height: computed(30);
                white-space: nowrap;
                overflow: hidden;
                font-weight:500;
                color:rgba(13,14,9,1);
            }
            .cell-content{
                width: 100%;
                margin-left: computed(10);
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
                    margin-top: computed(30);
                    margin-right: computed(30);
                    font-size: computed(28);
                    line-height: computed(30);
                }
            }
            .cell-content input{
                background:rgba(246,246,246,1);
                display: block;
                box-sizing: border-box;
                width: 100%;
                height: computed(88);
                padding: 0 computed(32);
                border: none;
                font-size: computed(30);
                line-height: computed(88);
                color: #0D0E09;
                position: relative;
                /* 解决ios版微信浏览器的边框和阴影*/
                border-radius: 0;
                box-shadow:0 0 0 rgba(0,0,0,0);
                -webkit-appearance:none;
            }
        }
    }

</style>