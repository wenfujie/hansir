/*
* createTime：2019/3/11
* author：en.chen
* description:
*/
<template>
    <div class="empty-box">
        <p>{{emptyText}}</p>
    </div>
</template>
<script>
export default {
    name: "Empty",
    props: {
        emptyText: {
            type: String,
            default: '当前暂无数据~'
        }
    },
    data() {
        return {}
    },
    methods: {},
    created() {
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.empty-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: -webkit-fill-available;
    height: -moz-fill-available;
    height: -moz-available; /* FireFox目前这个生效 */
    height: fill-available;
    background: url("../assets/images/common/default.png") no-repeat center 20%;
    background-size: 26.67%;
    font-size: computed(30);
    line-height: 1;
    color: #999999;
}
</style>