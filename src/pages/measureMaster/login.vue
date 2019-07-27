/*
* createTime：2018/11/10
* author：en.chen
* description:  量体师登录
*/
<template>
    <div class="wrapper phone-box">
        <div class="form-box">
            <input type="tel" placeholder="请输入手机号" class="wd100" v-model="phoneNum" @input="isMeasure">
        </div>
        <div class="form-box">
            <input type="tel" class="captcha-text wd70 fl" v-model="captcha" placeholder="请输入验证码" >
            <button class="captcha-btn color-red wd30 fr" :class="[captchaLocked == true ? 'disabled' : '']" @click="checkPhone">{{captchaText}}</button>
        </div>
        <div class="bottom-btn" @click="toLogin">登录</div>
    </div>
</template>
<script>
    import { Toast } from 'vant'
    import { UserService, Cms, MeasureMaster } from '../../api/service'
    export default {
        data() {
            return {
                phoneNum: '',  // 绑定手机号
                isMeasureFlag: false,  //  判断手机号是否绑定量体师
                captcha: '',  //验证码
                captchaText: '获取验证码',  // 文字提示
                captchaLocked: false,  // 获取验证码按钮锁
                time: 60,  // 倒计时时间
            }
        },
        methods: {

            //  校验输入的手机号是否是量体师的账号
            isMeasure () {
                if(this.phoneNum.length !== 11) {
                    return
                }else{
                    let data = {
                        mobile: this.phoneNum
                    }
                    MeasureMaster.checkPhone(data).then((res) => {
                        if(res && res.usrId) {
                            this.isMeasureFlag = true
                        }else{
                            this.isMeasureFlag = false
                        }
                    })
                }
            },

            //  校验手机号
            checkPhone () {
                if(this.captchaLocked === true) return
                this.getCaptcha()
            },
            // 获取验证码
            getCaptcha () {
                let phone = this.phoneNum
                if(!isPhone(phone)){
                    Toast('请输入正确的手机号~')
                    return
                }
                if(this.isMeasureFlag === false) {
                    Toast('该手机号不是量体师账户~')
                    return
                }
                if (this.captchaLocked === true) return
                this.captchaLocked = true
                let data = {
                    mobile: phone,
                    companyId: Storage.get('MEASURE_COMPANYID').company_id,
                    ownCompanyId: Storage.get('MEASURE_COMPANYID').company_id,
                    usrId: 0    //  usrId为必填字段，不是实际用户写死为0
                }
                UserService.getCaptcha(data).then((res)=>{
                } ,(err)=>{})
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
            //  量体师登录
            toLogin () {
                if(!isPhone(this.phoneNum)) {
                    Toast('请先填写正确的手机号~')
                    return
                }
                if(!this.captcha) {
                    Toast('请先填写验证码~')
                    return
                }
                if(this.isMeasureFlag === false) {
                    Toast('该手机号不是量体师账户~')
                    return
                }
                let data = {
                    mobilePhone: this.phoneNum,
                    registCode: this.captcha
                }
                MeasureMaster.login(data).then((res) => {
                    if(res) {
                        Storage.set('MEASURE_USER',res)
                        this.$router.replace('/measure-master/master-center')
                    }else{
                        Toast('验证失败，请重新登录~')
                    }
                },(err) => {
                    Toast('验证失败，请重新登录~')
                })
            }
        },
        created() {
            Cms.getProperties().then(res=>{
                global.baseConstant.wxUnionid = res.mpUuid
                Storage.set("MEASURE_COMPANYID", {"company_id": res.companyId})
            })
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>