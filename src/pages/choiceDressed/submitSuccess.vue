
<template>
  <div class="point-detail bg-gray pain-style" :class="{ 'flex-vbox' : showEmpty === true }">
    <div class="bg-white">
      <div class="bg-img">
        <img src="../../assets/images/volume/Icon_success.png">
      </div>
      <div class="bg-value">恭喜您，提交成功！</div>
    </div>
    <div class="youhui">
      <div class="left">
        <img src="../../assets/images/volume/youhui.png" alt>
      </div>
      <span class="middle">前往领劵中心，各式优惠券带您领取</span>
      <span class="right" @click="jumpQuanCenter">去领券</span>
    </div>
    <div class="point-content">
      <div class="point-title">为您推荐
        <div @click="lookMore" class="lookMore">
          查看更多
          <i class="iconfont icon-gengduo"></i>
        </div>
      </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
      <ul class="point-ul">
        <li class="point-li" v-for="(item,index) in list" :key="index">
          <div @click="jumpPage(index)">
            <div class="li-img">
              <img :src="getImg(item.fileUrl)" alt>
              <div class="img-tip">定制</div>
            </div>
            <div class="li-title">{{item.platformProdName}}</div>
            <div class="li-money">
              <span class="r-monney">￥{{item.salePrice}}</span>
              <!-- <span class="s-monney">¥5,371</span> -->
            </div>
          </div>
        </li>
      </ul>
      <empty emptyText="无积分抵用券~" v-show="showEmpty"></empty>
    </van-pull-refresh>
    </div>
    <van-popup v-model="showDalog" class="pain-dalog">
      <div class="successBox">
        <ul>
          <li class="li-row">
            <div class="Icon_success">
              <img src="../../assets/images/volume/Icon_success.png" alt>
            </div>
          </li>
          <li class="li-row">
            <div class="li-word">兑换成功!</div>
          </li>
          <li class="li-row">
            <div class="li-action">
              前往查看&nbsp;
              <i class="iconfont icon-gengduo"></i>
            </div>
          </li>
        </ul>
        <div class="closeIcon" @click="showDalog = false">
          <img src="../../assets/images/volume/Pop_close.png" alt>
        </div>
      </div>
    </van-popup>
    <letter @close="letterClose" :letterShow="letterShow"></letter>
    <!-- <van-data-From v-if="show"></van-data-From> -->
    <van-data-Dialog :show = "show" v-bind:msg="msg"></van-data-Dialog>
  </div>
</template>
<script>
import { Volume, Cms, Payment, UserService } from "../../api/service";
import { Point, MeasureMaster } from '../../api/service'
import { Popup, Toast, Dialog, PullRefresh } from 'vant';
import { Goods } from "../../api/service";
import Storage from '../../util/storage';
import shopPointDialog from '@/components/shopPointDialog.vue';
import letter from './components/letter';
import Empty from '../../components/EmptyContent.vue'
// import BodyDataForm from '@/components/BodyDataForm.vue';
export default {
  components: {
    "van-popup": Popup,
    // "van-data-From": BodyDataForm,
    "van-data-Dialog": shopPointDialog,
    'van-pull-refresh': PullRefresh,
    'empty': Empty,
    letter
  },
  data() {
    return {
      letterShow:null,
      show: false,
      list: [],
      showDalog: false,
      pointInfo: {},
      showEmpty: false,
      close: false,
      msg:null,
      dialogShow:false,
      isLoading: false  // 是否处于下拉刷新状态
    }
  },
  // watch: {
      // '$route': (to, from) => {
      //     console.log('~~~~~~~~~~~',from)
          // if (to.path == "/my-vouchers") {
          //     console.log("222222",from);
          // console.log('~~~~~~~~~~~',from)
          // } else {
          //     console.log("222222",from);
          // console.log('~~~~~~~~~~~',from)
          // }
      // }
  // },
  // beforeRouteEnter(to,from,next){
  //           next((vm) => {
  //               console.log(vm)
  //                   if(from.path =='/goods-embroider'){
  //                       console.log('to222',to.path,'from',from.path)
  //                       vm.fromPage = true
  //                   }
  //           })
  //       },
  methods: {
    lookMore () {
        this.$router.push("/goods-sort");
    },
    letterClose () {
      if(this.dialogShow){
        this.show = true;
      }
    },
    jumpPage(index) {
      if (this.list[index].ptiPartHdId != '' && this.list[index].ptiPartHdId != null && this.list[index].ptiPartHdId != undefined) {
        
        let goodscode = 'singleGood'
        this.$router.replace("/goods-detail?goodsCode=" + this.list[index].platformProdCode + '&goodsType=' + goodscode);
        
      } else {
        let goodscode = 'groupGoods'
        this.$router.replace("/goods-detail?goodsCode=" + this.list[index].platformProdCode + '&goodsType=' + goodscode);
      }
    },
    toggleSelected(index) {
      this.list[index].isSelected = !this.list[index].isSelected;
    },
    sale(index) {
      Dialog.confirm({
        title: '确定要兑换该卷吗？',
        confirmButtonText: '确定兑换',
        cancelButtonText: '暂时不换'
      }).then(() => {
        if (this.list[index].pointsEnough) {
          let adata = {
            dptId: Storage.get('USER_INFO').shopId,
            swopCtCardId: this.list[index].id,
            usrId: Storage.get('USER_INFO').usrId,
            ownCompanyId: Storage.get("COMPANYID").company_id,
            companyId: Storage.get("COMPANYID").company_id,
          }
          MeasureMaster.sellCardData(adata).then(
            (res) => {
              if (res == 1) {
                this.showDalog = !this.showDalog
              }
              else {
                Toast("兑换失败！！！");

              }

            },
            () => {
              Toast("提交出错了~");
              this.btnLock = false;
            }
          );

        } else {
          Toast("兑换失败，积分不足");
        }

      }).catch(() => {
        // on cancel
      });
    },
    /**
     * 
     * 跳转
     */
    jumpMyReserve() {
      this.$router.replace("/my-vouchers");
    },
    jumpQuanCenter() {
      this.$router.replace("/vouchers-list");
    },
    //  下拉刷新
    onRefresh() {
        this.getPage()
    },
    getPage() {
      let data = {}
      Point.getPointDetail(data).then((res) => {
        if (res.list.length > 0) {
          this.showEmpty = false
          let time = new Date()
          let year = time.getFullYear()
          let month = time.getMonth() + 1
          res.list.forEach((item) => {
            item.title = ''  // 初始化显示标题
            if ((item.date.substring(0, 4)).indexOf(year) === -1) {
              //  判断是否同年
              item.title = item.date
            } else {
              //  判断是否是当前月
              if ((item.date.substr(item.date.length - 2)).indexOf(month) !== -1) {
                item.title = '本月'
              } else {
                item.title = item.date.substr(item.date.length - 2) + '月'
              }
            }
          })
        } else {
          this.showEmpty = true
        }
        this.isLoading = false
        this.pointInfo = res
      })
    }
  },
  
  created() {
    let adata = {
      findType: 'D_LABEL_O5',
      pageNum: 1,
      pageSize: 10,
      usrId: Storage.get('USER_INFO').usrId,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      companyId: Storage.get("COMPANYID").company_id,
      buscontsCode: "D_BUSCONTS_WSC",
      shopId: Storage.get('USER_INFO').shopId
    }
    Goods.getPutGoods(adata).then(
      (res) => {
        this.list = res.list
        if(this.list.length == 0) this.showEmpty = true
      },
      () => {
        Toast("提交出错了~");
        this.btnLock = false;
        this.letterShow = false
      }
    );
    this.getPage()
    var s_billCode = this.$route.params.billCode || this.$route.query.billCode
    if (s_billCode != ''&& s_billCode != undefined && s_billCode != null) {
      let data = {
        usrId: Storage.get('USER_INFO').usrId,
        ownCompanyId: Storage.get("COMPANYID").company_id,
        companyId: Storage.get("COMPANYID").company_id,
        billCode: s_billCode
      }
      if (this.$route.params.type == true) {
        return;
      }
      
      if (!!Storage.get("setOne") ) {
        
        if(Storage.get("setOne").setOne == s_billCode){
        this.letterShow = false
           this.show = false
              this.dialogShow = false
            return
        }
      }
      if(this.$route.query.fromPage == 'payCode'){
        Volume.sendCoupons(data).then(
          (res) => {
            // var v_data = { }
            // this.$set(v_data, res[j].ymd, b_array)
            Storage.set("setOne", { setOne: s_billCode });
            if (res != null && res != undefined && res != '') {
              if(res > 0 ){
                console.log("有券")
              // 领券时候不展示感谢信
                this.letterShow = false
                this.show = true
                this.dialogShow = true
                this.msg = res
              }
              else{
                this.show = false
              this.dialogShow = false
              this.letterShow = true
              }
            }
            else{
                console.log("没券")
                this.show = false
              this.dialogShow = false
              this.letterShow = true
              console.log(this.letterShow)
              }
          },
          () => {
            Toast("提交出错了~");
            this.btnLock = false;
          }
        );
      }

    }
    // let data ={
    //     usrId: 1182,
    //     ownCompanyId: 239,
    //     companyId:239,
    //     billCode:'QS000220190102114705001'
    // }


  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.lookMore{
  float: right;
}
.point-ul {
  .point-li:nth-child(2n + 2) {
    margin-left: computed(30);
  }
  .point-li {
    display: inline-block;
    position: relative;
    margin-top: computed(36);
    width: computed(330);
    .li-title {
      overflow: hidden;
      text-overflow: ellipsis; //文本溢出显示省略号
      white-space: nowrap;
      margin-top: computed(24);
      font-size: computed(28);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(13, 14, 9, 1);
    }
    .li-money {
      margin-top: computed(30);
      .r-monney {
        font-size: computed(26);
        font-family: DIN-Bold;
        font-weight: bold;
        color: rgba(13, 14, 9, 1);
        margin-right: computed(19);
      }
      .s-monney {
        font-size: computed(26);
        font-family: DIN-Medium;
        font-weight: 500;
        text-decoration: line-through;
        color: rgba(153, 153, 153, 1);
      }
    }
    .li-img {
      width: computed(330);
      height: computed(330);
      img {
        width: 100%;
        height: 100%;
      }
      .img-tip {
        position: absolute;
        top: 0;
        left: 0;
        width: computed(60);
        height: computed(30);
        line-height: computed(30);
        color: white;
        text-align: center;
        font-size: computed(25);
        background-color: rgb(213, 175, 110);
      }
    }
  }
}
.youhui {
  background-color: white;
  margin-top: computed(20);
  height: computed(100);
  line-height: computed(100);
  overflow: hidden;
  .left {
    display: inline-block;
    float: left;
    width: computed(59);
    height: computed(63);
    margin-left: computed(29);
    margin-top: computed(19);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .middle {
    float: left;
    margin-left: computed(30);
    font-size: computed(28);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(13, 14, 9, 1);
  }
  .right {
    float: right;
    width: computed(114);
    height: computed(56);
    text-align: center;
    line-height: computed(56);
    margin-right: computed(30);
    margin-top: computed(19);
    border: 1px solid rgba(153, 153, 153, 1);
  }
}
.point-detail {
  min-height: 100vh;
  overflow: hidden;
  .bg-white {
    overflow: hidden;
  }
  .bg-value {
    margin-bottom: computed(32);
    text-align: center;
    font-size: computed(30);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(13, 14, 9, 1);
  }
  .bg-img {
    margin-top: computed(50);
    text-align: center;
    margin-bottom: computed(44);
  }
  .bg-img img {
    width: computed(100);
    height: computed(100);
  }
  .point-title {
    font-size: computed(26);
    line-height: computed(30);
    margin-top: computed(29);
    text-align: center;
    color: rgba(153, 153, 153, 1);
  }
  .point-value {
    font-size: computed(72);
    line-height: computed(74);
    margin: computed(29) 0;
    text-align: center;
    color: #c41717;
    font-family: "DIN-Bold";
    font-weight: bold;
  }
  .point-list-title {
    position: relative;
    margin: computed(40) computed(30);
    font-size: computed(24);
    line-height: computed(26);
    text-align: center;
    color: #999999;
    &::before {
      content: "";
      width: computed(255);
      height: 1px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      background: #dbdbdb;
    }
    &::after {
      content: "";
      width: computed(255);
      height: 1px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      background: #dbdbdb;
    }
  }
  .month {
    margin: computed(30);
    font-size: computed(26);
    line-height: computed(28);
    color: #666666;
  }
  .point-item-detail {
    padding: computed(51) 0;
    align-items: center;
    border-bottom: solid 1px #dbdbdb;
    .behavior {
      font-size: computed(30);
      line-height: computed(30);
      color: #333333;
    }
    .time {
      margin-top: computed(20);
      font-size: computed(24);
      line-height: computed(26);
      color: #999999;
    }
    .point-item-value {
      width: computed(114);
      height: computed(56);
      border: computed(2) solid rgba(196, 23, 23, 1);
      border-radius: computed(4);
      font-size: compuetd(26);
      font-weight: 500;
      color: rgba(196, 23, 23, 1);
      line-height: computed(56);
      text-align: center;
      margin-right: computed(32);
    }
  }
  .empty-content {
    height: auto;
    flex: 1;
  }
}
.point-content {
  display: inline-block;
  margin-top: computed(20);
  margin-bottom: computed(20);
  background-color: white;
  padding: 0 computed(30);
  box-sizing: border-box;
  width: 100%;
  .point-title {
    text-align: left;
    font-size: computed(30);
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    margin-top: computed(22);
  }
}
.hidden-content {
  padding: computed(32) computed(50);
  font-size: computed(24);
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  background-color: #f5f5f5;
}
.cell {
  margin-left: computed(50);
  .cell-img {
    display: inline-block;
    width: computed(100);
    height: computed(100);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .cell-info {
    display: inline-block;
    margin-left: computed(48);
    .cell-title {
      font-size: computed(32);
      font-weight: 500;
      color: rgba(13, 14, 9, 1);
    }
    .cell-num {
      font-size: computed(26);
      font-weight: 500;
      color: rgba(196, 23, 23, 1);
    }
    .cell-details {
      font-size: computed(24);
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      i {
        font-size: computed(23);
        margin-left: computed(18);
      }
    }
  }
}
.successBox {
  width: computed(650);
  height: computed(386);
  background: rgba(255, 255, 255, 1);
  border-radius: computed(10);
  position: relative;
  .li-row {
    text-align: center;
    .Icon_success {
      margin-top: computed(30);
      display: inline-block;
      width: computed(100);
      height: computed(100);
      border: computed(1) dashed rgb(136, 136, 136);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .li-word {
      font-size: computed(36);
      font-weight: bold;
      color: rgba(213, 175, 110, 1);
      margin-top: computed(19);
    }
    .li-word1 {
      font-size: computed(28);
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      margin-top: computed(60);
    }
    .li-action {
      font-size: computed(28);
      font-weight: 500;
      color: rgba(13, 14, 9, 1);
      margin-top: computed(60);
      i {
        font-size: computed(14);
        color: rgba(13, 14, 9, 1);
      }
    }
  }
  .closeIcon {
    // border: computed(1) dashed rgb(136, 136, 136);
    z-index: 10000000;
    width: computed(64);
    height: computed(64);
    display: inline-block;
    position: absolute;
    bottom: computed(-184);
    left: 44%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>