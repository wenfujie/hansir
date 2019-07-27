<style lang='scss' scoped>

</style>

<template>
    <div class="pd30">
        <p class="mgB20 fs26B">可使用充值卡</p>
        <chargeCard :card="card"/>
        <chargeCard :card="card"/>
    </div>
</template>

<script>
import chargeCard from './chargeCard'
export default {
    components: {
        chargeCard
    },
    data() {
        return {
            card: {}
        }
    },
    methods: {

    }
}
</script>