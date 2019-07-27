/*
 * @Author: yongtian.hong
 * @Date: 2018-11-08 17:35:27
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-16 16:16:50
 * @Description: 定制清单组件(用于订单详情)

   @params 
   {
     billCode:'',
   }
 */
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
    position: relative;
    width: computed(80);
    height: computed(80);
    img {
        max-width: 100%;
    }
    .embName {
        position: absolute;
        right: 0;
        min-width: 300%;
        text-align: right;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: computed(16);
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
                            <div class="embName">{{emp.embName}}</div>
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
import * as goodApi from "@/api/service/goods";
import { Popup, Toast } from "vant";
export default {
    components: {
        "van-popup": Popup
    },
    props: {
        params: {}
    },
    data() {
        return {
            good: {},
            display: false,
            goods: {},
            // 定价类型
            DJTYPE: {
                10260501: false,
                10260502: true
            }
        };
    },
    methods: {
        // 判断该商品是否请求过定制清单
        isRequested() {
            let keys = Object.keys(this.goods);
            let id = this.params.saleOrdDtIds.toString();
            return keys.includes(id);
        },
        // 缓存请求结果，减少数据请求
        cacheResult(good) {
            this.goods[this.params.saleOrdDtIds] = good;
        },
        getDataFromCache() {
            return this.goods[this.params.saleOrdDtIds]
        },
        render() {
            setTimeout(() => {
                if (this.emb && this.emp) {
                    this.display = false;
                } else {
                    this.display = true;
                }
            }, 20)

        },
        // 获取定制清单
        async getCustomList() {
            if (this.isRequested()) {
                this.good = this.getDataFromCache();
                this.render();
                return;
            }
            this.saleOrdDtId = this.params.saleOrdDtIds;
            let result = await goodApi.getCustomList(this.params).catch((err) => {
                Toast("获取定制清单失败,请稍后再试");
            });
            let keys = Object.keys(result.data);
            this.good = Object.assign({}, result.data[keys[0]]);
            if (check.isEmpty(this.good)) {
                Toast("查询不到该商品的定制清单");
                return;
            } else if (
                check.isEmpty(this.good.mainFab) &&
                check.isEmpty(this.good.partsDto)
            ) {
                Toast("查询不到该商品的定制清单");
                return;
            }
            // 缓存数据
            this.cacheResult(this.good)
            // 
            this.render();
        },
        // 关闭组件自身
        close() {
            this.display = false;
        }
    },

    computed: {
        part: function () {
            if (check.isEmpty(this.good.partsDto)) return null;
            const part = this.good.partsDto.filter((part) => {
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
        params: "getCustomList"
    }
};
</script>
