<!--
                     * @Author: yongtian.hong
                     * @Date: 2018-12-11 15:20:04
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-26 10:41:57
                     * @Description: 感谢信
-->
<style lang="scss" scoped>
.thanksPage{
  position: absolute;
  top:0;
  bottom:0;
  left: 0;
  right:0 ;
  z-index:100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:rgba(0, 0, 0, 0.7);
  .letter{
    position: relative;
    width:90%;
    height: 50%;
    display: flex;
    justify-content: center;
    background: url('../../../assets/images/order/letter.png') no-repeat;
    background-size: 100% 100%;
  }
  .btnFill{
      position: absolute;
      bottom: computed(-100);
      width: computed(64);
      height: computed(64);
      background-color:#D5AF6E ;
      font-size: computed(30);
      color:#fff;
      background: url('../../../assets/images/order/close.png') no-repeat;
      background-size: 100% 100%;
  }
}

</style>


<template>
    <div class="thanksPage" v-if="letterShow">
        <div class="letter">
            <button class="btnFill" @click="fill"></button>
        </div>
    </div>
</template>

<script>
import check from '@/util/check'
export default {
    props: {
        letterShow:Boolean
    },
    data() {
        return {
            show: false
        };
    },
    methods: {
        onInit() {
            let from = this.$route.params.fromPage;
            if (check.isEmpty(from)) from = this.$route.query.fromPage;
            let fromPageArr = ['settlement', 'order','payCode'];
            if (fromPageArr.indexOf(from) != -1) {
                this.letterShow = true;
            }
        },
        fill() {
            this.letterShow = false;
            this.$emit('close')
        }
    },
    created() {
        // this.onInit();
        console.log("_________>>",this.letterShow)
        this.show = this.letterShow
    }
};
</script>
