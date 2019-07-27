/*
 * @Author: yongtian.hong
 * @Date: 2018-09-18 20:55:02
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-12 20:32:20
 * @Description: 订单分享页面
 */
 <style lang='scss' scoped>
.share-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .top {
    padding: computed(30);
  }
  .title {
    font-family: "PingFang SC";
    font-weight: bold;
    font-size: computed(30);
    margin: computed(25) 0;
    text-align: center;
    .userName {
      font-size: computed(36);
      color: #2ba4f3;
    }
  }
  .sub-title {
    font-size: computed(28);
    font-family: "PingFang-SC-Medium";
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    text-align: center;
  }
  .img-box {
    width: computed(690);
    height: computed(690);
    margin-top: computed(60);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .goodName {
    font-size: computed(36);
    font-family: "PingFang-SC-Medium";
    color: rgba(13, 14, 9, 1);
    margin-top: computed(30);
  }
  .price {
    font-size: computed(36);
    font-family: "PingFang-SC-Bold";
    font-weight: bold;
    color: $maincolor;
    margin: computed(20) 0;
  }
  .title-zp {
    font-size: computed(36);
    font-family: "PingFang-SC-Bold";
    font-weight: bold;
    color: rgba(128, 128, 128, 1);
    margin: computed(30) 0;
    text-align: center;
  }
  .imgs {
    display: flex;
    flex-wrap: wrap;
    .child {
      margin-top: computed(10);
      padding-right: computed(20);
      img {
        width: computed(210);
        height: computed(210);
      }
    }
  }
  .bottom {
    height: computed(100);
    // background: #2ba4f3;
    .left {
      width: computed(100);
      height: computed(100);
    }
  }
}
</style>
 
 <template>
  <div class="share-wrap flex-vbox">
    <div class="top flex-auto overflow-scroll">
      <div class="sp">
        <div class='title'><span class="userName">{{username}}</span><span> 的订单分享</span></div>
        <div class="sub-title">都是精心挑选的好货，赶快来看看</div>
        <div v-for="(item,index) in goodsList" :key="index">
          <!-- 商品图 -->
          <!-- <div class='img-box' @click="goDetail(item)"> -->
          <div class='img-box'>
            <img :src="getShareImg(item.thumb, baseInfo.companyId)" onerror="errImg(event)">
          </div>
          <!-- 商品名 -->
          <div class="goodName">{{item.goodsName}}</div>
          <!-- 价格 -->
          <div class="price">￥{{item.costPrice}}</div>
        </div>
      </div>
    </div>
    <div class="bottom flex-box fs36">
      <div class="left flex-center flex-vbox" @click='saveShareItem'>
        <i class="iconfont icon-zan1 fs40"></i>
        <span class="fs24">{{likesCount}}</span>
      </div>
      <div class="flex-auto flex-center bg-red white" @click="goToPath">再去逛逛</div>
    </div>
  </div>

</template>
 
 <script>
import Vue from "vue";
import check from "@/util/check.js";
import Storage from "@/util/storage";
import { UserService, Order } from "@/api/service";
export default {
  data() {
    return {
      goodsList: [],
      username: "",
      likesCount: 0,
      baseInfo: {},
      isSaved: false
    };
  },
  methods: {
    getShareItem() {
      // console.log("shareItem", this.baseInfo)
      // let query = this.getQueryData()
      let param = {
        usrId: this.baseInfo.usrId,
        companyId: this.baseInfo.companyId,
        ownCompanyId: this.baseInfo.companyId,
        billCode: this.baseInfo.billCode
      };
      Order.getShareItem(param).then((res) => {
        if (!res) {
          this.saveShareInfo(param);
          return;
        }
        this.username = res.buyUsrName;
        this.likesCount = res.likesCount;
        this.baseInfo.usrId = res.buyUsrId;
      });
    },
    getGoodsInfo() {
      // let query = this.getQueryData()
      let param = {
        busContsCode: baseConstant.busContsCode,
        usrId: this.baseInfo.usrId,
        companyId: this.baseInfo.companyId,
        ownCompanyId: this.baseInfo.companyId,
        billCode: this.baseInfo.billCode
      };
      Order.getDetailInfo(param).then((res) => {
        this.goodsList = this.getGoodsList(res.data.packages);
      });
    },
    getQueryData() {
      let query = this.$route.query;
      this.baseInfo = {
        billCode: query.billCode,
        companyId: query.companyId,
        ownCompanyId: query.companyId,
        usrId: query.usrId
      };
      // 获取订单分享信息
      this.getShareItem();
      // 获取常数值
      this.getGoodsInfo();
      // return {billCode: billCode, companyId: companyId}
    },
    saveShareInfo(param) {
      Order.saveShareInfo(param).then((res) => {
        this.getShareItem();
        console.log("初始化订单分享数据", res);
      });
    },
    saveShareItem() {
      this.baseInfo.model = {
        likesCount: 1,
        reprintedCount: 1,
        readCount: 1
      };
      if (this.isSaved) this.baseInfo.model.likesCount = -1;
      console.log(this.baseInfo);
      Order.saveShareItem(this.baseInfo).then((res) => {
        if (this.isSaved) {
          this.likesCount -= 1;
        } else {
          this.likesCount += 1;
        }
        this.isSaved = !this.isSaved;
      });
    },
    getGoodsList(packages) {
      let productList = [];
      packages.forEach((item) => {
        productList = productList.concat(item.data.goodsList);
      });
      return productList;
    },
    //  跳转详情
    goDetail(item) {
      if (item.orderFlag === 0) {
        isAuthorize("/goods-detail?goodsCode=" + item.goodsCode, this);
        // this.$router.push('/goods-detail?goodsCode=' + item.goodsCode)
      } else {
        isAuthorize("/goods/web-design?goodsCode=" + item.goodsCode, this);
        // this.$router.push('/goods/web-design?goodsCode=' + item.goodsCode)
      }
    },
    goToPath() {
      isAuthorize("/show", this);
    }
  },
  created() {
    this.getQueryData();
  }
};
</script>
