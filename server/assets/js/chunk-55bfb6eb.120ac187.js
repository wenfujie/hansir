(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-55bfb6eb"],{"0cf0":function(t,e,s){"use strict";var a=s("d205"),r=s.n(a);r.a},"39c1":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"flex-vbox w100 h100 bg-gray "},[t.packages.length>1?s("scroll-tab",{staticClass:"bg-white ",attrs:{data:t.packages,"on-tab":t.changePackage}}):t._e(),s("order-step",{staticClass:"bg-white",attrs:{pkg:t.pkg}}),s("div",{staticClass:"flex-auto overflow-scroll pd30"},[s("logistic",{attrs:{data:t.pkg}}),s("address-info",{attrs:{pkg:t.pkg}}),s("good-list",{attrs:{pkg:t.pkg},on:{showCusList:t.showCusList}}),s("order-info",{attrs:{order:t.order}})],1),s("custom-list",{attrs:{params:t.cusParams}})],1)},r=[],n=(s("96cf"),s("1da1")),i=s("1fc8"),c=s("5b24"),o=s("2d75"),u={components:i["a"],data:function(){return c["a"]},methods:{getOrderDetail:function(){Object(o["c"])(this)},changePackage:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:Object(o["b"])(this,e);case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),showCusList:function(t){this.cusParams={billCode:this.order.billCode,saleOrdDtIds:t.saleOrdDtId}}},created:function(){this.getOrderDetail()}},d=u,l=(s("0cf0"),s("2877")),f=Object(l["a"])(d,a,r,!1,null,"01459268",null);f.options.__file="order-detail.vue";e["default"]=f.exports},d205:function(t,e,s){}}]);