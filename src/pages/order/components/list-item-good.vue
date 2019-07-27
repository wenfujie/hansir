<style lang='scss' scoped>
.imgBox {
    width: computed(200);
    height: computed(200);
    // padding: computed(4);
    img {
        max-width: 100%;
        max-height: 100%;
    }
}
.logo {
    width: computed(90);
    height: computed(40);
    img {
        max-width: 100%;
        max-height: 100%;
    }
}
.btnCom {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: computed(150);
    // height: computed(55);
    padding: computed(5) computed(10);
    background: #fff;
    margin-left: computed(30);
    border: solid computed(1) #cccccc;
}
.cus-list {
    background: #f5f5f5;
    width: computed(130);
    padding: computed(5);
}
</style>

<template>
    <div class="flex-box pd30 border-b1-c">
        <div class="imgBox" :class="{'cusTag':good.orderFlag===1}">
            <img :src="getImg(good.thumb)" alt class="img">
        </div>
        <div class="flex-vbox flex-between flex-auto pdL30">
            <div class="clothName fs28">{{good.goodsName}}</div>
            <div class="goodInfo flex-vbox">
                <div
                    class="fs24 grey99 mgB20"
                    v-if="good.orderFlag===0"
                >{{good.colorName}} : {{good.sizeName}}</div>
                <div class="flex-vcenter fs24 grey99 mgB20" v-if="false">
                    <span class="bg-gray pdLr5 pdTb2" @click.stop="showCustomList()">
                        {{emText}}
                        <i class="iconfont icon-down fs28" v-if="emText!='无刺绣信息'"></i>
                    </span>
                </div>
                <div class="flex-between">
                    <div class="fs26B">¥ {{good.averagePrice|Fix2}}</div>
                    <div class="fs26 grey99">X{{good.ordQty}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import check from "@/util/check";
export default {
    props: {
        good: Object
    },
    data() {
        return {}
    },
    methods: {
        showCustomList() {
            this.$emit('showEmbp', this.good)
        }
    },
    computed: {
        //部件
        part: function () {
            if (check.isEmpty(this.good.parts)) return null;
            const part = this.good.parts.filter((part) => {
                // 过滤出唯一有刺绣的部位
                if (part.emb || part.embPrint) return part;
            })
            return check.isEmpty(part) ? null : part[0];
        },
        // 绣字
        emb: function () {
            if (check.isEmpty(this.part)) return null;
            return check.isEmpty(this.part.emb) ? null : this.part.emb[0];
        },
        // 绣花
        emp: function () {
            if (check.isEmpty(this.part)) return null;
            return check.isEmpty(this.part.embPrint) ? null : this.part.embPrint[0];
        },
        emText: function () {
            return (!this.emb && !this.emp) ? "无刺绣信息" : "刺绣详情"
        }
    }
}
</script>