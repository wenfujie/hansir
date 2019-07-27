
 
<style lang="scss" scoped>
.successBox{
        width:100%;
        height:computed(744);
        border-radius:computed(10);
        position: relative;
        text-align: center;
        img{
            width: 80%;
            // height: 100%;
        }
        .li-row{
            text-align: center;
            .Icon_success{
                margin-top: computed(30);
                display: inline-block;
                width: computed(100);
                height: computed(100);
                border: computed(1) dashed rgb(136, 136,136);
                img{
                    width: 100%;
                    height: 100%;
                }

            }
            .li-word{
                font-size:computed(36);
                font-weight:bold;
                color:rgba(213,175,110,1);
                margin-top: computed(19);
            }
            .li-word1{
                font-size:computed(28);
                font-weight:500;
                color:rgba(102,102,102,1);
                margin-top: computed(60);
            }
            .li-action{
                font-size:computed(28);
                font-weight:500;
                color:rgba(13,14,9,1);
                margin-top: computed(60);
                i{
                    font-size: computed(14);
                    color:rgba(13,14,9,1);
                }
            }
        }
        .closeIcon{
            // border: computed(1) dashed rgb(136,136,136);
            z-index: 10000000;
            width: computed(64);
            height: computed(64);
            display: inline-block;
            position: absolute;
            bottom: computed(-130);
            left: 44%;
            img{
                width: 100%;
                height: 100%;

            }
        }
    }
    .li_word{
        width: 100%;
        text-align: center;
        font-family:PingFang-SC-Heavy;
        font-weight:800;
        color:rgba(196,23,23,1);
        position: absolute;
        top: computed(180);
        .word_style{
            font-size:computed(36);
            .word_num{
                font-size: computed(100);

            }

        }
    }
    .li_go{
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: computed(84);
        .btn{
            display: inline-block;
            width:computed(504);
            height:computed(94);
            background:rgba(246,212,151,1);
            border-radius:computed(8);
            font-size:computed(36);
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(196,23,23,1);
            text-align: center;
            line-height: computed(94);
        }
    }
</style>
<template>
    <van-popup v-model="showDalog" class="pain-dalog_point">
        <div class="successBox">
            <img src="../assets/images/common/ad-newyear.jpg">
            <div class="closeIcon" @click="hideDalog()">
                <img src="../assets/images/volume/Pop_close.png" alt>
            </div>
        </div>
    </van-popup>
</template>

<script>
import {
    Field,
    Icon,
    Picker,
    DatetimePicker,
    Toast,
    Popup,
    RadioGroup,
    Radio
} from "vant";
import { UserService } from "../api/service";
import Storage from "../util/storage";
export default {
    name: 'newYearDialog',
    props: {
        msg: Number,
        required:true,
        custText:String,// 自定义文案
        routerUrl:{// 点击按钮要跳转路由
            default:'/my-vouchers',
            type: String
        },
    },
    components: {
        "van-popup": Popup
    },
    data() {
        return {
            showDalog: true,
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
        jumpMyReserve() {
            if(this.routerUrl){
                this.$router.push(this.routerUrl);
            }
            this.$emit('handleClickBtn')
        },
        hideDalog(){
            this.showDalog = false
            this.$emit('hideDialog')
        },
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