<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-13 15:29:38
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-18 14:02:33
 * @Description: 结算页商品清单
 -->

<style lang='scss' scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: computed(30);
  height: computed(50);
}
</style>

<template>
    <van-actionsheet v-model="show">
        <div class="header">
            <div class="text-center flex-auto fs32B">商品清单</div>
            <!-- <i class="iconfont icon-guanbi" @click="onClose()"></i> -->
        </div>
        <goodSheetItem
            v-for="(good,index) in goodsList"
            :key="index"
            :good="good"
            @getCusList="getCusList"
        />
        <button class="flex-button" @click="onClose()">关闭</button>
    </van-actionsheet>
</template>

<script>
import { Actionsheet, Popup, Toast, Radio, RadioGroup, } from 'vant';
import goodSheetItem from './goodSheetItem'
import customList from './custom-list'
export default {
    props: {
        goodsList: Array,
        value: Boolean
    },
    data() {
        return {
            params: {
                name: "hh"
            },
            show: this.value
        }
    },
    methods: {
        onClose() {
            this.$emit('input', false)
        },
        getCusList(good) {
            this.$emit("viewCusList", good)
        }
    },
    components: {
        goodSheetItem,
        customList,
        'van-actionsheet': Actionsheet,
        'van-popup': Popup,
        'van-radio': Radio,
        'van-radio-group': RadioGroup,
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
        goodsList: function (list) {
        }
    }


}
</script>