<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-13 10:16:42
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-01-09 14:05:03
 * @Description: 预约量体入口
 -->


<style lang='scss' scoped>
.circle,.overlay{
  position: absolute;
  right: computed(30);
  bottom: computed(120);
  z-index:100;
  width: computed(100);
  height: computed(100);
  border-radius:50%; 
  font-size: computed(26);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 5px 5px #999;
  .dot{
    position: absolute;
    top:computed(3);
    right: computed(8);
    width: computed(20);
    height: computed(20);
    border-radius:50%; 
    background-color: red;
  }
}
</style>

<template>
    <div class="circle" @click="appointMeasure()" v-if="render">
        <div class="dot"></div>
        <span>{{text.action}}</span>
        <span>{{text.objName}}</span>
    </div>
</template>

<script>
import * as volumeApi from '@/api/service/volume'
import { Toast } from 'vant';
export default {
    props: {
        order: Object
    },
    data() {
        return {
            goodCodes: [],
            msg: {
                "D_MSROPMSR": {
                    action: "预约",
                    objName: "量体"
                },
                "D_MSROPSIZE": {
                    action: "完善",
                    objName: "身型"
                }
            },
            text: {
                action: "",
                objName: ""
            },
            measureType: {
                "D_MSROPMSR": false,
                "D_MSROPSIZE": true
            },
            type: false
        }
    },
    computed: {
        render: function () {
            return this.order.isNeedShowMeasureEntry;
        }
    },
    methods: {
        // 预约量体
        appointMeasure() {
            let sdata = {
                usrId: Storage.get('USER_INFO').usrId,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                companyId: Storage.get("COMPANYID").company_id,
                goodsCodes: this.goodCodes.toString(),
                busContsCode: 'D_BUSCONTS_WSC'
            }
            volumeApi.getMeasureOpInfo(sdata).then((res) => {
                if (res.measureOpCode == 'D_MSROPSIZE') {
                    document.title = '身型信息'
                    Storage.set("measureOpCode", { measureOpCode: 'D_MSROPSIZE' });
                    this.$router.replace({
                        name: 'aiCountBody',
                        path: '/aiCountBody',
                        params: {
                            fromPage: 'order',
                            billCode: this.otherBillCode
                        }
                    })
                }else{
                    this.$router.push({
                        name: 'reserve',
                        path: '/reserve',
                        params: {
                            billCode: this.order.billCode,
                            fromPage: 'order',
                            goodCodes: this.goodCodes
                        }
                    })
                }
            },() => {
                Toast("提交出错了~");
            }
        );
            /* this.$router.push({
                name: 'reserve',
                path: '/reserve',
                params: {
                    billCode: this.order.billCode,
                    goodCodes: this.goodCodes,
                    fromPage: 'order',
                    type: this.type
                }
            }) */
        },
        // 获取
        async getMeasureType(order) {
            if (!order.isNeedShowMeasureEntry) return;
            order.goodsList.forEach(good => {
                this.goodCodes.push(good.goodsCode)
            });
            let params = {
                usrId: Storage.get('USER_INFO').usrId,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                companyId: Storage.get("COMPANYID").company_id,
                goodsCodes: this.goodCodes.toString(),
                busContsCode: 'D_BUSCONTS_WSC'
            }
            volumeApi.getMeasureOpInfo(params).then((result) => {
                this.type = this.measureType[result.measureOpCode];
                this.text = this.msg[result.measureOpCode];
                console.log("text", this.text)
            }, err => {
                Toast("获取量体类型失败")
            });
        }
    },
    watch: {
        order: function (ord) {
            this.getMeasureType(ord)
        }
    }

}
</script>