(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6ec5a68e"],{"02ac":function(e,t,a){},"1d0a":function(e,t,a){"use strict";var n=a("02ac"),r=a.n(n);r.a},"31ed":function(e,t,a){},4165:function(e,t,a){"use strict";a("e7e5");var n=a("d399"),r=(a("c5f6"),a("96cf"),a("1da1"));a("a481"),a("4917");function s(e,t){var a={timeStamp:e.timeStamp,nonceStr:e.nonceStr,package:e.prepayId,paySign:e.paySign},n=new Promise(function(e,n){e(0==t?0:a)});return n}t["a"]=function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t,a,r,i,c){var o,u;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(r=Number(r),console.log(r,"_----"),0!==r){e.next=4;break}return e.abrupt("return",r);case 4:return o={usrId:t.Storage.get("USER_INFO").usrId,paymentCode:"D_WEIXIN",tradeTypeCode:"JSAPI",paymentTypeCode:c||"D_FULL",shopCode:t.Storage.get("USER_INFO").shopCode,orderList:a,orderType:i||null,openId:t.Storage.get("WECHAT_INFO").openid,payAmount:Number(r),unionId:Storage.get("properties").publicAccount},console.log(r,"===="),e.next=8,t.$post("payment/orderPayment",o);case 8:if(u=e.sent,"200"!==u.code){e.next=13;break}return e.abrupt("return",s(u,r));case 13:return Object(n["a"])(u.message),e.abrupt("return",Promise.reject());case 15:case"end":return e.stop()}},e,this)}));return function(t,a,n,r,s){return e.apply(this,arguments)}}()},"47c98":function(e,t,a){"use strict";var n=a("31ed"),r=a.n(n);r.a},"4a98":function(e,t,a){"use strict";var n=a("18a0"),r=a.n(n),s={miniProgramPay:function(e,t,a){var n={timeStamp:e.timeStamp,nonceStr:e.nonceStr,package:e.package,paySign:e.paySign,successUrl:t,failUrl:a||"/show"},s={config:n};r.a.miniProgram.navigateTo({url:"/page/pay/pay?payData="+encodeURIComponent(JSON.stringify(s))})},WebPay:function(e,t,a,n){r.a.config({debug:!1,appId:e.appId,timestamp:e.timestamp,nonceStr:e.nonceStr,signature:e.signature,jsApiList:["chooseWXPay"]}),r.a.chooseWXPay({timestamp:t.timestamp,nonceStr:t.nonceStr,package:t.package,signType:t.signType,paySign:t.paySign,success:function(e){if(-1===a.indexOf("http://")&&-1===a.indexOf("https://"))window.location.protocol,window.location.host,window.location.pathname;else window.location.href=a},error:function(e){if(-1===n.indexOf("http://")&&-1===n.indexOf("https://"))window.location.protocol,window.location.host,window.location.pathname;else window.location.href=n}})}};t["a"]=s},6997:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"page bg-gray flex-vbox"},[a("div",{staticClass:"topPart"},[a("div",{staticClass:"flex-box fs30"},[a("div",{class:["flex-auto flex-center pdTb30",{active:"wx"==e.mode,inActive:"wx"!=e.mode}],on:{click:function(t){e.modeChange("wx")}}},[e._v("微信充值")]),a("div",{class:["flex-auto flex-center pdTb30",{active:"card"==e.mode,inActive:"card"!=e.mode}],on:{click:function(t){e.modeChange("card")}}},[e._v("充值卡充值")])]),a("div",{staticClass:"flex-vbox"},["wx"==e.mode?a("div",{staticClass:"wechat mgT30"},e._l(e.chargeCardList,function(t,n){return a("div",{key:t.id,class:["tab",{tabInactive:n!=e.sIndex,tabActive:n==e.sIndex}],on:{click:function(a){a.stopPropagation(),e.select(t,n)}}},[a("span",{staticClass:"chong fs32B"},[e._v("充"+e._s(t.amount)+"元")]),t.present?a("span",{staticClass:"song"},[e._v("送"+e._s(t.present)+"元")]):e._e()])})):e._e(),"card"==e.mode?a("div",{staticClass:"flex-vbox fs28 mgB30"},[a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"card-input",attrs:{clearable:"",type:"text",placeholder:"请输入充值卡号"},on:{blur:function(t){e.onBlur()}},model:{value:e.card.number,callback:function(t){e.$set(e.card,"number",t)},expression:"card.number"}}),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"card-input",attrs:{clearable:"",type:"text",placeholder:"请输入密码"},model:{value:e.card.pwd,callback:function(t){e.$set(e.card,"pwd",t)},expression:"card.pwd"}})],1):e._e(),a("div",{staticClass:"pdLr30 white fs30"},[a("button",{staticClass:"flex-button",on:{click:function(t){e.payForCharge()}}},[e._v("立即充值")])])])]),a("chargeCardList",{staticClass:"flex-auto"})],1)},r=[],s=(a("e17f"),a("2241")),i=(a("e7e5"),a("d399")),c=(a("ac6a"),a("96cf"),a("1da1")),o=(a("be7f"),a("565f")),u=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"pd30 w100 h100 flex-vbox"},[a("p",{staticClass:"mgB20 fs26B"},[e._v("可使用充值卡")]),a("div",{staticClass:"flex-auto overflow-scroll"},[a("van-list",{attrs:{finished:e.finished,offset:500},on:{load:e.loadMoreData},model:{value:e.showOnLoading,callback:function(t){e.showOnLoading=t},expression:"showOnLoading"}},e._l(e.cardList,function(t){return a("chargeCard",{key:t.id,attrs:{card:t,reload:e.getChargeCardList}})}))],1)])},d=[],l=(a("2994"),a("2bdd")),h=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"mgB30"},[a("div",{staticClass:"coupon flex-box"},[a("div",{staticClass:"left flex-vbox flex-center"},[a("div",[a("span",{staticClass:"fs24"},[e._v("¥ ")]),a("span",{staticClass:"fs36B"},[e._v(e._s(e.card.remainAmount))])])]),a("div",{staticClass:"center flex-auto flex-vbox flex-between pdTb20"},[a("p",{staticClass:"fs28B"},[e._v(e._s(e.card.valuecardName))]),a("div",{staticClass:"fs26"},[a("span",{staticClass:"grey99 fs24"},[e._v(e._s(e.valiPeriod))])]),a("div",{staticClass:"fs24 grey99",on:{click:function(t){e.showUsage()}}},[e._v("\n                    使用说明\n                    "),a("i",{class:["iconfont icon-down ",{rotatingUp:e.showDesc,rotatingDown:!e.showDesc}]})])]),a("div",{staticClass:"right"},[a("div",{staticClass:"button flex-center",on:{click:function(t){e.charge()}}},[e._v("使用")])])]),e.showDesc?a("div",{staticClass:"flex-vbox fs24 gray"},[a("div",{staticClass:"flex-box mgTb20 pdLr20"},[a("div",{staticClass:"flex-box flex-auto"},[a("div",{},[e._v("卡号 :")]),a("div",{staticClass:"flex-auto pdL20"},[e._v(e._s(e.card.cardCode))])]),a("div",{staticClass:"flex-box flex-auto"},[a("div",{},[e._v("密码 :")]),a("div",{staticClass:"flex-auto pdL20"},[e._v(e._s(e.card.password||"无需密码"))])])]),e.card.memo?a("div",[e._v("使用范围 : "+e._s(e.card.memo))]):e._e()]):e._e()])])},p=[],f=(a("a481"),a("28a5"),a("7433")),g=a("4165"),m={props:{card:Object,reload:Function},data:function(){return{showDesc:!1}},computed:{valiPeriod:function(){var e=this.card.startDate.split(" "),t=this.card.endDate.split(" "),a=e[0].replace(/\-/g,".")+" "+e[1].substr(0,5),n=t[0].replace(/\-/g,".")+" "+t[1].substr(0,5);return a+"-"+n}},methods:{showUsage:function(){this.showDesc=!this.showDesc},chargeByCardId:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,a=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:t={cardId:this.card.id},f["chargeByCardId"](t).then(function(e){1===e?(Object(i["a"])("充值成功"),a.$router.push("/fund-detail")):Object(i["a"])("充值失败")},function(e){Object(i["a"])("充值失败")});case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),charge:function(){var e=this;s["a"].confirm({message:"是否确定将金额充值至我的资金账户?"}).then(function(){e.chargeByCardId()})}},created:function(){}},v=m,b=(a("47c98"),a("2877")),C=Object(b["a"])(v,h,p,!1,null,"f62c1654",null);C.options.__file="chargeCard.vue";var x=C.exports,w={components:{chargeCard:x,"van-list":l["a"]},data:function(){return{showOnLoading:!1,finished:!0,loadingText:"小主请稍等。。。",result:{},params:{pageNum:1,pageSize:10,buscontsCode:baseConstant.busContsCode},card:{},cardList:[]}},methods:{getChargeCardList:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,f["getChargeCardList"](this.params);case 2:if(this.result=e.sent,this.result.list){e.next=5;break}return e.abrupt("return");case 5:this.cardList=this.result.list||[];case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),loadMoreData:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!this.result.hasNextPage){e.next=11;break}return this.finished=!1,this.params.pageNum+=1,this.showOnLoading=!0,e.next=6,f["getChargeCardList"](this.params);case 6:this.result=e.sent,this.showOnLoading=!1,this.cardList=this.cardList.concat(this.result.list),e.next=14;break;case 11:this.finished=!0,this.loadingText="小主没有更多订单咯。。。",setTimeout(function(){t.showOnLoading=!1},2e3);case 14:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),onInit:function(){this.getChargeCardList()}},created:function(){this.onInit()}},y=w,k=(a("1d0a"),Object(b["a"])(y,u,d,!1,null,"6099cd2c",null));k.options.__file="chargeCardList.vue";var _=k.exports,O=a("bf3c"),L=a("4a98"),I={components:{"van-field":o["a"],chargeCardList:_},data:function(){return{mode:"wx",sIndex:0,sModel:{},card:{number:null,pwd:null},chargeLock:!1,chargeCard:{cardExist:null,needPassword:null,cardUseful:null,uselessMsg:null},chargeList:[],cache:{}}},methods:{modeChange:function(e){this.mode=e},select:function(e,t){this.sIndex=t,this.sModel=e},onBlur:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),formatList:function(e){return Array.isArray(e)?(e.forEach(function(e){"D_PAYDISTYPEDIS"===e.disTypeCode?e.present=e.amount*(1-e.discount):"D_PAYDISTYPEDIS"===e.disTypeCode&&(e.present=e.discount)}),e):[]},getChargeTypeList:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t={buscontsCode:baseConstant.busContsCode},e.next=3,f["getChargeTypeList"](t);case 3:if(e.t0=e.sent,e.t0){e.next=6;break}e.t0=[];case 6:a=e.t0,this.chargeList=this.formatList(a),this.sModel=O["a"].isEmpty(this.chargeList[0])?[]:this.chargeList[0];case 9:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),getChargeCardInfo:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",f["getCardInfoForCheck"]({cardNum:this.card.number}));case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),chargeCheckIsOk:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t=!0,this.card.number){e.next=4;break}return Object(i["a"])("请输入卡号"),e.abrupt("return",!1);case 4:return e.next=6,this.getChargeCardInfo();case 6:if(this.chargeCard=e.sent,!this.card.number||this.chargeCard.cardExist){e.next=13;break}return Object(i["a"])("该卡不存在"),t=!1,e.abrupt("return",t);case 13:if(!this.chargeCard.needPassword||!O["a"].isEmpty(this.card.pwd)){e.next=19;break}return Object(i["a"])("请输入密码"),t=!1,e.abrupt("return",t);case 19:if(!this.chargeCard.needPassword||this.card.pwd==this.chargeCard.password){e.next=25;break}return Object(i["a"])("密码错误,请重新输入!"),t=!1,e.abrupt("return",t);case 25:if(this.chargeCard.cardUseful){e.next=31;break}return Object(i["a"])(this.chargeCard.uselessMsg),t=!1,e.abrupt("return",t);case 31:return e.abrupt("return",t);case 32:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),chargeByCardNum:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,a=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.chargeCheckIsOk();case 2:t=e.sent,t&&s["a"].confirm({message:"是否确定将金额充值至我的资金账户?"}).then(function(){var e={cardNum:a.card.number,cardPass:a.card.pwd};f["chargeByCardNum"](e).then(function(e){200==e.code&&(a.card={number:null,pwd:null},a.$router.push("/fund-detail")),Object(i["a"])(e.msg)},function(e){Object(i["a"])("请求失败")})});case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),wxCharge:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){var t,a,n,r=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!O["a"].isEmpty(this.sModel)){e.next=3;break}return Object(i["a"])("无任何充值可选"),e.abrupt("return");case 3:if(!this.chargeLock){e.next=5;break}return e.abrupt("return");case 5:return this.chargeLock=!0,t={paysetDtDisId:this.sModel.id,busContsCode:baseConstant.busContsCode},e.next=9,f["wxCharge"](t);case 9:a=e.sent,n=this.sModel.realPay,Object(g["a"])(this,a,n,"D_WECHATORD","D_INPOUR").then(function(e){r.chargeLock=!1;var t="/fund-detail",a="/account-cashin";r.$router.go(-1),L["a"].miniProgramPay(e,t,a)},function(e){Object(i["a"])("支付失败"),r.chargeLock=!1});case 12:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),payForCharge:function(){var e=Object(c["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:e.t0=this.mode,e.next="wx"===e.t0?3:"card"===e.t0?5:7;break;case 3:return this.wxCharge(),e.abrupt("break",7);case 5:return this.chargeByCardNum(),e.abrupt("break",7);case 7:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),onInit:function(){this.getChargeTypeList()}},computed:{chargeCardList:function(){var e=[];return this.chargeList.forEach(function(t){t.discount?"D_PAYDISTYPEFS"==t.disTypeCode?(t.present=t.discount,t.realPay=t.amount):"D_PAYDISTYPEDIS"==t.disTypeCode&&(t.present=null,t.realPay=t.amount*t.discount):(t.present=null,t.realPay=t.amount),e.push(t)}),e}},created:function(){this.onInit()}},S=I,P=(a("6d3c"),Object(b["a"])(S,n,r,!1,null,"78bad907",null));P.options.__file="account-cashin.vue";t["default"]=P.exports},"6d3c":function(e,t,a){"use strict";var n=a("b1da"),r=a.n(n);r.a},b1da:function(e,t,a){}}]);