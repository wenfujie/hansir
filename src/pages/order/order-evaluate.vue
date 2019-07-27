/*
* @Author: zhibin.zhao
* @Date: 2018-10-17 15:41:10
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 18:00:05
* @Description: 订单商品评价页面
*/
<style lang="scss" type="text/scss" scoped>
.imgBox {
  width: computed(160);
  height: computed(160);
  img {
    width: 100%;
    height: 100%;
  }
}
.textarea {
  flex: 1;
  outline: 0;
  border: 0;
  color: #cccccc;
  font-size: computed(28);
  background: #f5f5f5;
  box-sizing: border-box;
  padding: computed(20);
}
textarea {
  width: 100%;
  outline: 0;
  border: 0;
  color: #cccccc;
  min-height: computed(120);
  font-size: computed(28);
  background: #f5f5f5;
}
textarea::placeholder {
  font-weight: normal;
  font-family: "PingFang-SC-Medium";
  color: #cccccc;
}
.btn-submit {
  height: computed(100);
  font-size: computed(32);
  color: #fff;
  background-color: #c41717;
}
.wh100 {
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="flex-vbox  wh100 bg-gray ">
    <div class="flex-auto  overflow-scroll ">
      <div v-for="(item, index) in goodsList" :key="index" class="pd30 mgB30 bg-white">
        <!-- 衣服+评价 -->
        <div class="flex-box">
          <div class="imgBox" :class="{'cusTag':item.orderFlag===1}">
            <img :src="getImg(item.thumb)" onerror="errImg(event)">
            <!-- <img v-show="item.orderFlag==1" class="customization" src=" "> -->
          </div>
          <!--  -->
          <div class="mgL30 ">
            <!-- 商品评价 -->
            <div class="mgB10">
              <div class="pdL10 fs28B mgB10">商品评价</div>
              <div class="flex-box">
                <van-rate v-model="item.commentScore" :size="20" :count="5" color="#D5AF6E" void-color="#ccc" />
                <span class="fs28">&nbsp;&nbsp;{{commentScoreDesc[item.commentScore]}}</span>
              </div>

            </div>
            <!-- 着装师评价 -->
            <div v-if="item.orderFlag==1">
              <div class="pdL10 fs28B mgB10">着装师评价</div>
              <div class="flex-box">
                <van-rate v-model="item.msrCommentScore" :size="20" :count="5" color="#D5AF6E" void-color="#ccc" />
                <span class="fs28">&nbsp;&nbsp;{{msrCommentScoreDesc[item.msrCommentScore]}}</span>
              </div>
            </div>

          </div>

        </div>
        <!-- 评价输入 -->
        <div class="w100 mgT30 textarea">
          <textarea id="" cols="200" maxlength="150" placeholder="商品满足您的期待吗？说说您的体验" v-model='item.reasonMemo'> </textarea>
          <div class="flex-end">{{item.reasonMemo?item.reasonMemo.length:0}}/150</div>
        </div>

        <upload-file :good="item" :images.sync="goodsList[index].commentPictList"></upload-file>

      </div>
    </div>
    <button class="btn-submit" v-if="goodsList.length > 0" @click="submitEvaluate">提交</button>
  </div>
</template>

<script>
import { Rate, Toast } from "vant";
import Storage from "@/util/storage";
import { Order } from "@/api/service";
import uploadFile from "@/pages/order/components/uploadFile";
export default {
  name: "order-evaluate",
  data() {
    return {
      goodsList: [],
      commentScoreDesc: [
        "",
        "不合体",
        "不合体",
        "基本合体",
        "合体",
        "非常合体"
      ],
      msrCommentScoreDesc: ["", "不满意", "不满意", "一般", "满意", "非常满意"]
    };
  },
  components: {
    "van-rate": Rate,
    uploadFile
  },
  methods: {
    getGoodsInfo() {
      // let ordInfo = Storage.get("ordInfo");
      let companyId = Storage.get("COMPANYID").company_id;
      // let userInfo = Storage.get('USER_INFO')
      let param = {
        busContsCode: baseConstant.busContsCode,
        usrId: "",
        companyId: companyId,
        ownCompanyId: companyId,
        billCode: this.$route.query.billCode
      };
      Order.getDetailInfo(param).then((res) => {
        console.log(res);
        this.goodsList = this.getGoodsList(res.data.packages);
        console.log(this.goodsList);
      });
    },

    submitEvaluate() {
      // let ordInfo = Storage.get("ordInfo");
      let companyId = Storage.get("COMPANYID").company_id;
      let userInfo = Storage.get("USER_INFO");
      let param = {
        companyId: companyId,
        usrId: userInfo.usrId,
        model: {
          anonymousFlag: 0, //1匿名
          billCode: this.$route.query.billCode,
          buscontsCode: baseConstant.busContsCode,
          shopCode: userInfo.shopCode,
          usrId: userInfo.usrId
        }
      };
      let object = this.getEvaluate();
      if(object.flag == 1){
          Toast('商品评分是必填项哦~');
          return
      } else if(object.flag == 2){
          Toast('量体师评分是必填项哦~');
          return
      }
      param.model.goodsCommentList = object.goodsCommentList
      // console.log("评价提交参数", param)
      Order.ordComment(param).then((res) => {
        console.log("评价完成", res); //成功返回1
        //返回订单列表
        this.$router.replace({
          name: "orderList",
          path: "/orderList"
        });
      });
    },
    getEvaluate() {
      let goodsCommentList = [];
      let flag = 0;
      this.goodsList.forEach(function(item, index) {
        goodsCommentList.push({
          commentMemo: item.reasonMemo, //备注
          commentScore: item.commentScore, //商品评分
          commentTypeCode: "D_MASPART", //D_MSR 量体师评价，D_MASPART商品评价
          goodsCode: item.goodsCode,
          rtlOrdDtId: item.saleOrdDtId, //订单明细ID，没件商品标识
          commentPictList: item.commentPictList // 商品评价图片
        });
        if(!item.commentScore) flag = 1;
        if (item.orderFlag == 1) {
          goodsCommentList[index].msrCommentScore = item.msrCommentScore; //量体师评分
          if(!item.msrCommentScore) flag = 2;
        }
      });
      return {flag: flag, goodsCommentList: goodsCommentList}
    },
    /* setStorage() {
      Storage.set("ordInfo", this.$route.params);
    }, */
    getGoodsList(packages) {
      let productList = [];
      packages.forEach((item) => {
        productList = productList.concat(item.data.goodsList);
      });
      return productList;
    }
  },
  created() {
    // this.setStorage();
  },
  mounted() {
    this.getGoodsInfo();
  }
};
</script>

