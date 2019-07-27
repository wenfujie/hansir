<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-21 13:53:24
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-21 18:25:24
 * @Description: 账户充值
 -->

<style lang='scss' scoped>
.active{
  color: #C41717;
   border-bottom: solid computed(2) #C41717;
}
.inActive{
   color: #0D0E09;
     border-bottom: solid computed(1) #DBDBDB;
}
.topPart{
  // height: computed(450);
  background: #fff;
  padding-bottom: computed(30);
}
.card-input{
  padding: computed(30);
  outline: none;
  border:none; 
  border-bottom: solid computed(1) #B3B3B3; 
}
::-webkit-input-placeholder{
 color: #B3B3B3;
}
.wechat{
  display: flex;
  flex-wrap: wrap;
  padding:0 computed(30) ;
  margin-bottom: computed(30);
  height: computed(350);
}
.tab{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: computed(20);
  margin-bottom: computed(30);
  width: computed(210);
  height: computed(100);
  box-sizing: border-box;
}
.tabActive{
  color: #fff;
  font-weight: bold;
  background:  #C41717;
  .song{
    font-size: computed(26);
  }
}
.tabInactive{
   font-weight: bold;
  border:solid computed(2) #C41717 ;
  .chong{
    color:#0D0E09
  }
  .song{
    font-size: computed(26);
   
    color:#C41717;
  }
}

.card{
   display: flex;
   flex-direction: column;
  margin-bottom: computed(30);
  height: computed(350);
}





</style>

<template>
    <div class="page bg-gray">
        <div class="topPart">
            <!-- 充值方式选择 -->
            <div class="flex-box fs30">
                <div
                    :class="['flex-auto flex-center pdTb30',{'active':mode=='wx','inActive':mode!='wx'}]"
                    @click="modeChange('wx')"
                >微信充值</div>
                <div
                    :class="['flex-auto flex-center pdTb30',{'active':mode=='card','inActive':mode!='card'}]"
                    @click="modeChange('card')"
                >充值卡充值</div>
            </div>
            <!-- 充值可选项 -->
            <div class="flex-vbox">
                <!-- 微信充值 -->
                <div class="wechat overflow-scroll mgT30" v-if="mode=='wx'">
                    <div class="tab tabActive" v-for="i in 10" :key="'a'+i">
                        <span class="chong fs32B">冲30000</span>
                        <span class="song">送100</span>
                    </div>
                    <div class="tab tabInactive" v-for="i in 10" :key="'b'+i">
                        <span class="chong fs32B">冲3000</span>
                        <span class="song">送100</span>
                    </div>
                </div>
                <!-- 充值卡充值 -->
                <div class="flex-vbox fs28 mgB30" v-if="mode=='card'">
                    <input
                        class="card-input"
                        type="number"
                        v-model="card.number"
                        placeholder="请输入充值卡号"
                    >
                    <input class="card-input" type="number" v-model="card.pwd" placeholder="请输入密码">
                </div>
                <!-- 充值操作 -->
                <div class="pdLr30 white fs30">
                    <button class="flex-button" @click="pay()">立即充值</button>
                </div>
            </div>
        </div>
        <chargeCardList/>
    </div>
</template>

<script>
import { Field } from "vant"
import chargeCardList from "./components/chargeCardList"
export default {
    components: {
        'van-field': Field,
        chargeCardList
    },
    data() {
        return {
            mode: "wx",
            card: {
                number: "",
                pwd: ""
            }
        }
    },
    methods: {
        // 切换充值方式
        modeChange(mode) {
            this.mode = mode;
        },
        // 充值
        pay() {

        }

    }
}
</script>