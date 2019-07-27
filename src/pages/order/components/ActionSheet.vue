<style lang='scss' scoped>
.actionSheet{
   width: 100%;
   display: flex;
   flex-direction: column;
    max-height: computed(1000);
    background: #fff;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: computed(30);
  height: computed(50);
}
.list{
    overflow-y: auto;
    /*height: computed(600);*/
    /*解决安卓 弹出软键盘后挡住input问题*/
    height: computed(450);
}
.item{
  display: flex;
  justify-content: space-between;
  height: computed(60);
  padding:  computed(30)  computed(5);
}
    .mgb_7{
        margin-top: computed(7);
    }
    .search-input{
        background: #f5f5f5;
        flex: 1;
        padding: computed(12) computed(20);
        font-size: computed(26);
    }
    .tip-label{
        padding-right: computed(50);
    }
    .write-radio{
        height: computed(60);
    }
.write-card-code{
    position: relative;

    .write-err-tip{
        position: absolute;
        left:computed(20);
        bottom: computed(-40);
    }
}
</style>

<template>
    <van-actionsheet v-model="show" class="actionSheet">
       <div class="header">
            <div class="text-center flex-auto">{{title}}</div>
            <i class="iconfont icon-dagouwuquan fs36" @click="onClose()"></i>
        </div>
        <div class="flex-auto pd30 list">
            <!--<div class="flex-between flex-vcenter pdTb30">-->
                <!--<p class="tip-label">请输入卡券</p>-->
                <!--<div class="write-card-code">-->
                    <!--<van-field ref="inputRef"-->
                               <!--clearable placeholder="请输入券号"-->
                               <!--@focus="onFocus"-->
                               <!--@blur="onBlur"-->
                               <!--v-model="searchValue"-->
                               <!--class="flex-auto search-input"/>-->
                    <!--&lt;!&ndash;背景颜色问题 所以不使用error-message&ndash;&gt;-->
                    <!--<div class="write-err-tip fs28" v-show="errMsg">{{errMsg}}</div>-->
                <!--</div>-->
                <!--<van-radio  class="pdL20 write-radio" :name="-2" v-model="selectedModel"></van-radio>-->
            <!--</div>-->
            <div class="item" v-for="(item,index) in coupons " :key="index">
                <p>{{item.couponName}}</p>
                <div class="flex-box">
                    <div  v-if="index > 0" class="mgR20 mgb_7">{{type == 'disCoupon'?(item.discount*10).toFixed(2)+'折':'￥'+(item.cardClassDto && item.cardClassDto.classCode === '001'?item.cardCard.remainAmount:item.initialValue)}}</div>
                    <van-radio :name="item.cardId" v-model="selectedModel" :disabled="item.disabled"></van-radio>
                </div>
            </div>
        </div>
        <!--<div class="flex-button" @click="onClose()">关闭</div>-->
    </van-actionsheet>
</template>

<script>
import { Actionsheet, Popup, Toast, Radio, RadioGroup, Field } from 'vant';
export default {
    props: {
        title: "",
        couponList: {
            type: Array,
            default: []
        },
        value: Boolean,
        sModel: [String,Number],
        type: String//券类型
    },
    components: {
        'van-actionsheet': Actionsheet,
        'van-popup': Popup,
        'van-radio': Radio,
        'van-field': Field,
        'van-radio-group': RadioGroup,
    },
    data() {
        return {
            show: this.value,
            selectedModel: this.sModel || -1,
            mockData: [],
            coupons: [{
                couponName: "不使用" + this.title,
                cardId: -1,
                disabled: false
            }],
            searchValue:"",//输入券码
            errMsg:"",//输入券码输入框错误提示
        }
    },
    methods: {
        onFocus(){
            this.selectedModel = -2;
            this.setDialogOffset('-250px');
        },
        onBlur(){
            this.setDialogOffset('0');
            this.$emit('inputBlur',this.searchValue,this.type);
        },
        // 处理安卓机弹窗中弹出软键盘 input被遮挡问题
        setDialogOffset(val){
//            let dialogList = document.getElementsByClassName('van-actionsheet');
//            var u = navigator.userAgent;
//            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//            if(isAndroid){
//                for(let i=0; i<dialogList.length; i++){
//                    console.log(dialogList[i])
//                    dialogList[i].style.bottom = val;
//                }
//            }
        },
        onClose() {
            this.$emit('input', false)
        },
        mock() {
            for (let index = 0; index < 3; index++) {
                let obj = {
                    couponName: this.title + index,
                    cardId: index,
                    disabled: false
                }
                this.mockData.push(obj);
            }
            return this.mockData;
        }
    },
    watch: {
        value: function (state) {
            this.show = state;
        },
        show: function (state) {
            if (!state) {
                this.$emit('input', false)
            }
        },
        selectedModel: function (model) {
            if(model == -2){// 输入卡券
                this.$refs.inputRef.focus();
            }
            this.coupons.forEach(element => {
                if (model === element.cardId) {
                    this.show = false;
                    this.$emit('onSelect', element)
                }
            });

        },
        couponList: function (list) {
            console.log('list', list);
            list.forEach((coupon) => {
                this.coupons.push(coupon);
            })
        }
    }


}
</script>