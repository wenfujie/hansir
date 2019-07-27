<style lang='scss' scoped>
.wrap{
  padding-left:computed(30) ;
  padding-right:computed(30) ;
  background-color: #fff;
  margin-bottom: computed(30);
}
.border-bottom{
    border-bottom: solid computed(1) #999;
}

</style>

<template>
    <div class="wrap">
        <div
            v-for="(item,key,index) in actionList"
            :key="index"
            :class="{'border-bottom':index >len}"
        >
            <action-cell :item="item" :ref="'action'+item.id"></action-cell>
        </div>
    </div>
</template>

<script>
import ActionCell from "./ActionCell"
import check from '@/util/check'
export default {
    props: {
        actionList: {}
    },
    data() {
        return {}
    },
    computed: {
        len: function () {
            if (check.isArray(this.actionList)) {
                return this.actionList.length - 1;
            } else if (check.isObject(this.actionList)) {
                return Object.keys(this.actionList).length - 1;
            }
        }
    },
    methods:{
        // 父组件调用方法  查找券
        inputEvent(type){
            this.$nextTick(()=>{
                this.$refs.action2[0].searchInputCommonFun(type);
            })
        },
    },
    components: {
        ActionCell
    }
}
</script>