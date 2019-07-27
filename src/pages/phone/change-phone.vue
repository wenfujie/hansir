/*
* createTime：2018/11/2
* author：en.chen
* description:  更换绑定手机号
*/
<template>
    <div class="wrapper phone-box">
        <div class="form-box">
            <van-field type="tel" placeholder="请输入新手机号" class="wd100" v-model="phoneNum" maxlength="11" @input="phoneRule" clearable />
        </div>
        <div class="form-box">
            <van-field type="tel" class="captcha-text wd60 fl" v-model="captcha" placeholder="请输入验证码" clearable />
            <button class="captcha-btn color-red wd40 fr" :class="[captchaLocked == true ? 'disabled' : '']" @click="checkPhone">{{captchaText}}</button>
        </div>
        <div class="bottom-btn" @click="bindNewPhone">确定</div>
    </div>
</template>
<script>
    import { Toast } from "vant";
    import { UserService } from "../../api/service";
    export default {
        data() {
            return {
                phoneNum: '',  // 绑定手机号
                captcha: '',  //验证码
                captchaText: '获取验证码',  // 文字提示
                captchaLocked: false,  // 获取验证码按钮锁
                time: 60,  // 倒计时时间
                btnLock: false,  //  绑定手机号按钮锁
                checkStatus: false,  // 手机号是否允许绑定状态
                userInfo: {}
            }
        },
        methods: {
            //  保留正确手机号
            phoneRule () {
                this.phoneNum = this.phoneNum.replace(/\D/g,'')
            },
            //  获取用户信息
            getUser() {
                let data = {}
                UserService.getUserInfo(data).then((res) => {
                    this.userInfo = res
                })
            },
            //  校验手机号是否绑定
            checkPhone () {
                if(this.captchaLocked === true) {
                    return
                }
                // 校验手机号正确性
                if (!isPhone(this.phoneNum)) {
                    Toast('请填写正确的手机号')
                    return
                }else {
                    let data = {
                        ctmUsrId: Storage.get('USER_INFO').usrId,
                        mobile: this.phoneNum,
                        buscontsId: baseConstant.busContsCode
                    }
                    UserService.checkPhone(data).then((res)=>{
                        this.checkStatus = true
                        this.getCaptcha()
                    }, (err)=>{
                        Toast(err.errorMsg)
                    })
                }
            },
            // 获取验证码
            getCaptcha() {
                if (this.captchaLocked === true) {
                    // 判断是否可以发送验证码
                    return;
                }
                const phone = this.phoneNum;
                if (!isPhone(phone)) {
                    Toast("请填写正确的手机号");
                    return;
                }
                let data = {
                    id: Storage.get("USER_INFO").usrId,
                    mobile: phone
                };
                UserService.getCaptcha(data).then(() => {
                }, (err) => {});
                this.countDown()
            },
            // 倒计时
            countDown() {
                let that = this;
                this.captchaLocked = true;
                this.captchaText = "验证码已发送";
                this.countDownData = window.setInterval(function () {
                    that.captchaText = "重新获取" + that.time + "s";
                    if (that.time-- <= 0) {
                        that.time = 60;
                        that.captchaLocked = false;
                        that.captchaText = "获取验证码";
                        window.clearInterval(that.countDownData);
                    }
                }, 1000);
            },
            // 绑定新电话
            bindNewPhone() {
                if(this.btnLock === true) {
                    return
                }
                this.btnLock = true
                if (!isPhone(this.phoneNum)) {
                    Toast("请先输入正确的手机号");
                    this.btnLock = false
                    return;
                }
                if(this.checkStatus === false) {
                    Toast('该先验证手机号是否可用~')
                    this.btnLock = false
                    return false
                }
                if (!this.captcha) {
                    Toast("请先输入验证码");
                    this.btnLock = false
                    return
                }
                //  验证手机验证码
                let data = {
                    mobilePhone: this.phoneNum,
                    registCode: this.captcha,
                    verifyType: ''
                };
                UserService.checkCaptcha(data).then((res) => {
                    //  更换新手机号
                    let changeData = {
                        newMobile: this.phoneNum,
                        oldMobile: this.userInfo.mobilePhone
                    };
                    UserService.changePhone(changeData).then(
                        (res) => {
                            Toast("更换绑定成功~");
                            window.history.go(-1);
                            this.btnLock = false
                        },
                        (err) => {
                            Toast(err.errorMsg);
                            this.btnLock = false
                        }
                    ).then(() => {
                        this.btnLock = false
                    });
                },(err)=>{
                    Toast(err.errorMsg)
                    this.btnLock = false
                }).then(() => {
                    this.btnLock = false
                });
            }
        },
        created() {
            this.getUser()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>