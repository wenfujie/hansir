/*
 * @Author: yongtian.hong
 * @Date: 2018-08-13 13:43:18
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 15:33:29
 * @Description: 物流信息组件
 */
 <style lang='scss' scoped>
.selected {
    color: $maincolor;
    padding-bottom: computed(5) !important;
    border-bottom: solid 2px $maincolor;
}
.input-box {
    height: computed(70);
    input {
        outline: 0;
        border: 0;
        input::placeholder {
            color: #cccccc;
        }
    }
}
</style>
 
 <template>
    <div class="mgB30" v-if="renderSelf">
        <!-- 返修物流 -->
        <div class="bg-white pd30 mgB30">
            <div class="bg-white text-center fs32B">{{title}}</div>
            <!-- 寄回方式填写 -->
            <div v-if="allowFillAddr">
                <div class="mgTb30 flex-center fs28">
                    <div class="w50 flex-between">
                        <div :class="{'selected':state}" @click="select('kdth')">快递寄回</div>
                        <div :class="{'selected':!state}" @click="select('mdth')">退回门店</div>
                    </div>
                </div>
                <!-- 快递寄回 -->
                <div class="mgTb20" v-show="state">
                    <div class="flex-box fs28 mgB20">
                        <div class="w20">收货人:</div>
                        <div class="flex-auto flex-between">
                            <div class="name">{{data.expressRecipient}}</div>
                            <div class="phone">{{phone}}</div>
                        </div>
                    </div>
                    <div class="flex-box fs28">
                        <div class="w20">收货地址:</div>
                        <div class="flex-auto">{{data.changeShopAddress}}</div>
                    </div>
                    <div class="mgT20">
                        <div class="flex-box fs28 mgB20">
                            <div class="w30 flex-vcenter">快递单号</div>
                            <div class="input-box w100 flex-vcenter border1c pdLr10">
                                <van-field
                                    v-model="kdInfo.expressNo"
                                    placeholder="请填写快递单号"
                                    clearable
                                    v-inputfix
                                    @blur.prevent="saveExpressCode()"
                                />
                            </div>
                        </div>
                        <div class="flex-box fs28">
                            <div class="w30 flex-vcenter">物流公司</div>
                            <div
                                class="input-box w100 flex-vcenter border1c pdLr10"
                                @click="selectLogis()"
                            >
                                <div class="flex-auto fs28">{{logis.shippingName||"请选择物流公司"}}</div>
                                <i class="iconfont icon-gengduo grey99"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 退回门店 -->
                <div class="mgTb20" v-show="!state">
                    <div class="flex-box fs32 mgB20">
                        <div class="w30 flex-vcenter">所在地区</div>
                        <div
                            class="input-box w100 flex-vcenter border1c pdLr10"
                            @click="selectArea()"
                        >
                            <div class="flex-auto fs28">{{selectedArea||"请选择地区"}}</div>
                            <i class="iconfont icon-gengduo grey99"></i>
                        </div>
                    </div>
                    <div class="flex-box fs32">
                        <div class="w30 flex-vcenter">选择门店</div>
                        <div
                            class="input-box w100 flex-vcenter border1c pdLr10"
                            @click="selectShop()"
                        >
                            <div class="flex-auto fs28">{{store.dptName||"请选择退回的门店"}}</div>
                            <i class="iconfont icon-gengduo grey99"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 门店地址(选择完门店显示) -->
            <div class="mgTb30 pd20 borderDash grey66 fs28" v-if="!state&&showMdAddr">
                <div class="mgB20 fs32 grey66">门店地址</div>
                <div class="mgB20 flex-box">
                    <div>门店名称:&nbsp;</div>
                    <div class="flex-auto flex-between">
                        <div>{{store.dptName}}</div>
                        <div>{{store.phone||store.mobile}}</div>
                    </div>
                </div>
                <div class="flex-box">
                    <div>收货地址:&nbsp;</div>
                    <div class="flex-auto">{{selectedStoreAddr}}</div>
                </div>
            </div>
            <!-- 快递寄回/退回门店 -->
            <div v-if="showBackupInfo">
                <div class="mgTb20 fs28" v-if="data.expressCode">
                    <div class="mgB20">快递寄回</div>
                    <div class="flex-box">
                        <div>{{data.shipPingName}} :&nbsp;</div>
                        <div class="flex-auto">{{data.expressCode}}</div>
                    </div>
                </div>
                <div class="mgTb20 fs28" v-if="!data.shipPingCode">
                    <div class="mgB20">退回门店</div>
                    <div class="flex-box">
                        <div>{{data.changeShopName}} :</div>
                        <div class="flex-auto pdL20">{{data.changeShopAddress}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 我的收货地址显示/选择 -->
        <div class="flex-box bg-white pd30 mgB30" @click="selectAddr()" v-if="showShAddr">
            <div class="flex-auto">
                <div class="pdB20 fs28">
                    <div class="mgB20 text-center fs32B">我的收货地址</div>
                    <div class="flex-box">
                        <div class="mgR30">{{addrInfo.cargousrName}}</div>
                        <div class="flex-auto">{{addrInfo.cargoMobile}}</div>
                    </div>
                    <div class="mgTb20">{{addrInfo.destDesc+addrInfo.address}}</div>
                </div>
            </div>
            <div class="flex-center">
                <i class="iconfont icon-gengduo grey99" v-if="allowChooseAddr"></i>
            </div>
        </div>
        <!-- 商家寄出 -->
        <div v-if="repairedFinish">
            <logistic :data="logisic" :title="'商家发出'"></logistic>
        </div>
    </div>
</template>
 
 <script>
import { Toast, Field } from "vant";
import { getAddrList } from "@/api/service/user-service";
import check from "@/util/check";
import ordStateMap from "../public/OrdStateMap";
import logistic from "@/components/logistic";
export default {
    props: {
        data: {},
        //选中的地区列表
        area: {},
        //选中的门店
        store: {},
        // 选中的物流
        logis: {},
        // 退回方式切换
        switchBackMode: {
            type: Function
        },
        // 控制门店,物流，省市区弹窗显示
        showLogisList: false,
        showStoreList: false,
        showAreaList: false,
        returnWayCode: ""
    },
    data() {
        return {
            userInfo: {},
            addrInfo: {},
            logisic: {
                shippingWayCode: "kdps", //快递配送方式
                expressCode: "", //快递运营商代码编号，如YTO(圆通)
                expressNo: "" //快递单号
            },
            state: {
                type: Boolean, //true:快递寄回，false:退回门店
                default: true
            },
            title: "",
            //快递寄回
            kdInfo: {
                expressNo: "",
                company: ""
            },
            // 退回门店
            mdInfo: {
                name: "",
                phone: "",
                area: {}, //地区
                store: {} //门店
            },
            renderSelf: false, //控制组件自身是否渲染
            showMdAddr: false, //显示(选择后的)门店地址
            showShAddr: false, //显示用户收货地址
            allowChooseAddr: false, //允许选择地址
            allowFillAddr: false, //允许填写寄回
            showBackupInfo: false, //显示退回信息
            repairedFinish: false, //显示维修完成商家发出
            showlayer: false,
            ordStateMap: ordStateMap,
            selectedArea: "",
            selectedStore: ""
        };
    },
    methods: {
        initState() {
            this.noRenderSelf();
            switch (this.data.returnTypeName) {
                case "换货":
                    this.title = "换货物流";
                    this.Change();
                    break;
                case "返修":
                    this.title = "返修物流";
                    //物流初始化
                    this.logisic.expressNo = this.data.returnShipCode;
                    this.logisic.expressCode = this.data.returnShippingCode;
                    this.Repair();
                    break;
                case "退货退款":
                    this.title = "退货物流";
                    this.Return();
                    break;
                default:
                    this.title = null;
                    this.renderSelf = false;
            }
        },
        //换货
        Change() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.noRenderSelf();
                    break;
                case "待寄回":
                    this.beforFill();
                    break;
                case "已寄回":
                    this.afterFill();
                    break;
                case "处理中":
                    this.afterFill();
                    break;
                case "已完成":
                    this.afterFill();
                    break;
                case "已取消":
                    this.noRenderSelf();
                    break;
                case "已关闭":
                    this.noRenderSelf();
                    break;
                case "已拒绝":
                    this.noRenderSelf();
                    break;
                default:
                    this.noRenderSelf();
            }
        },
        //返修
        Repair() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.noRenderSelf();
                    break;
                case "待支付":
                    this.noRenderSelf();
                    break;
                case "待寄回":
                    this.beforFill();
                    break;
                case "已寄回":
                    this.afterFill();
                    break;
                case "待处理":
                    this.afterFill();
                    break;
                case "已寄出":
                    this.afterFill();
                    break;
                case "处理中":
                    this.afterFill();
                    break;
                case "维修中":
                    this.afterFill();
                    break;
                case "维修完成":
                    this.afterFill();
                    this.repairedFinish = true;
                    break;
                case "已完成":
                    this.afterFill();
                    this.repairedFinish = true;
                    break;
                case "已取消":
                    this.noRenderSelf();
                    break;
                case "已关闭":
                    this.noRenderSelf();
                    break;
                case "已拒绝":
                    this.noRenderSelf();
                    break;
                default:
                    this.noRenderSelf();
            }
        },
        // 退货
        Return() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.noRenderSelf();
                    break;
                case "待寄回":
                    this.beforFill();
                    break;
                case "已寄回":
                    this.afterFill();
                    break;
                case "处理中":
                    this.afterFill();
                    break;
                case "已完成":
                    this.afterFill();
                    break;
                case "已取消":
                    this.noRenderSelf();
                    break;
                case "已关闭":
                    this.noRenderSelf();
                    break;
                case "已拒绝":
                    this.noRenderSelf();
                    break;
                default:
                    this.noRenderSelf();
            }
        },
        beforFill() {
            this.renderSelf = true;
            this.allowFillAddr = true;
            this.allowChooseAddr = true;
            this.showShAddr = true;
            this.showBackupInfo = false;
        },
        afterFill() {
            this.renderSelf = true;
            this.allowFillAddr = false;
            this.allowChooseAddr = false;
            this.showBackupInfo = true;
            this.showMdAddr = false;
            this.showShAddr = true;
            if (!this.data.shipPingCode) {
                this.showShAddr = false;
            }
        },
        noRenderSelf() {
            this.renderSelf = false;
            this.allowFillAddr = false;
            this.allowChooseAddr = false;
            this.showBackupInfo = false;
            this.showShAddr = false;
        },
        // 初始化地址
        async initAddr() {
            if (!this.Storage.get("address")) {
                let params = {
                    vipUsrId: this.Storage.get("USER_INFO").usrId
                };
                let addrList = await getAddrList(params);
                this.addrInfo = addrList[0];
                this.Storage.set("address", this.addrInfo);
            } else {
                this.addrInfo = this.Storage.get("address");
            }
            console.log("物流地址组件", this.data);
        },
        // 切换快递寄回与退回门店
        select(code) {
            this.state = !this.state;
            this.switchBackMode(code);
            if (this.state) {
                this.Storage.set("usrinfo", {});
                this.showShAddr = true;
                this.mdInfo.name = null;
                this.mdInfo.phone = null;
            } else {
                this.Storage.set("EXPRE", {});
                this.showShAddr = false;
                this.kdInfo.expressNo = null;
            }
        },
        // 选择物流公司
        selectLogis() {
            this.showlayer = true;
            this.$emit("update:showLogisList", this.showlayer);
        },
        //选择地区
        selectArea() {
            this.showlayer = true;
            this.$emit("update:showAreaList", this.showlayer);
        },
        // 选择门店
        selectShop() {
            if (this.area.length === 0) {
                Toast("请先选择门店所在地区");
            } else if (check.isEmpty(this.$parent.storeList)) {
                Toast("您所在地区无线下门店");
            } else {
                this.showlayer = true;
                this.$emit("update:showStoreList", this.showlayer);
            }
        },
        //选择地址
        selectAddr() {
            if (this.allowChooseAddr) {
                this.$router.push({
                    name: "addressList",
                    query: {
                        fromPage: "postSale"
                    }
                });
            }
        },
        // 保存快递单号（失焦时触发）
        saveExpressCode() {
            console.log('blur1')
            this.Storage.set("EXPRE", this.kdInfo);
        },
        // 保留用户信息（失焦时触发）
        saveUsrInfo() {
            this.Storage.set("usrinfo", this.mdInfo);
        }
    },
    watch: {
        area: function (list) {
            this.selectedArea = "";
            list.forEach((element, index) => {
                if (index < 2) {
                    this.selectedArea += element.name + "-";
                } else {
                    this.selectedArea += element.name;
                }
            });
        },
        store: function (obj) {
            // 判断门店选择时，如果选中门店且地区也存在,显示门店地址
            if (!check.isEmpty(obj)) {
                this.showMdAddr = true;
            } else {
                this.showMdAddr = false;
            }
            console.log("store", obj);
        },
        data: function (newData) {
            this.initState();
            this.initAddr();
        }
    },
    components: {
        logistic,
        'van-field': Field
    },
    computed: {
        selectedStoreAddr: function () {
            let addr =
                this.store.provinceName +
                this.store.cityName +
                this.store.districtName +
                this.store.address;
            return addr;
        },
        phone: function () {
            if (!check.isEmpty(this.data.expressPhone)) {
                return this.data.expressPhone;
            } else if (!check.isEmpty(this.data.expressMobile)) {
                return this.data.expressMobile;
            }
            return null;
        }
    }
};
</script>
