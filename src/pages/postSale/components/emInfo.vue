<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 刺绣详情
 * @Date: 2019-03-20 19:29:48
 * @LastEditTime: 2019-03-21 17:40:51
 -->
 
 <style lang='scss' scoped>
.popup-wrap {
    width: 100%;
    max-height: 60vh;
    .content {
        display: flex;
        flex-direction: column;
        padding: computed(30);
        .title {
            color: #0d0e09;
            font-size: computed(36);
            text-align: center;
            margin-bottom: computed(30);
        }
        // 绣字绣花
        .emb,
        .emb-print {
            width: 100%;
            padding: 0 computed(30);
            box-sizing: border-box;
            .row-content {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: computed(28);
                padding-bottom: computed(30);
                margin-bottom: computed(30);
                border-bottom: solid 1px #f5f5f5;
                .left {
                    font-weight: 500;
                }
                .right {
                    font-weight: bold;
                }
            }
            .row-content:last-child {
                margin-bottom: computed(10);
                border: none;
            }
        }
    }
}
.fix-height {
    max-height: 80vh;
}
.thumb {
    width: computed(80);
    height: computed(80);
    img {
        max-width: 100%;
    }
}
</style>
 
 <template>
    <van-popup v-model="display" class="popup-wrap" position="bottom">
        <div class="content" v-if="part">
            <p class="title">刺绣详情</p>
            <!-- 绣字 -->
            <div class="emb" v-if="emb">
                <div class="row-content">
                    <div class="left">刺绣金额</div>
                    <div class="right">¥{{emb.price}}</div>
                </div>
                <div class="row-content">
                    <div class="left">刺绣位置</div>
                    <div class="right">{{part.regionName}}</div>
                </div>
                <div class="row-content">
                    <div class="left">中英文刺绣</div>
                    <div class="right">{{emb.content}}</div>
                </div>
                <div class="row-content">
                    <div class="left">刺绣字体</div>
                    <div class="right">{{emb.ictEmbfontsHdName}}</div>
                </div>
                <div class="row-content">
                    <div class="left">刺绣颜色</div>
                    <div class="right">{{emb.colorName}}</div>
                </div>
            </div>
            <!-- 绣花 -->
            <div class="emb-print" v-if="emp">
                <div class="row-content">
                    <div class="left">刺绣金额</div>
                    <div class="right">¥ {{emp.price}}</div>
                </div>
                <div class="row-content">
                    <div class="left">刺绣位置</div>
                    <div class="right">{{part.regionName}}</div>
                </div>
                <div class="row-content" v-if="emp.colorName">
                    <div class="left">刺绣颜色</div>
                    <div class="right">{{emp.colorName}}</div>
                </div>
                <div class="row-content">
                    <div class="left">星座刺绣</div>
                    <div class="right">
                        <div class="thumb">
                            <img :src="getImg(emp.embPrintPictUrl)" alt>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-button" @click="close()">关闭</div>
    </van-popup>
</template>

 <script>
import check from "@/util/check";
import { Popup, Toast } from "vant";
export default {
    components: {
        "van-popup": Popup
    },
    props: {
        good: {
            type: Object,
            default: function () {
                return {
                    parts: []
                }
            }
        },
        value: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            display: false,
            // 定价类型
            DJTYPE: {
                10260501: false,
                10260502: true
            }
        };
    },
    methods: {
        // 关闭组件自身
        close() {
            this.display = false;
            this.$emit('input', false);
        }
    },

    computed: {
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
        }

    },
    watch: {
        good: function (val) {
            if (check.isEmpty(val)) {
                return {
                    parts: []
                }
            }
        },
        value: function (val) {
            if (val) {
                this.display = val;
            }

        },
        display: function (val) {
            if (!val) {
                this.$emit('input', false);
            }

        },

    }
};
</script>
