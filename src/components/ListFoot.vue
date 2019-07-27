/*
* createTime：2018/11/2
* author：fujie.wen
* description: 列表底部公共组件 （精彩生活 从衣开始）
*/
<template>
    <div>
        <div class="footer">
            <img src="@/assets/images/show/foot-logo.png" alt="">
        </div>
    </div>
</template>

<script>
  export default {
    components:{},
    data() {
      return {
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
    .footer{
        width: 100%;
        height: computed(100);
        display: flex;
        align-items: center;
        justify-content: center;

        img{
            width: computed(600);
            height: computed(68);
        }
    }
</style>