<style lang='scss' scoped>
$size:computed(180);
.image{
 width: $size;
 height:$size;
}

</style>

<template>
    <div class="bg-white mgB30 pd30">
        <p class="fs28B mgB15">共 {{allAmount}} 件商品</p>
        <div class="flex-between" @click="viewGoodList()">
            <div class="flex-box">
                <div
                    class="flex-auto mgR20"
                    :class="{'cusTag': good.orderFlag == 1}"
                    v-for="(good,index) in goods"
                    :key="index"
                    v-if="index<3"
                >
                    <img :src="getImg(good.url)" @error="errImg($event)" class="image">
                </div>
            </div>
            <div class="flex-vcenter">
                <i class="iconfont icon-gengduo"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        goods: Array
    },
    data() {
        return {}
    },
    computed:{
        // 统计所有商品数量
        allAmount(){
            let count = 0;
            this.goods.forEach(item=>{
                count += item.amount;
            })
            return count;
        }
    },
    methods: {
        viewGoodList() {
            this.$emit('viewGoods', true)
        }
    },


}
</script>