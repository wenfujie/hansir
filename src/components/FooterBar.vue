<template>
    <div>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <van-tabbar>
            <van-tabbar-item v-for="(item,index) in footerData" :key='index' :to="{path:item.navigatUrl}">
                <!-- <van-tabbar-item v-for="(item,index) in footerData" :key='index'> -->
                <img :src="getImg(item.navigatPicUrl)" @error="errImg($event)" class="foot-img" v-if="active !== item.navigatUrl">
                <svg class="tabbar-icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-maozi"></use>
                </svg>
                <p>{{item.cmsNavigatHdName}}</p>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
import { Tabbar, TabbarItem, Icon } from "vant";
import { Cms } from "../api/service";
import Storage from "../util/storage";
import wx from "weixin-js-sdk";

export default {
  name: "FooterBar",
  data() {
    return {
      footerData: []
    };
  },
  components: {
    "van-tabbar": Tabbar,
    "van-tabbar-item": TabbarItem,
    "van-icon": Icon
  },
  methods: {
    //  获取千人千面模板
    getDefaultTemplate() {
      if (
        Storage.get("TEMPLATE_INFO") !== null &&
        Storage.get("TEMPLATE_INFO").cmsTemplateCode
      ) {
        this.getNav();
      } else {
        let data = {
          busContsCode: baseConstant.busContsCode
        };
        Cms.getUsrCmsTemplate(data)
          .then((res) => {
            // alert(JSON.stringify(res))
            Storage.set("TEMPLATE_INFO", res[0]);
          })
          .then(() => {
            this.getNav();
          });
      }
    },

    //  获取导航栏菜单
    getNav() {
      let temCode = "";
      if (Storage.get("TEMPLATE_INFO") !== null) {
        temCode = Storage.get("TEMPLATE_INFO").cmsTemplateCode;
      }
      let data = {
        cmsTemplateCode: temCode,
        busContsCode: baseConstant.busContsCode
      };
      Cms.getNavigation(data).then(
        (res) => {
          let navList = res.slice(0, 5);
          let newArr = [];
          //  按照seq进行排序
          let seqSort = function(obj1, obj2) {
            let val1 = obj1.seq;
            let val2 = obj2.seq;
            if (val1 < val2) {
              return -1;
            } else if (val1 > val2) {
              return 1;
            } else {
              return 0;
            }
          };
          newArr = navList.sort(seqSort);
          this.footerData = newArr;
        },
        (err) => {}
      );
    }
  },
  computed: {
    active: {
      get: function() {
        return this.$route.path;
      },
      set: function() {}
    }
  },
  created() {
    this.getNav();
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.van-tabbar {
  height: computed(98);
  text-align: center;
    border-top: computed(2) solid #DBDBDB;
}
.van-tabbar--fixed {
  position: fixed !important;
}
.van-tabbar-item {
  color: #a8a9ad;
}
.van-tabbar-item .iconfont {
  position: relative;
  font-size: computed(40);
  line-height: computed(50);
  left: computed(-2);
}
.van-tabbar-item p {
  margin: computed(10) 0 computed(13) 0;
  font-size: computed(20);
  line-height: computed(22);
}
.van-hairline--top-bottom::after {
  border: none;
}
.van-tabbar-item--active {
  color: $maincolor;
}
.tabbar-icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: computed(40);
  height: computed(40);
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  /*fill: pink;*/
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
           normalize.css 中也包含这行 */
  overflow: hidden;
}
.foot-img {
  width: computed(40);
  height: computed(40);
}
</style>
