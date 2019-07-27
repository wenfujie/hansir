<style lang='scss' scoped>
</style>

<template>
    <div class="pd30 bg-white mgB30" v-if="pkg">
        <div class="border-b1-c pd30 mgB30" v-if="pkg.shippingWayCode==='mdzq'&&step>=3">
            <div class="fs32B">备货进度</div>
            <div class="mgT20 fs28" v-if="step==3">
                <b>[ 备货中 ]</b> 商家正在抓紧时间备货，请静等短信通知。
            </div>
            <div class="mgT20 fs28" v-if="step==4">
                <b>[ 备货完成 ]</b> 请抓紧时间到
                <span class="orange">{{shopName}}</span> 提货
            </div>
            <div class="mgT20 fs28" v-if="step==5">
                <b>[ 已提货 ]</b>
                已于{{pkg.nodeTime}} 提货
            </div>
        </div>
        <div class="flex-between">
            <div class="flex-vcenter w10">
                <i class="iconfont icon-dizhidingwei fs32"></i>
            </div>
            <div class="flex-auto">
                <div class="flex-between mgB10 fs28B">
                    <div>{{pkg.cargoUsrName}}</div>
                    <div>{{pkg.cargoMobile}}</div>
                </div>
                <div>
                    <span v-if="shopName" class="fs28B color-red">{{'[ '+ shopName +' ]'}}</span>
                    <span class="fs28">{{address}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        pkg: {}
    },
    computed: {
        step: function () {
            return this.pkg.nodeCode;
        },
        address: function () {
            let addr =
                this.pkg.cargoStateName +
                this.pkg.cargoCityName +
                this.pkg.cargoDestName +
                this.pkg.cargoAddress;
            return addr;
        },
        // 门店名称
        shopName: function () {
            if (this.pkg.shippingWayCode != "mdzq") return null;
            if (this.pkg.dptName) {
                return this.pkg.dptName;
            } else if (this.pkg.recptdptName) {
                return this.pkg.recptdptName;
            } else {
                return null;
            }
        }
    }
};
</script>