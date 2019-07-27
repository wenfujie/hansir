/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 14:34:38
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-13 15:41:03
 * @Description: 物流进度组件
   @传入数据结构说明 
   data:{
     shippingWayCode:"kdps",//快递配送方式
     expressCode:"",//快递运营商代码编号，如YTO(圆通)
     expressNo:""//快递单号
   } 
 */
 <style lang='scss' scoped>
.rotatingUp {
  transition: all 0.5s;
  transform: rotate(-180deg);
  display: inline-block;
}
.rotatingDown {
  transition: all 0.5s;
  display: inline-block;
}
</style>
 
 <template>
  <div class="bg-white pdTb10 mgB30" v-if="isReady">
    <div class="fs30B text-center mgT30">{{title}}</div>
    <van-steps direction="vertical" :active="0" active-color="#C41717">
      <van-step v-for="(step,index) in sliceList" :key="index">
        <h3>{{step.acceptStation}}</h3>
        <p>{{step.acceptTime}}</p>
      </van-step>
    </van-steps>
    <div class="fs26 text-center pdTb10" @click="toggle()">
      {{actionName}}
      <i
        class="iconfont icon-down"
        :class="{rotatingUp:direction,rotatingDown:!direction}"
      ></i>
    </div>
    
  </div>

</template>
 
 <script>
import { Step, Steps, Toast } from "vant";
import check from "@/util/check";
import thirdPartyApi from "@/api/service/thirdParty";
export default {
  props: {
    data: {},
    title: {
      type: String,
      default: "物流信息"
    }
  },
  data() {
    return {
      logis: {},
      logisCache: {},
      traceList: [],
      sliceList: [],
      actionName: "展开",
      direction: false,
      isReady: false
    };
  },
  components: {
    "van-steps": Steps,
    "van-step": Step
  },
  methods: {
    // 获取物流
    async getLogisInfo() {
      this.logis = {};
      let params = {
        expressCode: this.data.expressCode,
        logisticCode: this.data.expressNo
      };
      if (!check.isEmpty(this.logisCache[this.data.expressNo])) {
        this.logis = this.logisCache[this.data.expressNo];
      } else {
        this.logis = await thirdPartyApi.getLogis(params).catch(() => {
          Toast("获取物流信息失败");
        });
        this.logisCache[this.data.expressNo] = this.logis;
      }
      if (check.isEmpty(this.logis)) return;
      this.isReady = true;
      this.traceList = this.logis.data.traceList;
      this.sliceList = this.traceList.slice(0, 2);
    },

    toggle() {
      if (this.sliceList.length <= 2) {
        this.sliceList = this.traceList;
        this.actionName = "收起";
        this.direction = true;
      } else {
        this.sliceList = this.traceList.slice(0, 2);
        this.direction = false;
        this.actionName = "展开";
      }
    },
    initData() {
      this.isReady = false;
      if (this.data.shippingWayCode === "kdps" && this.data.expressNo) {
        this.getLogisInfo();
      }
    }
  },
  created() {
    this.initData();
  },
  watch: {
    data: function() {
      this.initData();
    }
  }
};
</script>

