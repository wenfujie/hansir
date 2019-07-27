/*
 * @Author: yongtian.hong
 * @Date: 2018-08-03 17:13:03
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-13 11:09:39
 * @Description: 订单列表商品组件
 */
 <style lang='scss'  scoped>
.listBox {
  color: #0d0e09;
  font-family: "PingFang-SC-Medium", "PingFang-SC-Bold";
  margin-top: computed(30);
  padding: 0;
  padding-bottom: computed(1);
  background-color: #edf0f7;
  .title {
    text-align: center;
    color: #0d0e09;
    margin-top: computed(20);
    font-size: computed(36);
    background-color: #fff;
  }
}
</style>

 <template>
  <div  class="mgB30">
    <good v-for='(good,index) in goodsList' :good=good :key=index @showCusList="showCusList" :class="{'border-b1-c':goodLength>index+1}"></good>
  </div>
</template>

 <script>
import good from "./good";
import check from "@/util/check";
export default {
  components: {
    good
  },
  props: {
    pkg: {}
  },
  data(){
    return {
      goodsList:[],
      pakage:{
        goodsList:[]
      }
    }
  },
  methods: {
    showCusList(good) {
      this.$emit("showCusList", good);
    }
  },

  computed: {
    goodLength: function() {
      if (!this.pkg.goodsList) return 0;
      return this.pkg.goodsList.length;
    }
  },

  watch:{
    pkg:{
        handler:function(pkg){
        if (check.isEmpty(pkg)) return ;
        pkg.goodsList.forEach((element) => {
          element.nodeCode = pkg.nodeCode;
        });
        this.goodsList=pkg.goodsList;
      },
      deep:true
    }
   
  }
};
</script>
