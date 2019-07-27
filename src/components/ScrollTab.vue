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
    overflow: hidden;
    .content {
        display: flex;
        min-width: 100%;
        flex-wrap: nowrap;
        box-sizing: border-box;
        .tabItem {
            display: flex;
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
    <div class="tabWraper" ref="tabWraper">
        <ul class="content" ref="tabContent" :style="style[tabPos]">
            <li
                v-for="(item,$index) in tabs"
                @click="Tab(item,$index)"
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
        onTab: {
            type: Function,
            default: null
        },
        tabPos: {
            type: String,
            default: "left"
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
        // 获取子节点总宽度
        getChildrenWidth(dom) {
            var children = dom.children;
            var childrenWidth = 0;
            for (let i = 0; i < children.length; i++) {
                childrenWidth += children[i].offsetWidth;
            }
            return childrenWidth;
        },
        //创建滚动
        createScroll() {
            let width = this.getChildrenWidth(this.$refs.tabContent);
            this.$refs.tabContent.style.width = width + "px";
            this.scroll = new BScroll(this.$refs.tabWraper, {
                preventDefault: true,
                startX: 0,
                click: true,
                scrollX: true,
                scrollY: false,
                eventPassthrough: "vertical"
            });
        },
        // 初始化滚动条
        initScroll() {
            if (!this.scroll) {
                this.createScroll();
            } else {
                this.scroll.refresh();
            }
        },
        // tab点击事件
        Tab(item, $index) {
            this.sIndex = $index; //控制选中样式切换
            if (this.onTab) {
                this.onTab(item, $index);
            }
        },
        // 初始化选中状态
        initState() {
            this.sIndex = this.index ? this.index : 0;
            this.initScroll();
        }
    },
    created() {
        window.onresize = () => {
            this.createScroll();
        };
    },
    mounted() {
        this.initState();
    },
    watch: {
        data: function (tabList) {
            this.tabs = tabList;
            this.initState();
        }
    }
};
</script>