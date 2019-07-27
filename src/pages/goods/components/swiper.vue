<style lang='scss' scoped>
.wheel-wrapper {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden;
    scroll-behavior: smooth;
    white-space: nowrap;
    .wheel-scroll {
        min-width: 100%;
        box-sizing: border-box;
        display: inline-block;
    }
}
</style>

<template>
    <div class="wheel-wrapper" ref="scrollWraper">
        <div class="wheel-scroll" ref="cardWraper">
            <slot></slot>
            <!--<template v-for="(card,index) in cards ">-->
                <!--<card :card="card" :key="index" @openVip="openVip"></card>-->
            <!--</template>-->
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import check from "@/util/check";


export default {
    components: {

    },
    props: {

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

            // 30为调整误差
            this.$refs.cardWraper.style.width = width-30 +"px";
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
                this.$emit("onSwiper", page.pageX);
            });
        },
        // 初始化滚动
        initScroll() {
            if (!this.scroll) {
                this.createScroll();
            } else {
                let width = this.getChildrenWidth(this.$refs.cardWraper);

                // 30为调整误差
                this.$refs.cardWraper.style.width = width-30 +"px";
//                this.scroll.wheelTo(0);
                this.scroll.refresh();
            }
        },
        // 跳转到对应页数
        toIndex(index){
            this.scroll.goToPage(index,0,10,'easing');
        },
        // 开通会员
        openVip() {
            this.$emit("update:showPopup", true);
        }
    },
    created() {
        window.onresize = () => {

//            this.createScroll();
        };

    },
    mounted(){
    },

    updated() {

        this.initScroll();
    }
};
</script>