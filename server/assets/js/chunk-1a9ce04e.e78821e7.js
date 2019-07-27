(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1a9ce04e"],{"1a23":function(e,s,t){"use strict";var a=t("fe7e");s["a"]=Object(a["a"])({render:function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{class:e.b({on:e.value,disabled:e.disabled}),style:e.style,on:{click:e.onClick}},[t("div",{class:e.b("node")},[e.loading?t("loading",{class:e.b("loading")}):e._e()],1)])},name:"switch",props:{value:Boolean,loading:Boolean,disabled:Boolean,size:{type:String,default:"30px"}},computed:{style:function(){return{fontSize:this.size}}},methods:{onClick:function(){this.disabled||this.loading||(this.$emit("input",!this.value),this.$emit("change",!this.value))}}})},9478:function(e,s,t){"use strict";var a=t("f82b"),d=t.n(a);d.a},ab8b:function(e,s,t){},b000:function(e,s,t){"use strict";t("5548"),t("ab8b")},d2b7:function(e,s,t){"use strict";t.r(s);var a=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"address-detail bg-gray"},[t("div",{staticClass:"bg-white"},[t("div",{staticClass:"detail-cell"},[t("div",{staticClass:"cell-title"},[e._v("联系人")]),t("div",{staticClass:"cell-content"},[t("van-field",{attrs:{type:"text",clearable:"",maxlength:"40",placeholder:"请填写收货人姓名"},on:{blur:e.bindBlur},model:{value:e.addressInfo.name,callback:function(s){e.$set(e.addressInfo,"name",s)},expression:"addressInfo.name"}})],1)]),t("div",{staticClass:"detail-cell"},[t("div",{staticClass:"cell-title"},[e._v("手机号")]),t("div",{staticClass:"cell-content",class:{"warn-tip":!0!==e.checkPhone}},[t("van-field",{attrs:{type:"tel",maxlength:"11",placeholder:"请填写手机号",clearable:""},on:{change:e.checkPhoneNum,blur:e.bindBlur},model:{value:e.addressInfo.phone,callback:function(s){e.$set(e.addressInfo,"phone",s)},expression:"addressInfo.phone"}})],1)]),t("div",{staticClass:"detail-cell"},[t("div",{staticClass:"cell-title"},[e._v("所在地区")]),t("div",{staticClass:"cell-content area",on:{click:function(s){e.showAreaList=!0}}},[t("span",{domProps:{textContent:e._s(e.addressInfo.province+e.addressInfo.city+e.addressInfo.district)}})])]),t("div",{staticClass:"detail-cell address-detail-text"},[t("van-field",{attrs:{type:"textarea",placeholder:"详细地址：如街道、门牌号、小区、楼栋号、单元室等",clearable:""},on:{blur:e.bindBlur},model:{value:e.addressInfo.detail,callback:function(s){e.$set(e.addressInfo,"detail",s)},expression:"addressInfo.detail"}})],1),t("div",{staticClass:"detail-cell"},[t("div",{staticClass:"cell-title"},[e._v("设为默认")]),t("div",{staticClass:"cell-content"},[t("van-switch",{staticClass:"reset-UI",on:{input:e.changeDefault},model:{value:e.defaultStatus,callback:function(s){e.defaultStatus=s},expression:"defaultStatus"}})],1)])]),t("div",{staticClass:"bottom-btn",on:{click:e.editAddress}},[e._v("保存")]),t("van-popup",{attrs:{position:"bottom"},model:{value:e.showAreaList,callback:function(s){e.showAreaList=s},expression:"showAreaList"}},[t("van-area",{attrs:{"area-list":e.areaList,"visible-item-count":5},on:{confirm:e.areaChange,cancel:function(s){e.showAreaList=!1}}})],1)],1)},d=[],i=(t("a481"),t("e7e5"),t("d399")),n=(t("7f7f"),t("b000"),t("1a23")),o=(t("8a58"),t("e41f")),c=(t("db2c"),t("1125")),r=t("22ce"),l=t("2b61"),h=t("bf3c4"),f={components:{"van-area":c["a"],"van-popup":o["a"],"van-switch":n["a"]},data:function(){return{id:"",destId:"",addressInfo:{name:"",phone:"",province:"",district:"",city:"",addressId:"",detail:""},checkPhone:!0,setDefault:0,defaultStatus:!1,showAreaList:!1,areaList:h["a"],focus:!1,btnLock:!1}},methods:{updateAddrInLocal:function(e){var s=l["a"].get("settlementAddr");s&&s.id===e.id&&(s.cargousrName=this.addressInfo.name,s.cargoPhone=this.addressInfo.phone,s.destDesc=this.addressInfo.province+this.addressInfo.city+this.addressInfo.district,s.address=this.addressInfo.detail,this.Storage.set("settlementAddr",s))},editAddress:function(){var e=this;if(!this.btnLock){if(this.btnLock=!0,this.checkPhoneNum(),!this.addressInfo.detail||!this.addressInfo.addressId)return Object(i["a"])("请完善地址信息~"),void(this.btnLock=!1);if(!1===this.checkPhone)return Object(i["a"])("请输入正确的手机号"),void(this.btnLock=!1);var s={id:parseInt(this.id),address:this.addressInfo.detail,cargousrName:this.addressInfo.name,cargoMobile:this.addressInfo.phone,cargoPhone:this.addressInfo.phone,defaultFlag:this.setDefault,destCode:this.addressInfo.addressId};r["m"].changeAddrInfo(s).then(function(){Object(i["a"])({message:"保存地址信息成功~",duration:3e3}),e.updateAddrInLocal(s),window.history.go(-1),e.btnLock=!1},function(s){Object(i["a"])(s.errorMsg),e.btnLock=!1}).then(function(){e.btnLock=!1})}},checkPhoneNum:function(){if(this.addressInfo.phone=this.addressInfo.phone.replace(/[^\d]/g,""),!isPhone(this.addressInfo.phone))return Object(i["a"])("请输入正确的手机号"),this.checkPhone=!1,void window.scroll(0,0);this.checkPhone=!0,window.scroll(0,0)},areaChange:function(e){this.addressInfo.province=e[0].name,this.addressInfo.city=e[1].name,this.addressInfo.district=e[2].name,e[2].code?this.addressInfo.addressId=e[2].code:e[1].code?this.addressInfo.addressId=e[1].code:this.addressInfo.addressId=e[0].code,this.showAreaList=!1},changeDefault:function(e){!0===this.defaultStatus?this.setDefault=1:!1===this.defaultStatus&&(this.setDefault=0)},bindBlur:function(){window.scroll(0,0)}},created:function(){var e=this;if(this.id=parseInt(this.$route.query.id)||"",this.destId=parseInt(this.$route.query.destId)||"",this.destId&&void 0!==this.destId){var s={addressId:this.id,destId:this.destId};r["m"].getAddrDetail(s).then(function(s){e.addressInfo.name=s.cargousrName,e.addressInfo.phone=s.cargoPhone,e.addressInfo.addressId=s.districtCode,e.addressInfo.province=s.provinceCnName,e.addressInfo.district=s.districtCnName,e.addressInfo.city=s.cityCnName,e.addressInfo.detail=s.address,e.setDefault=s.defaultFlag,1===e.setDefault?e.defaultStatus=!0:e.defaultStatus=!1})}}},u=f,I=(t("9478"),t("2877")),v=Object(I["a"])(u,a,d,!1,null,"6c8b732e",null);v.options.__file="address-detail.vue";s["default"]=v.exports},f82b:function(e,s,t){}}]);