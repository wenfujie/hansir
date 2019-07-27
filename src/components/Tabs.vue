/*
 * @Author: yongtian.hong
 * @Date: 2018-08-01 15:37:12
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-12 13:22:07
 * @Description: tab横向滚动组件
  */
 
<style lang="scss" scoped>
.tabWraper {
    padding: 0;
    margin: 0;
    width: 100%;
    overflow: hidden;
    .content {
        display: flex;
        min-width: 100%;
        justify-content: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        .tabItem {
            display: flex;
            justify-content: center;
            flex-wrap: nowrap;
            padding: computed(20) computed(30);
            font-size: computed(30);
            font-family: "PingFang-SC-Medium";
            color: #0d0e09;
            cursor: pointer;
            .text {
                padding: 0px 0px computed(10) 0px;
            }
        }
    }
    .tabActive {
        position: relative;
        width: 120%;
        color: #c30d22;
        text-align: center;
    }
    .tabActive:after {
        content: "";
        position: absolute;
        left: 0px;
        top: 120%;
        height: 2px;
        border-radius: 1px;
        background-color: #c30d22;
        animation: line-animation 0.5s forwards;
    }
    @keyframes line-animation {
        from {
            width: 10%;
        }
        to {
            width: 100%;
        }
    }
}
</style>
<template>
    <div class="tabWraper">
        <ul class="content">
            <li
                v-for="(item,$index) in tabs"
                @click="onTabClick(item,$index)"
                :key="$index"
                class="tabItem"
                ref="tabItem"
            >
                <div class="text" :class="{'tabActive':sIndex===$index}">{{item[label] }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
    props: {
        index: 0,
        data: {
            type: Array,
            default: null
        },
        label: {
            type: String,
            default: "name"
        }
    },
    data() {
        return {
            sIndex: 0,
            tabs: this.data,
            style: {
                left: "justify-content:start;",
                center: "justify-content: center;",
                right: "justify-content: end;"
            }
        };
    },
    methods: {
        // tab点击事件
        onTabClick(item, $index) {
            this.sIndex = $index; //控制选中样式切换
            this.$emit("onTab", Object.assign(item, { index: $index }));
        },
        // 初始化选中状态
        onInit() {
            this.sIndex = this.index ? this.index : 0;
        }
    },
    created() {
        this.onInit();
    },
    mounted() {

    },
    watch: {
        data: function (tabList) {
            this.tabs = tabList;
            this.onInit();
        }
    }
};
</script>