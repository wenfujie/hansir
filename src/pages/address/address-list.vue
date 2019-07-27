/*
* createTime：2018/11/3
* author：en.chen
* description:
*/
<template>
    <div class="address-list bg-gray">
        <!-- 收货地址列表 begin -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
        <ul class="address-list-content" v-if="addressList.length>0">
            <li class="address-list-item" v-for="(item,index) in addressList" :key="index">
                <div @click="selectAddress(item)">
                    <div class="address-header">
                        <span class="user-name">{{item.cargousrName}}</span>
                        <span class="user-phone">{{item.cargoPhone}}</span>
                    </div>
                    <div class="address-msg">{{item.destDesc + item.address}}</div>
                </div>
                <div class="address-btn-box">
                    <div class="default-btn" @click="setDefault(item)">
                        <i
                            class="iconfont"
                            :class="[ item.defaultFlag === 1 ? 'icon-xuanzhong' : 'icon-weixuanzhong']"
                        ></i>设为默认
                    </div>
                    <div class="common-btn">
                        <span @click="editAddress(item.id,item.destId)">
                            <i class="iconfont icon-bianji"></i>编辑
                        </span>
                        <span @click="deleteAddress(item)">
                            <i class="iconfont icon-shanchu"></i>删除
                        </span>
                    </div>
                </div>
            </li>
        </ul>
        <!-- 收货地址为空 begin -->
        <empty emptyText="暂无收货地址" v-show="showEmpty"></empty>
        <!-- 收货地址为空 end -->
        </van-pull-refresh>
        <!-- 收货地址列表 end -->
        <!--新增地址按钮 begin-->
        <div class="bottom-btn" @click="newAddr">新增地址</div>
        <!--新增地址按钮 end-->
    </div>
</template>
<script>
import { Dialog, Toast, PullRefresh } from "vant";
import Storage from "../../util/storage";
import { UserService } from "../../api/service";
import Empty from '../../components/EmptyContent.vue'
export default {
    data() {
        return {
            fromPage: "", // 来源页面，用于地址选择的点击跳转
            addressList: [], // 地址列表
            isLoading: false,
            showEmpty: false
        };
    },
    components: {
        'van-pull-refresh': PullRefresh,
        'empty': Empty
    },
    methods: {
        // 获取地址列表
        getAddress() {
            let data = {
                vipUsrId: Storage.get("USER_INFO").usrId
            };
            UserService.getAddrList(data).then(res => {
                this.addressList = res;
                this.isLoading = false
                if(this.addressList.length == 0) this.showEmpty = true
            }, err=>{
                Toast('数据加载失败~')
            });
        },
        // 编辑地址
        editAddress(id, destId) {
            this.$router.push("/address-detail?id=" + id + "&destId=" + destId);
        },
        clearSettlementAddr(item) {
            let addr = Storage.get("settlementAddr");
            if (addr && addr.id === item.id) {
                Storage.set("settlementAddr", {});
                console.log('删除成功');
            }
        },

        // 删除地址
        deleteAddress(item) {
            Dialog.confirm({
                message: "确定删除该地址吗？",
                confirmButtonText: "确定"
            }).then(
                () => {
                    let data = {
                        ids: item.id
                    };
                    UserService.deleteAddrList(data).then(() => {
                        this.clearSettlementAddr(item);
                        this.getAddress();
                        Toast("删除地址成功~");
                    });
                },
                err => { }
            );
        },

        //  选择事件
        selectAddress(item) {
            if (this.fromPage === "settlement") {// 订单结算页面进入时的操作
                Storage.set("settlementAddr", item);
                this.$router.go(-1);
            } else if (this.fromPage === "postSale") {
                this.Storage.set("address", item);
                this.$router.go(-1);
            }
        },

        //  跳转新增地址
        newAddr() {
            this.$router.push("/address-detail");
        },
        //  下拉刷新
        onRefresh() {
            this.getAddress()
        },
        //  设置默认地址
        setDefault(item) {
            if (item.defaultFlag === 1) {
                return;
            } else {
                let data = {
                    id: item.id,
                    address: item.address,
                    cargousrName: item.cargousrName,
                    cargoMobile: item.cargoMobile,
                    cargoPhone: item.cargoPhone,
                    defaultFlag: 1,
                    destCode: item.districtCode
                };
                UserService.changeAddrInfo(data).then(
                    res => {
                        Toast("设置默认地址成功~");
                        this.addressList.forEach(list => {
                            if (list.id === item.id) {
                                list.defaultFlag = 1;
                            } else {
                                list.defaultFlag = 0;
                            }
                        });
                    },
                    err => { }
                );
            }
        }
    },
    created() {
        this.fromPage = this.$route.query.fromPage || "";
        this.getAddress();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
.address-list {
    min-height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  .address-list-content {
    padding-bottom: computed(140);
  }
  .address-list-item {
    margin-top: computed(20);
    padding: 0 computed(30);
    position: relative;
    overflow: hidden;
    background: #ffffff;
    color: #1a1a1a;
    .address-header {
      padding: computed(28) 0 computed(28) 0;
      font-size: computed(28);
      line-height: computed(32);
      &::after {
        content: "";
        clear: both;
        display: table;
      }
      .user-name {
        float: left;
        overflow: hidden;
        font-weight: bold;
      }
      .user-phone {
        margin-left: computed(50);
        float: left;
        font-weight: bold;
      }
    }
    .address-msg {
      padding: 0 0 computed(24) 0;
      border-bottom: solid 1px #dbdbdb;
      font-size: computed(28);
      line-height: computed(40);
    }
    .address-btn-box {
      display: flex;
      height: computed(36);
      padding: computed(30) 0;
      font-size: computed(28);
      line-height: computed(36);
      justify-content: space-between;
      align-items: center;
      .default-btn {
        position: relative;
        i {
          font-size: computed(28);
          line-height: computed(36);
          margin-right: computed(10);
        }
        .icon-weixuanzhong {
          color: #666666;
        }
        .icon-xuanzhong {
          color: #0d0e09;
        }
      }
      .common-btn {
        span {
          font-size: computed(24);
          line-height: computed(36);
          margin-left: computed(60);
          color: #666666;
        }
        i {
          font-size: computed(24);
          line-height: computed(36);
          margin-right: computed(10);
        }
      }
    }
  }
}
</style>