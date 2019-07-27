/*
* createTime：2018/11/3
* author：en.chen
* description:  新增/展示/修改地址详情
*/
<template>
    <div class="address-detail bg-gray">
        <!--地址信息 begin-->
        <div class="bg-white">
            <div class="detail-cell">
                <div class="cell-title">联系人</div>
                <div class="cell-content">
                    <van-field
                        type="text"
                        v-model="addressInfo.name"
                        clearable
                        maxlength="40"
                        placeholder="请填写收货人姓名"
                        @blur="bindBlur"
                    />
                </div>
            </div>
            <div class="detail-cell">
                <div class="cell-title">手机号</div>
                <div class="cell-content" :class="{'warn-tip' : checkPhone !== true}">
                    <van-field
                        type="tel"
                        v-model="addressInfo.phone"
                        @change="checkPhoneNum"
                        maxlength="11"
                        placeholder="请填写手机号"
                        @blur="bindBlur"
                        clearable
                    />
                </div>
            </div>
            <div class="detail-cell">
                <div class="cell-title">所在地区</div>
                <div class="cell-content area" @click="showAreaList = true">
                    <span v-text="addressInfo.province + addressInfo.city + addressInfo.district"></span>
                </div>
            </div>
            <div class="detail-cell address-detail-text">
                <van-field
                    type="textarea"
                    placeholder="详细地址：如街道、门牌号、小区、楼栋号、单元室等"
                    v-model="addressInfo.detail"
                    @blur="bindBlur"
                    clearable
                />
                <!--<input type="text" v-model="addressInfo.detail" />-->
            </div>
            <div class="detail-cell">
                <div class="cell-title">设为默认</div>
                <div class="cell-content">
                    <van-switch class="reset-UI" v-model="defaultStatus" @input="changeDefault"/>
                </div>
            </div>
        </div>
        <!--地址信息 end-->
        <!--提交按钮 begin-->
        <div class="bottom-btn" @click="editAddress">保存</div>
        <!--提交按钮 end-->
        <!--弹窗 begin-->
        <van-popup v-model="showAreaList" position="bottom">
            <!--<van-area :value="addressInfo.addressId" :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false" />-->
            <van-area
                :area-list="areaList"
                @confirm="areaChange"
                @cancel="showAreaList = false"
                :visible-item-count="5"
            />
        </van-popup>
        <!--弹窗 end-->
    </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .address-detail{
        height: 100vh;
        overflow: hidden;
        .detail-cell{
            box-sizing: border-box;
            display: flex;
            height: computed(100);
            margin: 0 computed(30);
            position: relative;
            border-bottom: solid 1px #c7c7c7;
            &:nth-child(1) {
                 margin-top: computed(30);
             }
             &:last-child{
                  border-bottom: none;
                  .cell-content {
                      text-align: right;
                  }
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
            }
            .cell-content{
                width: 100%;
                margin-left: computed(10);
                text-align: left;
            }
            .area{
                box-sizing: border-box;
                height: computed(98);
                padding: 0 computed(10);
                white-space: normal;
                word-break: break-all;
                font-size: computed(28);
                line-height: computed(100);
                border: none;
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
        .detail-cell.address-detail-text{
            height: auto;
            padding: computed(30) 0;
            textarea {
                display: block;
                width: 100%;
                height: computed(100);
                border: none;
                resize: none;
                font-size: computed(28);
                line-height: computed(40);
                color: #0D0E09;
            }
        }

        /* 地址详情页面switch按钮 */
        .reset-UI{
            width: computed(100);
            height: computed(60);
            margin-top: computed(20);
            .van-switch--on .van-switch__node{
                transform: translateX(.65em);
            }
        }
        .van-switch {
            background: #e6e6e6;
        }
        .van-switch--on{
            background-color: #0d0e09;
        }
    }
</style>
<script>
import { Popup, Area, Toast, Switch } from 'vant'
import { Base } from '../../api/service'
import { UserService } from '../../api/service'
import Storage from '../../util/storage'
import { cityData } from '../../assets/js/cityData'
export default {
    components: {
        'van-area': Area,
        'van-popup': Popup,
        'van-switch': Switch
    },
    data() {
        return {
            id: '',
            destId: '',
            addressInfo: {
                name: '',
                phone: '',
                province: '',
                district: '',
                city: '',
                addressId: '',
                detail: ''
            },
            checkPhone: true,
            setDefault: 0,
            defaultStatus: false,
            showAreaList: false,
            areaList: cityData,
            focus: false,
            btnLock: false // 按钮锁
        }
    },
    methods: {

        // 更新本地保存的信息
        updateAddrInLocal(addrObj) {
            let addr = Storage.get("settlementAddr");
            if (!!addr && (addr.id === addrObj.id)) {
                addr.cargousrName = this.addressInfo.name;
                addr.cargoPhone = this.addressInfo.phone;
                addr.destDesc = this.addressInfo.province + this.addressInfo.city + this.addressInfo.district;
                addr.address = this.addressInfo.detail;
                this.Storage.set("settlementAddr", addr);
            }
        },

        // 提交地址信息
        editAddress() {
            if (this.btnLock) return
            this.btnLock = true
            this.checkPhoneNum()
            if (!this.addressInfo.detail || !this.addressInfo.addressId) {
                Toast('请完善地址信息~')
                this.btnLock = false
                return
            }
            if (this.checkPhone === false) {
                Toast('请输入正确的手机号')
                this.btnLock = false
                return
            }
            else {
                let addrData = {
                    id: parseInt(this.id),
                    address: this.addressInfo.detail,
                    cargousrName: this.addressInfo.name,
                    cargoMobile: this.addressInfo.phone,
                    cargoPhone: this.addressInfo.phone,
                    defaultFlag: this.setDefault,
                    destCode: this.addressInfo.addressId
                }
                UserService.changeAddrInfo(addrData).then(() => {
                    Toast({
                        message: '保存地址信息成功~',
                        duration: 3000
                    })
                    this.updateAddrInLocal(addrData);
                    window.history.go(-1)
                    this.btnLock = false
                }, (err) => {
                    Toast(err.errorMsg)
                    this.btnLock = false
                }).then(() => {
                    this.btnLock = false
                })
            }
        },

        // 校验电话号码
        checkPhoneNum() {
            this.addressInfo.phone = this.addressInfo.phone.replace(/[^\d]/g, '')
            if (!isPhone(this.addressInfo.phone)) {
                Toast('请输入正确的手机号')
                this.checkPhone = false
                window.scroll(0,0);
                return
            } else {
                this.checkPhone = true
                window.scroll(0,0);
            }
        },

        //  省市区选择
        areaChange(value) {
            this.addressInfo.province = value[0].name
            this.addressInfo.city = value[1].name
            this.addressInfo.district = value[2].name
            if (value[2].code) {
                this.addressInfo.addressId = value[2].code
            } else if (value[1].code) {
                this.addressInfo.addressId = value[1].code
            } else {
                this.addressInfo.addressId = value[0].code
            }
            this.showAreaList = false
        },

        //  设置默认地址
        changeDefault(checked) {
            if (this.defaultStatus === true) {
                this.setDefault = 1
            } else if (this.defaultStatus === false) {
                this.setDefault = 0
            }
        },

        //  input框失去焦点
        bindBlur(){
            window.scroll(0,0);
        }
    },
    created() {
        //            this.getCityData()
        this.id = parseInt(this.$route.query.id) || ''
        this.destId = parseInt(this.$route.query.destId) || ''
        if ((this.destId) && (this.destId !== undefined)) {
            let data = {
                addressId: this.id,
                destId: this.destId
            }
            UserService.getAddrDetail(data).then((res) => {
                this.addressInfo.name = res.cargousrName
                this.addressInfo.phone = res.cargoPhone
                this.addressInfo.addressId = res.districtCode
                this.addressInfo.province = res.provinceCnName
                this.addressInfo.district = res.districtCnName
                this.addressInfo.city = res.cityCnName
                this.addressInfo.detail = res.address
                this.setDefault = res.defaultFlag
                if (this.setDefault === 1) {
                    this.defaultStatus = true
                } else {
                    this.defaultStatus = false
                }
            })
        }
    }
}
</script>