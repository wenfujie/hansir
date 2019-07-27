<style lang='scss' scoped>
.wheel-wrapper {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden;
    scroll-behavior: smooth;
    .wheel-scroll {
        display: flex;
        min-width: 100%;
        padding: computed(30);
        box-sizing: border-box;
    }
}
</style>

<template>
    <div class="wheel-wrapper" ref="scrollWraper">
        <div class="wheel-scroll" ref="cardWraper">
            <template v-for="(card,index) in cards ">
                <card :card="card" :key="index" @openVip="openVip"></card>
            </template>
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import check from "@/util/check";
import card from "./card";

export default {
    components: {
        card
    },
    props: {
        cards: {
            type: Array,
            default: []
        },
        showPopup: false
    },
    data() {
        return {
            isReady: false
        };
    },
    methods: {
        // 获取子节点总宽度
        getChildrenWidth(dom) {
            var children = dom.children;
            var childrenWidth = 0;
            for (let i = 0; i < children.length; i++) {
                childrenWidth += children[i].clientWidth;
            }
            return childrenWidth;
        },
        //创建滚动
        createScroll() {
            let width = this.getChildrenWidth(this.$refs.cardWraper);
            let cardWidth = this.$refs.cardWraper.children[0].clientWidth;
            this.$refs.cardWraper.style.width = width + 20 + "px";
            this.scroll = new BScroll(this.$refs.scrollWraper, {
                startX: 0,
                click: false,
                scrollX: true,
                scrollY: false,
                eventPassthrough: "vertical",
                snap: {
                    loop: false,
                    threshold: 0.1,
                    stepX: cardWidth,
                    stepY: 100
                }
            });
            this.scroll.on("scrollEnd", () => {
                let page = this.scroll.getCurrentPage();
                this.$emit("getCurrentPage", page.pageX);
            });
        },
        // 初始化滚动
        initScroll() {
            if (!this.scroll) {
                this.createScroll();
            } else {
                this.scroll.refresh();
            }
        },
        // 开通会员
        openVip() {
            this.$emit("update:showPopup", true);
        }
    },
    created() {
        window.onresize = () => {

            this.createScroll();
        };

    },

    updated() {

        this.initScroll();
    }
};
</script>