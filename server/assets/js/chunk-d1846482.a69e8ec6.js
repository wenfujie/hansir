(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d1846482"],{"1c18":function(t,e,s){},"2b80":function(t,e,s){},"49bc":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"design pain-style"},[a("div",{staticClass:"toast"},[t._v(t._s(t.toast))]),t.show?a("div",{staticClass:"container"},[a("van-tabs",{attrs:{"line-width":150},on:{change:function(e){t.data_change()}},model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},[a("van-tab",{attrs:{title:"上门量体"}},[a("div",{staticClass:"company-content"},[a("ul",{staticClass:"form"},[a("li",{staticClass:"form-row"},[a("label",{staticClass:"row-label",attrs:{for:""}},[t._v("联系人")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input",attrs:{placeholder:"请输入您的名字",clearable:"",type:"text"},model:{value:t.visit.name,callback:function(e){t.$set(t.visit,"name",e)},expression:"visit.name"}})],1),a("li",{staticClass:"form-row"},[a("label",{staticClass:"row-label",attrs:{for:""}},[t._v("联系方式")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input",attrs:{placeholder:"请输入联系方式",clearable:"",type:"text"},model:{value:t.visit.tel,callback:function(e){t.$set(t.visit,"tel",e)},expression:"visit.tel"}})],1),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div"},[t._v("预约时间")]),a("div",{staticClass:"input-dialog",on:{click:function(e){t.jumpTime()}}},[""==t.visit.date||null==t.visit.date?a("span",[t._v("请选择量体日期")]):a("span",[t._v(t._s(t.visit.date))]),a("div",{staticClass:"icon-img"},[a("i",{staticClass:"iconfont icon-gengduo"})])])]),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div",attrs:{for:""}},[t._v("所在地区")]),a("div",{staticClass:"input-dialog",on:{click:function(e){t.showAreaList=!0}}},[""==t.visit.address||null==t.visit.address?a("span",[t._v("请选择城市地区")]):a("span",[t._v(t._s(t.visit.address))]),a("div",{staticClass:"icon-img"},[a("i",{staticClass:"iconfont icon-gengduo"})])])]),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div",attrs:{for:""}},[t._v("具体地址")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input van_textarea",attrs:{placeholder:"请输入具体地址",clearable:"",type:"textarea"},model:{value:t.visit.addressDetail,callback:function(e){t.$set(t.visit,"addressDetail",e)},expression:"visit.addressDetail"}})],1),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div",attrs:{for:""}},[t._v("备注")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input van_textarea",attrs:{placeholder:"请输入备注",clearable:"",type:"textarea"},model:{value:t.visit.measureMemo,callback:function(e){t.$set(t.visit,"measureMemo",e)},expression:"visit.measureMemo"}})],1)])])]),a("van-tab",{attrs:{title:"到店量体"}},[a("div",{staticClass:"company-content"},[a("ul",{staticClass:"form"},[a("li",{staticClass:"form-row"},[a("label",{staticClass:"row-label",attrs:{for:""}},[t._v("联系人")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input",attrs:{placeholder:"请输入您的名字",clearable:"",type:"text"},model:{value:t.store.name,callback:function(e){t.$set(t.store,"name",e)},expression:"store.name"}})],1),a("li",{staticClass:"form-row"},[a("label",{staticClass:"row-label",attrs:{for:""}},[t._v("联系方式")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input",attrs:{placeholder:"请输入联系方式",clearable:"",type:"text"},model:{value:t.store.tel,callback:function(e){t.$set(t.store,"tel",e)},expression:"store.tel"}})],1),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div",attrs:{for:""}},[t._v("所在地区")]),a("div",{staticClass:"input-dialog",on:{click:function(e){t.showAreaList1=!0}}},[""==t.store.address||null==t.store.address?a("span",[t._v("请选择城市地区")]):a("span",[t._v(t._s(t.store.address))]),a("div",{staticClass:"icon-img"},[a("i",{staticClass:"iconfont icon-gengduo"})])])]),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div",attrs:{for:""}},[t._v("选择门店")]),a("div",{staticClass:"input-dialog",on:{click:function(e){t.jumpMap()}}},[""==t.store.addressDetail||null==t.store.addressDetail?a("span",[t._v("请选择量体门店")]):a("span",[t._v(t._s(t.store.addressDetail))]),a("div",{staticClass:"icon-img"},[a("i",{staticClass:"iconfont icon-gengduo"})])])]),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div"},[t._v("预约时间")]),a("div",{staticClass:"input-dialog",on:{click:function(e){t.jumpTime()}}},[""==t.store.date||null==t.store.date?a("span",[t._v("请选择量体日期")]):a("span",[t._v(t._s(t.store.date))]),a("div",{staticClass:"icon-img"},[a("i",{staticClass:"iconfont icon-gengduo"})])])]),a("li",{staticClass:"form-row"},[a("div",{staticClass:"row-div",attrs:{for:""}},[t._v("备注")]),a("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"van_input van_textarea",attrs:{placeholder:"请输入备注",clearable:"",type:"textarea"},model:{value:t.visit.measureMemo,callback:function(e){t.$set(t.visit,"measureMemo",e)},expression:"visit.measureMemo"}})],1)])])])],1)],1):t._e(),a("div",{staticClass:"company-content"},[t.show?t._e():a("van-data-From",{attrs:{cb:t.postVolume,chichun:t.sun_chichun,otherBillCode:t.otherBillCode,v_type:t.v_type,partIds:t.partIds,routeName:t.routeName,sendAmount:t.sendAmount,sendMainFabricId:t.sendMainFabricId,yuyueData:t.yuyueData,queryData:t.queryData,successUrl:t.successUrl,measureOpCode:t.measureOpCode,s_type:t.s_type},on:{listenToChildEvent:t.postVolume}})],1),t.show?a("div",{staticClass:"submit",on:{click:t.postVolume1}},[t._v(t._s(t.submitWord))]):t._e(),a("van-popup",{attrs:{position:"bottom"},model:{value:t.showAreaList,callback:function(e){t.showAreaList=e},expression:"showAreaList"}},[a("van-area",{attrs:{"area-list":t.areaList},on:{confirm:t.areaChange,cancel:function(e){t.showAreaList=!1}}})],1),a("van-popup",{attrs:{position:"bottom"},model:{value:t.showAreaList1,callback:function(e){t.showAreaList1=e},expression:"showAreaList1"}},[a("van-area",{attrs:{"area-list":t.areaList1},on:{confirm:t.areaChange,cancel:function(e){t.showAreaList1=!1}}})],1),a("van-popup",{attrs:{position:"bottom"},model:{value:t.showDataList,callback:function(e){t.showDataList=e},expression:"showDataList"}},[a("van-picker",{attrs:{"show-toolbar":"",title:"可选日期",columns:t.columns},on:{change:t.onChange,cancel:function(e){t.showDataList=!1},confirm:t.dataChange}})],1),a("van-popup",{staticClass:"pain-dalog",attrs:{"close-on-click-overlay":!1},model:{value:t.showDalog,callback:function(e){t.showDalog=e},expression:"showDalog"}},[a("div",{staticClass:"successBox"},[a("ul",[a("li",{staticClass:"li-row"},[a("div",{staticClass:"Icon_success"},[a("img",{attrs:{src:s("9f10"),alt:""}})])]),a("li",{staticClass:"li-row"},[a("div",{staticClass:"li-word"},[t._v("填写成功!")])]),a("li",{staticClass:"li-row"},[a("div",{staticClass:"li-word1"},[t._v("着装师将尽快与您联系")])]),a("li",{staticClass:"li-row"},[a("div",{staticClass:"li-action",on:{click:t.jumpMyReserve1}},[t._v("\n            查看预约 \n            "),a("i",{staticClass:"iconfont icon-gengduo"})])])])])])],1)},i=[],o=(s("e7e5"),s("d399")),r=(s("a481"),s("7f7f"),s("ac6a"),s("96cf"),s("1da1")),n=(s("be7f"),s("565f")),d=(s("4ddd"),s("9f14")),c=(s("a44c"),s("e27c")),l=(s("bda7"),s("5e46")),u=(s("da3c"),s("0b33")),m=(s("5f5f"),s("f253")),h=(s("d1cf"),s("ee83")),p=(s("db2c"),s("1125")),v=(s("8a58"),s("e41f")),f=s("bf3c4"),g=s("4a98"),I=s("22ce"),C=s("2b61"),y=s("cbcb"),b=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.show?s("div",{staticClass:"thanksPage"},[s("div",{staticClass:"letter"},[s("button",{staticClass:"btnFill",on:{click:t.fill}})])]):t._e()},_=[],O=s("bf3c"),w={data:function(){return{show:!1}},methods:{onInit:function(){var t=this.$route.params.fromPage;O["a"].isEmpty(t)&&(t=this.$route.query.fromPage);var e=["settlement","order","payCode"];-1!=e.indexOf(t)&&(this.show=!0)},fill:function(){this.show=!1,this.$emit("close")}},created:function(){this.onInit()}},D=w,L=(s("f72a"),s("2877")),N=Object(L["a"])(D,b,_,!1,null,"8063dc5c",null);N.options.__file="letter.vue";var S=N.exports,M={components:{"van-popup":v["a"],"van-area":p["a"],"van-datetime-picker":h["a"],"van-picker":m["a"],"van-tab":u["a"],"van-tabs":l["a"],"van-radio-group":c["a"],"van-radio":d["a"],"van-data-From":y["a"],"van-field":n["a"],letter:S},data:function(){return{submitWord:"提交预约",submitData:{measureOpCode:null,liangti:null,yuyue:null},columns:[],successUrl:null,partIds:null,routeName:null,sendAmount:null,sendMainFabricId:null,yuyueData:null,queryData:null,v_type:null,measureOpCode:null,otherBillCode:null,s_type:null,sun_chichun:0,toast:"第一步：提交预约信息",maxDate:new Date(parseInt((new Date).getFullYear()),parseInt((new Date).getMonth())+3,1),minDate:new Date,currentDate:new Date,showDataList:!1,volumeDialogFlag:!0,active:0,showDalog:!1,show:!0,radio:"1",addressInfo:{},visit:{name:"",tel:"",date:"",address:"",addressDetail:"",addressInfo:{},measureMemo:""},store:{name:"",tel:"",address:"",addressDetail:"",date:"",addressInfo:{province:"",district:"",city:""},dptId:"",measureMemo:""},showAreaList:!1,showAreaList1:!1,areaList:{},areaList1:f["a"],id:null,cardNo:null,a_array:null,billCode:null,rtlOrdHdCode:null,saleOrdDtId:null,saleOrdDtList:null}},computed:{},methods:{getQueryString:function(t){var e=/^[^\?]+\?([\w\W]+)$/,s=/([^&=]+)=([\w\W]*?)(&|$)/g,a=e.exec(t),i={};if(a&&a[1]){var o,r=a[1];while(null!=(o=s.exec(r)))i[o[1]]=o[2]}return i},destoryed:function(){var t=Object(r["a"])(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.$route.meta.keepAlive=!1;case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),data_change:function(){C["a"].set("sun_active",{active:this.active}),this.addressInfo={}},onConfirm:function(){},onCancel:function(){},onChange:function(t,e){t.setColumnValues(1,this.a_array[e[0]])},getCityData1:function(){var t=this;I["a"].getDestnation().then(function(e){var s={},a={},i={};e.list.forEach(function(t){t.destTypeId===e.code[0]&&(s[t.code]=t.name),t.destTypeId===e.code[1]&&(a[t.code]=t.name),t.destTypeId===e.code[2]&&(i[t.code]=t.name)}),t.areaList1.province_list=s,t.areaList1.city_list=a,t.areaList1.county_list=i})},getCityData:function(){var t=this,e={cardNo:this.cardNo,usrId:C["a"].get("USER_INFO").usrId,companyId:C["a"].get("COMPANYID").company_id,masterWayCode:"D_MSRVISIT"};I["n"].getDoorAddr(e).then(function(e){var s={},a={},i={};e.forEach(function(t,e){s[t.provinceCode]=t.provinceName,a[t.cityCode]=t.cityName,i[t.districtCode]=t.districtName}),t.areaList.province_list=s,t.areaList.city_list=a,t.areaList.county_list=i})},parentReceive:function(t){this.postVolume()},_formatDate:function(t){var e=t[0]+" "+t[1]+":00",s=new Date(Date.parse(e.replace(/-/g,"/"))),a=s.getFullYear(),i=s.getMonth()+1,o=s.getDate(),r=s.getHours(),n=s.getMinutes(),d=s.getSeconds();i<10&&(i="0"+i),o<10&&(o="0"+o),r<10&&(r="0"+r),n<10&&(n="0"+n),d<10&&(d="0"+d);var c=a+"-"+i+"-"+o+" "+r+":"+n+":"+d;return c},dataChange:function(t){0==this.active?(this.visit.dateVal=t,this.visit.date=this._formatDate(t)):(this.store.dateVal=t,this.store.date=this._formatDate(t)),this.showDataList=!1},jumpTime:function(){var t=this;if(0==this.active){var e={ownCompanyId:C["a"].get("COMPANYID").company_id,buscontscode:"D_BUSCONTS_WSC",cardNo:this.cardNo,dptCode:C["a"].get("USER_INFO").shopCode,usrId:C["a"].get("USER_INFO").usrId,companyId:C["a"].get("COMPANYID").company_id};I["n"].getVolumeTime(e).then(function(e){for(var s=[],a={},i=null,o=0;o<e.length;o++)s.push(e[o].ymd),i=e[0].ymd;for(var r=0;r<e.length;r++)for(var n=[],d=0;d<e[r].hourList.length;d++)n.push(e[r].hourList[d]),t.$set(a,e[r].ymd,n);t.a_array=a,t.columns=[{values:s,className:"column1"},{values:a[i],className:"column2"}],t.showDataList=!0},function(t){}).then(function(){})}else if(null!=C["a"].get("VOLUME_STORE")||""!=C["a"].get("VOLUME_STORE"))if(null!=C["a"].get("VOLUME_STORE").dptCode&""!=C["a"].get("VOLUME_STORE").dptCode&void 0!=C["a"].get("VOLUME_STORE").dptCode){var s={ownCompanyId:C["a"].get("COMPANYID").company_id,buscontscode:"D_BUSCONTS_WSC",cardNo:this.cardNo,dptCode:C["a"].get("VOLUME_STORE").dptCode,usrId:C["a"].get("USER_INFO").usrId,companyId:C["a"].get("COMPANYID").company_id};I["n"].getVolumeTime(s).then(function(e){for(var s=[],a={},i=null,o=0;o<e.length;o++)s.push(e[o].ymd),i=e[0].ymd;for(var r=0;r<e.length;r++)for(var n=[],d=0;d<e[r].hourList.length;d++)n.push(e[r].hourList[d]),t.$set(a,e[r].ymd,n);t.a_array=a,t.columns=[{values:s,className:"column1"},{values:a[i],className:"column2"}],t.showDataList=!0},function(t){}).then(function(){})}else Object(o["a"])("请先选择门店")},jumpMap:function(){this.store.addressInfo.addressId?(this.store.date="",C["a"].set("VOLUME_STORE",this.store),this.$router.push("/addressMap?type=store&from=reserve")):Object(o["a"])("请先选择省市区")},jumpMyReserve1:function(){this.$router.replace("/myReserve")},jumpMyReserve:function(){this.$router.replace({name:"submitSuccess",path:"/submitSuccess",params:{billCode:C["a"].get("rtlOrdHdCode").billCode}})},getShopAddr:function(){var t=this,e={stateName:this.addressInfo.province,cityName:this.addressInfo.city,destName:this.addressInfo.district,cardNo:this.cardNo,usrId:C["a"].get("USER_INFO").usrId,ownCompanyId:C["a"].get("COMPANYID").company_id,companyId:C["a"].get("COMPANYID").company_id};I["n"].getShopAddr(e).then(function(e){t.shopColumns=[];var s={};e.forEach(function(e){s.text=e.dptName,s.value=e.dptId,t.shopColumns.push(s),s={}})},function(t){}).then(function(){t.shopColumns.length>0?t.showShopList=!0:Object(o["a"])("该地区内无可用门店~")})},areaChange:function(t){this.$set(this.addressInfo,"province",t[0].name),this.$set(this.addressInfo,"city",t[1].name),this.$set(this.addressInfo,"district",t[2].name),t[2].code?this.addressInfo.addressId=t[2].code:t[1].code?this.addressInfo.addressId=t[1].code:this.addressInfo.addressId=t[0].code,0==this.active?(this.visit.addressInfo=this.addressInfo,this.visit.address=t[0].name+" "+t[1].name+" "+t[2].name,this.visit.addressId=this.addressInfo.addressId):(this.store.addressInfo=this.addressInfo,this.store.address=t[0].name+" "+t[1].name+" "+t[2].name,this.store.addressInfo=this.addressInfo),this.store.addressDetail="",this.showAreaList=!1,this.showAreaList1=!1},getPage:function(){var t=this,e={cmsTemplateCode:C["a"].get("TEMPLATE_INFO").cmsTemplateCode,cmsWebCode:pageCode.volume.name,busContsCode:baseConstant.busContsCode};I["b"].getUsrCmsInfoV2(e).then(function(e){e.cmsModulepageHdList.forEach(function(e){e.cmsBackpageDtDtoList.forEach(function(e){"yylt01"===e.cmsBackpageDtCode&&(t.pageData=e.cmsBackpageDttList)})})})},getVolumes:function(){var t={measureClassInfoCode:""};I["n"].getVolumes(t).then(function(t){},function(t){})},getAmount:function(){var t=this,e={};I["n"].getMsrAmount(e).then(function(e){t.amount=e},function(t){})},postVolume1:function(){var t={},e="";C["a"].get("WECHAT_INFO");if(0===this.active){if(!this.visit.name)return Object(o["a"])("请填写姓名，姓名为必填项"),void(this.btnLock=!1);if(!isPhone(this.visit.tel))return Object(o["a"])("请填写正确手机号~"),void(this.btnLock=!1);if(!this.visit.addressDetail)return Object(o["a"])("请填写地址详情，地址详情为必填项"),void(this.btnLock=!1);if(!this.visit.date)return Object(o["a"])("请填写日期，日期为必填项"),void(this.btnLock=!1);t={msrWayCode:"D_MSRVISIT",cargousrName:this.visit.name,cargousrSex:"D_MALE",cargoMobile:this.visit.tel,stateName:this.visit.addressInfo.province,cityName:this.visit.addressInfo.city,destName:this.visit.addressInfo.district,address:this.visit.addressDetail,measureMemo:this.visit.measureMemo,orderTime:this.visit.date,usrId:C["a"].get("USER_INFO").usrId,dptId:null,shopId:C["a"].get("USER_INFO").shopId,companyId:C["a"].get("COMPANYID").company_id,rtlOrdHdCode:this.rtlOrdHdCode,saleOrdDtList:this.saleOrdDtList}}else{if(!this.store.name)return Object(o["a"])("请填写姓名，姓名为必填项"),void(this.btnLock=!1);if(!isPhone(this.store.tel))return Object(o["a"])("请填写正确手机号~"),void(this.btnLock=!1);if(!this.store.addressDetail)return Object(o["a"])("请填写地址详情，地址详情为必填项"),void(this.btnLock=!1);if(!this.store.date)return Object(o["a"])("请填写日期，日期为必填项"),void(this.btnLock=!1);t={msrWayCode:"D_MSRSHOP",cargousrName:this.store.name,cargousrSex:e,cargoMobile:this.store.tel,stateName:this.store.addressInfo.province,cityName:this.store.addressInfo.city,destName:this.store.addressInfo.district,address:this.store.addressDetail,orderTime:this.store.date,usrId:C["a"].get("USER_INFO").usrId,dptId:this.store.dptId,shopId:C["a"].get("USER_INFO").shopId,measureMemo:this.store.measureMemo,rtlOrdHdCode:this.rtlOrdHdCode,saleOrdDtList:this.saleOrdDtList}}console.log("yuhong",JSON.stringify(t)),window.scrollTo(0,5),console.log(this.routeName),this.yuyueData=t;var s={yuyue:t,routeName:this.routeName,measureOpCode:this.measureOpCode,billCode:this.otherBillCode,b_data:this.queryData,partIds:this.partIds,type:this.s_type};C["a"].set("reserveStorage",s),this.$router.push({name:"aiCountBody",path:"/aiCountBody",params:s,query:{successUrl:this.$route.query.successUrl}}),this.toast="第二步：填写身型信息"},postVolume:function(){var t=Object(r["a"])(regeneratorRuntime.mark(function t(){var e,s,a,i,r=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(e={},s="",a=this,C["a"].get("WECHAT_INFO"),console.log("$$$$$$$"),0!==this.active){t.next=25;break}if(this.visit.name){t.next=10;break}return Object(o["a"])("请填写姓名，姓名为必填项"),this.btnLock=!1,t.abrupt("return");case 10:if(isPhone(this.visit.tel)){t.next=14;break}return Object(o["a"])("请填写正确手机号~"),this.btnLock=!1,t.abrupt("return");case 14:if(this.visit.addressDetail){t.next=18;break}return Object(o["a"])("请填写地址详情，地址详情为必填项"),this.btnLock=!1,t.abrupt("return");case 18:if(this.visit.date){t.next=22;break}return Object(o["a"])("请填写日期，日期为必填项"),this.btnLock=!1,t.abrupt("return");case 22:e={id:null,msrWayCode:"D_MSRVISIT",cargousrName:this.visit.name,cargousrSex:"D_MALE",cargoMobile:this.visit.tel,stateName:this.visit.addressInfo.province,cityName:this.visit.addressInfo.city,destName:this.visit.addressInfo.district,address:this.visit.addressDetail,orderTime:this.visit.date,usrId:C["a"].get("USER_INFO").usrId,dptId:null,shopId:C["a"].get("USER_INFO").shopId,measureMemo:this.visit.measureMemo,companyId:C["a"].get("COMPANYID").company_id,rtlOrdHdCode:this.rtlOrdHdCode,saleOrdDtList:this.saleOrdDtList},t.next=42;break;case 25:if(this.store.name){t.next=29;break}return Object(o["a"])("请填写姓名，姓名为必填项"),this.btnLock=!1,t.abrupt("return");case 29:if(isPhone(this.store.tel)){t.next=33;break}return Object(o["a"])("请填写正确手机号~"),this.btnLock=!1,t.abrupt("return");case 33:if(this.store.addressDetail){t.next=37;break}return Object(o["a"])("请填写地址详情，地址详情为必填项"),this.btnLock=!1,t.abrupt("return");case 37:if(this.store.date){t.next=41;break}return Object(o["a"])("请填写日期，日期为必填项"),this.btnLock=!1,t.abrupt("return");case 41:e={id:null,msrWayCode:"D_MSRSHOP",cargousrName:this.store.name,cargousrSex:s,cargoMobile:this.store.tel,stateName:this.store.addressInfo.province,cityName:this.store.addressInfo.city,destName:this.store.addressInfo.district,address:this.store.addressDetails,orderTime:this.store.date,usrId:C["a"].get("USER_INFO").usrId,dptId:this.store.dptId,shopId:C["a"].get("USER_INFO").shopId,measureMemo:this.store.measureMemo,rtlOrdHdCode:C["a"].get("rtlOrdHdCode").billCode,saleOrdDtList:C["a"].get("saleOrdDtList")};case 42:return""!==C["a"].get("DATA")&&void 0!==C["a"].get("DATA")&&null!==C["a"].get("DATA")&&(e.id=C["a"].get("DATA").id),i={},console.log(e),t.next=47,I["n"].saveVolume(e).then(function(t){if(i=t,r.amount>0){var e={usrId:C["a"].get("USER_INFO").usrId,paymentCode:"D_WEIXIN",tradeTypeCode:"JSAPI",paymentTypeCode:"D_FULL",domainName:baseConstant.domain,shopCode:C["a"].get("USER_INFO").shopCode,orderList:t.cardBillCode,orderType:"D_MSRORD",openId:C["a"].get("WECHAT_INFO").openid,payAmount:r.amount};if(""!==C["a"].get("DATA")&&void 0!==C["a"].get("DATA")&&null!==C["a"].get("DATA")){var s={ownCompanyId:C["a"].get("COMPANYID").company_id,saleHdId:C["a"].get("DATA").id};I["n"].getSaleMeasureId(s).then(function(t){r.$set(e,"orderList",t.cardBillCode),I["i"].payOrder(e).then(function(t){if("200"!==t.code)return Object(o["a"])("支付出错了~"),void(a.btnLock=!1);var e={timeStamp:t.timeStamp,nonceStr:t.nonceStr,package:t.prepayId,paySign:t.paySign,successUrl:"/reserve?status=success",failUrl:"/reserve?status=fail"};if(g["a"].miniProgramPay(e,e.successUrl,e.failUrl),C["a"].get("route")&&"myReserve"==C["a"].get("route").routes)return r.showDalog=!0,C["a"].remove("route"),void C["a"].remove("DATA");r.jumpMyReserve()}).then(function(){a.btnLock=!1})},function(){Object(o["a"])("提交出错了~")})}else I["i"].payOrder(e).then(function(t){if("200"!==t.code)return Object(o["a"])("支付出错了~"),void(a.btnLock=!1);var e={timeStamp:t.timeStamp,nonceStr:t.nonceStr,package:t.prepayId,paySign:t.paySign,successUrl:"/reserve?status=success",failUrl:"/reserve?status=fail"};if(g["a"].miniProgramPay(e,e.successUrl,e.failUrl),C["a"].get("route")&&"myReserve"==C["a"].get("route").routes)return r.showDalog=!0,C["a"].remove("route"),void C["a"].remove("DATA");r.jumpMyReserve()}).then(function(){a.btnLock=!1})}else{if(C["a"].get("route")&&"myReserve"==C["a"].get("route").routes)return r.showDalog=!0,C["a"].remove("route"),void C["a"].remove("DATA");r.jumpMyReserve(),Object(o["a"])("提交预约成功")}C["a"].remove("route"),C["a"].remove("DATA")},function(){Object(o["a"])("提交出错了~"),r.btnLock=!1});case 47:return t.abrupt("return",i);case 48:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()},watch:{$route:function(t,e){console.log("222222"),console.log("~~~~~~~~~~~",e),"/addressMap"==t.path?e.meta.keepAlive=!0:e.meta.keepAlive=!1}},created:function(){var t=this,e={usrId:C["a"].get("USER_INFO").usrId,ownCompanyId:C["a"].get("COMPANYID").company_id,companyId:C["a"].get("COMPANYID").company_id};if(I["m"].getUserInfo(e).then(function(e){t.cardNo=e.cardNo,t.getCityData()},function(){}),"success"==this.$route.query.status){if("myReserve"==C["a"].get("route").routes)return void(this.showDalog=!0);this.jumpMyReserve(),Object(o["a"])("提交预约成功")}if("fail"==this.$route.query.status){if("myReserve"==C["a"].get("route").routes)return void(this.showDalog=!0);this.jumpMyReserve(),Object(o["a"])("提交预约成功")}if("myReserve"==this.$route.query.from){var s="myReserve";if(C["a"].set("route",{routes:s}),"D_MSRVISIT"==this.$route.query.type){this.active=0,this.visit=C["a"].get("VOLUME_VISIT");var a=(new Date).getTime();a>new Date(this.visit.date).getTime()&&(Object(o["a"])("该预约单时间已过期"),this.visit.date=""),this.id=C["a"].get("VOLUME_VISIT").id,this.addressInfo=this.visit.addressInfo}if("D_MSRSHOP"==this.$route.query.type){this.active=1,this.store=C["a"].get("VOLUME_STORE");var i=(new Date).getTime();i>new Date(this.store.date).getTime()&&(Object(o["a"])("该预约单时间已过期"),this.store.date=""),this.addressInfo=this.store.addressInfo,this.id=C["a"].get("VOLUME_STORE").id}var r={id:this.id,usrId:C["a"].get("USER_INFO").usrId,ownCompanyId:C["a"].get("COMPANYID").company_id,companyId:C["a"].get("COMPANYID").company_id};I["n"].getVolumeGoodsCode(r).then(function(e){if(1==e.skuInfoList.length&&(t.partIds=e.skuInfoList[0].ptiPartHdCode),e.skuInfoList.length>1)for(var s=0;s<e.skuInfoList.length;s++)t.partIds=0==s?e.skuInfoList[0].ptiPartHdCode:t.partIds+","+e.skuInfoList[s].ptiPartHdCode;console.log("有返回东西哟",t.partIds)})}C["a"].get("s_router")&&("map"!=this.$route.query.from&&"map"!=C["a"].get("s_router").fromPage||(this.active=1,null==C["a"].get("VOLUME_STORE")&&""==C["a"].get("VOLUME_STORE")||(this.store=C["a"].get("VOLUME_STORE"),this.addressInfo=this.store.addressInfo)),C["a"].remove("s_router")),this.getAmount(),this.getVolumes();var n=C["a"].get("sun_active");n&&(this.active=n.active)}},k=M,A=(s("8d0e"),Object(L["a"])(k,a,i,!1,null,"66cee2ae",null));A.options.__file="reserve.vue";e["default"]=A.exports},"4a98":function(t,e,s){"use strict";var a=s("18a0"),i=s.n(a),o={miniProgramPay:function(t,e,s){var a={timeStamp:t.timeStamp,nonceStr:t.nonceStr,package:t.package,paySign:t.paySign,successUrl:e,failUrl:s||"/show"},o={config:a};i.a.miniProgram.navigateTo({url:"/page/pay/pay?payData="+encodeURIComponent(JSON.stringify(o))})},WebPay:function(t,e,s,a){i.a.config({debug:!1,appId:t.appId,timestamp:t.timestamp,nonceStr:t.nonceStr,signature:t.signature,jsApiList:["chooseWXPay"]}),i.a.chooseWXPay({timestamp:e.timestamp,nonceStr:e.nonceStr,package:e.package,signType:e.signType,paySign:e.paySign,success:function(t){if(-1===s.indexOf("http://")&&-1===s.indexOf("https://"))window.location.protocol,window.location.host,window.location.pathname;else window.location.href=s},error:function(t){if(-1===a.indexOf("http://")&&-1===a.indexOf("https://"))window.location.protocol,window.location.host,window.location.pathname;else window.location.href=a}})}};e["a"]=o},"8d0e":function(t,e,s){"use strict";var a=s("2b80"),i=s.n(a);i.a},f72a:function(t,e,s){"use strict";var a=s("1c18"),i=s.n(a);i.a}}]);