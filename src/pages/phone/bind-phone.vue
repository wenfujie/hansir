/*
* createTime：2018/11/2
* author：en.chen
* description:  手机号绑定
*/


<template>
    <div class="wrapper phone-box">
        <div class="form-box">
            <van-field type="tel" placeholder="请输入手机号" class="wd100" v-model="phoneNum" maxlength="11" @input="phoneRule" clearable />
        </div>
        <div class="form-box">
            <van-field type="tel" class="captcha-text wd60 fl" v-model="captcha" placeholder="请输入验证码" clearable />
            <button class="captcha-btn color-red wd40 fr" :class="[captchaLocked == true ? 'disabled' : '']" @click="checkPhone">{{captchaText}}</button>
        </div>
        <div class="bottom-btn" @click="bindPhone">立即绑定</div>
    </div>
</template>
<script>
    import { Toast } from 'vant'
    import { UserService } from '../../api/service'
    import Storage from '../../util/storage'
    export default {
        data() {
            return {
                phoneNum: '',  // 绑定手机号
                captcha: '',  //验证码
                captchaText: '获取验证码',  // 文字提示
                captchaLocked: false,  // 获取验证码按钮锁
                isSendCaptcha: false, // 是否获取过验证码
                time: 60,  // 倒计时时间
                checkStatus: false,  // 手机号是否允许绑定状态
                btnLock: false  //  绑定手机号按钮锁
            }
        },
        methods: {
            //  保留正确手机号
            phoneRule () {
                this.phoneNum = this.phoneNum.replace(/\D/g,'')
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
                        this.checkStatus = false
                    })
                }
            },
            // 获取验证码
            getCaptcha () {
                if (this.captchaLocked === true || this.checkStatus === false) { // 判断是否可以发送验证码
                    return
                }
                this.captchaLocked = true
                let phone = this.phoneNum
                let data = {
                    mobile: phone
                }
                UserService.getCaptcha(data).then((res)=>{
                } ,(err)=>{}).then(() => {
                    this.isSendCaptcha = true
                })
                this.countDown()
            },
            // 倒计时
            countDown () {
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
            bindPhone () {
                if(this.btnLock === true) return
                this.btnLock = true
                if (!isPhone(this.phoneNum)) {
                    Toast('请填写正确的手机号')
                    this.btnLock = false
                    return false
                }
                if (!this.captcha) {
                    Toast('请先填写验证码')
                    this.btnLock = false
                    return false
                }
                if(this.isSendCaptcha !== true) {
                    Toast('请先获取验证码')
                    this.btnLock = false
                    return false
                }
                if(this.checkStatus === false) {
                    Toast('该手机号已经被绑定了~')
                    this.btnLock = false
                    return false
                }
                let data = {
                    mobilePhone: this.phoneNum,
                    registCode: this.captcha,
                    verifyType: "D_VERIFYLOG",
                    sourceCode: baseConstant.busContsCode,
                    cudDptId: Storage.get('USER_INFO').shopId
                }
                //  验证手机号和验证码
                UserService.checkCaptcha(data).then(()=> {
                    // 绑定手机号
                    let bindData = {
                        mobile: this.phoneNum,
                    }
                    UserService.bindMobile(bindData).then(()=>{
                        Toast('绑定手机号成功~')
//                        this.$router.push("/member-center")
//                        window.history.go(-1)
                        this.btnLock = false
                        let userInfo = Storage.get('USER_INFO');
                        userInfo.mobilePhone = this.phoneNum;
                        Storage.set('USER_INFO', userInfo)
                        // 存在成功后需跳转地址
                        if(this.successUrl){
                            console.log("绑定手机号页，跳转到",this.successUrl)
                            this.$router.push(this.successUrl);
                        }else{
                            this.$router.go(-1)
                        }
                    },(err)=>{
                        Toast(err.errorMsg)
                    })
                }, (err) => {
                    Toast(err.errorMsg)
                }).then(() => {
                    this.btnLock = false
                })
            },
        },
        created() {
            // 绑定手机成功后要跳转路由
            this.successUrl = this.$route.query.successUrl;
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>