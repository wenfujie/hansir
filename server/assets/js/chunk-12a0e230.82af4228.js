(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-12a0e230"],{"0907":function(e,t,i){},"30ed":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAClElEQVRIS72WPWgUQRiG328um0sVwoWbgaCgKAoidgaJe8XhXSASsDKtWoqg+FeJKQJW/mAKbY1trERJIIkcZI/4V4kWCoqCGthZcgQLSbLJfjIJSTS5vdvZgF+zcPe+7zMz3+zMEv5zUVJeJZ/f7whxAUAvA/uMj4AvACbCKHpQDILPSbISAT2lbghgkIHWeqEELAEYOu77t5pBmwI9Ke8S0ZVmQeZ/Zr5X0PpqI21DYDWfPwkhnq+tXqJiRFG/GwRjcerGQKXeADiaCLUpeuv6frc1sJLL7XIc57slbFUehuHuYq32I6bf9SNnlDoRAVNpgAIo9fj+Cyugp1SJgMk0QAbKBd+vO9jYHlY6OvY42ezXNMBwcXFvcX7+m9UMjdiT8h0RHbGEvnd9P9bTcJd6+fxpEmLUBshRNFAIgifWu3TdUJXyEYjOJoIyj7han0v94hvjKJDpkvI2gEsgEnXDmCMAw7NaXx8AVlIDGRBVKU8JojMM9CHmLMXaWTrOzI9drZ8SYAZQt2J76CnVT8x3QHQw0XKui5g/MdG1gu+bI3FbbQNWgLZWpR4y0LAXTQfBPBJqfb4ILPyt/Qf4KpdrD1taxomop2lgAgEzzzjLy33HarVf6/IN4BiQbZdyEkSFBFnJJczTs1qXB9b6vHnteEoNE3AxeZKFMoruu0FweQM43dnZLTKZl7Hb3iI77rXhlZWewtzc69UlrUo5AaLyTnMb+pknXa17aTqXOyQc54PFrZ52XByF4WGqSnkTRENpU6x8zINUVcrceSUrY3rxlJnhTxB1pc+wcDLPGuASiBwL206kC+Qp9QzMB4ioBcxZBjJElAUzwTy3FANEQNvW383HMG+9KZjNZEKYJ/CbiT7+AR+73KloNZYXAAAAAElFTkSuQmCC"},"4a64":function(e,t,i){"use strict";var s=i("e4a04"),a=i.n(s);a.a},5631:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"design v-design container"},[i("div",{staticClass:"listdata"},[i("div",{staticClass:"list_top"},[e._m(0),i("div",{staticClass:"top_right",on:{click:e.newData}},[e._v("\n                +  新增定制人\n            ")])]),i("div",{staticClass:"list-content"},[i("van-list",{attrs:{finished:e.finished,"immediate-check":!1},on:{load:e.loadMore},model:{value:e.loading,callback:function(t){e.loading=t},expression:"loading"}},[i("van-pull-refresh",{on:{refresh:e.onRefresh},model:{value:e.isLoading,callback:function(t){e.isLoading=t},expression:"isLoading"}},[i("div",{staticClass:"content-box"},e._l(e.list,function(t,s){return i("div",{key:s,staticClass:"pain-row"},[i("div",{staticClass:"row-user"},[i("div",{staticClass:"user-name"},[e._v(e._s(t.usrName))]),e._v("\n                                  \n                                "),0==t.isDefaultFlag?i("div",{staticClass:"use-default",on:{click:function(t){e.setDefault(s)}}},[e._v("设为默认")]):e._e(),1==t.isDefaultFlag?i("div",{staticClass:"default"},[e._v("默认")]):e._e(),i("span",{staticClass:"delete",on:{click:function(t){e.updateData(s)}}},[e._v("\n                                    编辑\n                                ")])]),i("ul",[i("li",{staticClass:"table-row"},e._l(e.sortList(t.figureDtos),function(t,s){return i("div",{key:s,staticClass:"row-cell"},[t.isMutil?i("div",{staticClass:"row-all"},[e._v(e._s(t.featureName)+":"+e._s(t.valueNames||t.values||"--"))]):i("div",{staticClass:"row-half"},[e._v(e._s(t.featureName)+":"+e._s(t.valueNames||t.values||"--"))])])}))]),i("div",{staticClass:"footer-content"},[0==t.isDefaultFlag?i("div",{staticClass:"footer-left",on:{click:function(t){e.dataDelete(s)}}},[i("i",{staticClass:"iconfont icon-shanchu"}),e._v("\n                                    删除\n                                ")]):e._e(),i("div",{staticClass:"footer-right",on:{click:function(i){e.toggleSelected(s,t.id)}}},[i("i",{staticClass:"van-checkbox__icon iconfont",class:[e.infoSid==t.id?"icon-xuanzhong":"icon-weixuanzhong"]}),e._v("\n                                    使用该尺寸\n                                ")])])])}))])],1)],1)]),i("div",{staticClass:"ai_bottom",on:{click:function(t){e.dataConfirm()}}},[e._v("\n            "+e._s(e.confirm)+"\n        ")])])},a=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"top_left"},[s("img",{attrs:{src:i("30ed")}}),e._v("\n                 选择定制人\n            ")])}],o=(i("a481"),i("e17f"),i("2241")),n=(i("28a5"),i("ac6a"),i("e7e5"),i("d399")),r=(i("ab71"),i("58e6")),u=(i("2994"),i("2bdd")),l=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{class:e.class1},[e._v("\n    "+e._s(e.item.featureName)+":"+e._s(e.item.valueNames||e.item.values||"--")+"\n")])},c=[],d={props:{item:Object,key:Object},computed:{class1:function(){var e=0;return item.value,e>18?"cs-half":"cs-all"}},created:function(){console.log("itemitemitemitem",item)}},f=d,g=(i("4a64"),i("2877")),v=Object(g["a"])(f,l,c,!1,null,"0cbaab0e",null);v.options.__file="row.vue";var h=v.exports,m=i("22ce"),p=i("2b61"),D=i("5fb8"),A={name:"web-design",components:{"van-list":u["a"],"van-pull-refresh":r["a"],empty:D["a"],row:h},data:function(){return{pageNum:1,loading:!1,finished:!0,isLoading:!1,showEmpty:!1,confirm:"下一步",list:[],countDodyData:null,infoActive:0,infoSid:null}},computed:{},methods:{onRefresh:function(){this.pageNum=1,this.list=[],this.getAiMeasure()},loadMore:function(){var e=this;setTimeout(function(){!0!==e.finished?(e.pageNum+=1,e.getLoadAiMeasure()):Object(n["a"])("没有更多了~")},100)},sortList:function(e){var t=[],i=[];if(e)for(var s=0;s<e.length;s++)e[s].featureName.length+(e[s].valueNames||e[s].values||"--").length+1>10?(e[s].isMutil=!0,i.push(e[s])):(e[s].isMutil=!1,t.push(e[s]));return t.length>0&&t.length%2!=0&&(t[t.length-1].isMutil=!0),t.concat(i)},GetRequest:function(e){var t=e,i=t.lastIndexOf("?");t=t.substring(i,t.length);var s=new Object;if(-1!=t.indexOf("?"))for(var a=t.substr(1),o=a.split("&"),n=0;n<o.length;n++)s[o[n].split("=")[0]]=unescape(o[n].split("=")[1]);return s},setReserveStorage:function(){var e={measureOpCode:null,partIds:null,routeName:null,yuyue:null,v_data:null};if(p["a"].get("reserveStorage")&&(e.yuyue=p["a"].get("reserveStorage").yuyue,e.measureOpCode=p["a"].get("reserveStorage").measureOpCode,e.partIds=p["a"].get("reserveStorage").partIds,e.routeName=p["a"].get("reserveStorage").routeName,e.v_data=p["a"].get("reserveStorage").v_data),null!=this.$route.query.successUrl&&void 0!=this.$route.query.successUrl){var t=decodeURIComponent(this.$route.query.successUrl);e.v_data=this.GetRequest(t),"toEmb"==this.$route.query.successUrl?(e.routeName="goodsEmbroider",e.partIds=this.$route.query.goodCodes):(-1!=t.indexOf("/goods-embroider")&&(e.routeName="goodsEmbroider"),-1!=t.indexOf("/order-settlement")&&(e.routeName="orderSettlement"),this.successUrl=decodeURIComponent(this.$route.query.successUrl))}p["a"].set("reserveStorage",e)},newData:function(){this.$store.commit("aiMeasureBody/resetData"),this.$router.push({name:"aiAmountBody",params:{actionPage:"newAdd"}})},setDefault:function(e){var t=this,i={id:this.list[e].id,ownCompanyId:p["a"].get("COMPANYID").company_id,usrId:p["a"].get("USER_INFO").usrId,companyId:p["a"].get("COMPANYID").company_id};m["n"].setDefaultUser(i).then(function(e){1==e?(Object(n["a"])("设为默认成功"),t.pageNum=1,t.getAiMeasure()):Object(n["a"])("设为默认失败")},function(){Object(n["a"])("提交出错了~")})},updateData:function(e){var t={userName:this.list[e].usrName,aiId:this.list[e].id,fromPage:"aiCountBody",data:[]};if(this.list[e].figureDtos)for(var i=0;i<this.list[e].figureDtos.length;i++){var s={id:this.list[e].figureDtos[i].vipFeatureInfoId,values:this.list[e].figureDtos[i].valueNames||this.list[e].figureDtos[i].values,featureCode:this.list[e].figureDtos[i].featureCode,valueIds:this.list[e].figureDtos[i].values};t.data.push(s)}this.$store.commit("aiMeasureBody/resetData"),this.$router.push({name:"aiAmountBody",params:t})},toggleSelected:function(e,t){this.infoActive=e,this.infoSid=t},dataDelete:function(e){var t=this;if(""!==this.list[e].id){var i={userId:p["a"].get("USER_INFO").usrId,companyId:p["a"].get("COMPANYID").company_id,ids:this.list[e].id,ownCompanyId:p["a"].get("COMPANYID").company_id};o["a"].confirm({title:"是否删除该定制人信息",confirmButtonText:"确定删除",cancelButtonText:"取消"}).then(function(){m["n"].delAiMeasure(i).then(function(i){1==i?(Object(n["a"])("删除成功"),t.list.splice(e,1),t.infoActive=null):Object(n["a"])("删除失败")},function(){Object(n["a"])("提交出错了~")})}).catch(function(){})}},dataConfirm:function(){p["a"].get("toReserveParams").goodCodes;this.$store.commit("aiMeasureBody/resetData");var e=null;if(this.infoActive||0==this.infoActive){if(this.list[this.infoActive].figureDtos)if(this.list[this.infoActive].figureDtos.length>0)for(var t=0;t<this.list[this.infoActive].figureDtos.length;t++){if(1==this.list[this.infoActive].figureDtos[t].mustFlag&&!this.list[this.infoActive].figureDtos[t].values){e=!1;var i={userName:this.list[this.infoActive].usrName,aiId:this.list[this.infoActive].id,fromPage:"aiCountBody",submitType:"submitType",data:[]};if(this.list[this.infoActive].figureDtos)for(var s=0;s<this.list[this.infoActive].figureDtos.length;s++){var a={id:this.list[this.infoActive].figureDtos[s].vipFeatureInfoId,values:this.list[this.infoActive].figureDtos[s].valueNames||this.list[this.infoActive].figureDtos[s].values,featureCode:this.list[this.infoActive].figureDtos[s].featureCode,valueIds:this.list[this.infoActive].figureDtos[s].values};i.data.push(a)}return this.$router.push({name:"aiAmountBody",params:i,query:{fromType:"goodOrder"}}),void Object(n["a"])("请完成定制人数据")}e=!0}else e=!0;else e=!0;if(e){var o=this.list[this.infoActive];if(o.figureDtos)for(var r=0;r<o.figureDtos.length;r++)o.figureDtos[r].values||this.$set(o.figureDtos[r],"values",null);this.$router.push({name:p["a"].get("reserveStorage").routeName,params:{measureOpCode:p["a"].get("reserveStorage").measureOpCode,liangti:o,yuyue:p["a"].get("reserveStorage").yuyue},query:p["a"].get("reserveStorage").v_data})}else{i={userName:this.list[this.infoActive].usrName,aiId:this.list[this.infoActive].id,fromPage:"aiCountBody",submitType:"submitType",data:[]};if(this.list[this.infoActive].figureDtos)for(s=0;s<this.list[this.infoActive].figureDtos.length;s++){a={id:this.list[this.infoActive].figureDtos[s].vipFeatureInfoId,values:this.list[this.infoActive].figureDtos[s].valueNames||this.list[this.infoActive].figureDtos[s].values,featureCode:this.list[this.infoActive].figureDtos[s].featureCode,valueIds:this.list[this.infoActive].figureDtos[s].values};i.data.push(a)}this.$router.push({name:"aiAmountBody",params:i,query:{fromType:"goodOrder"}}),Object(n["a"])("请完成定制人数据")}}else Object(n["a"])("请选择定制人~")},getLoadAiMeasure:function(){var e=this,t={partCodes:p["a"].get("toReserveParams").goodCodes,usrId:p["a"].get("USER_INFO").usrId,companyId:p["a"].get("COMPANYID").company_id,pageNum:this.pageNum,pageSize:5};m["n"].getAiMeasure(t).then(function(t){e.countDodyData=t.list;for(var i=e.countDodyData.length,s=0;s<i;s++)null!==e.countDodyData[s].ctmmeasureDtMsrtypeDtos&&e.list.push(e.countDodyData[s]);t.pageNum>=t.pages?e.finished=!0:e.finished=!1,e.isLoading=!1,e.loading=!1},function(){e.finished=!0,Object(n["a"])("接口出错~")})},getAiMeasure:function(e){var t=this,i={partCodes:p["a"].get("toReserveParams").goodCodes,usrId:p["a"].get("USER_INFO").usrId,companyId:p["a"].get("COMPANYID").company_id,pageNum:1,pageSize:5},s=[];m["n"].getAiMeasure(i).then(function(i){t.countDodyData=i.list;for(var a=t.countDodyData.length,o=0;o<a;o++)if(null!==t.countDodyData[o].ctmmeasureDtMsrtypeDtos){t.$set(t.countDodyData[o],"dressedusrName",t.countDodyData[o].dressedusrName),t.$set(t.countDodyData[o],"measureLog",t.countDodyData[o].measureLog),t.$route.query.addData?t.$route.query.addData==t.countDodyData[o].id&&(t.infoActive=o,t.infoSid=t.$route.query.addData):t.infoSid=t.countDodyData[0].id,s.push(t.countDodyData[o])}for(var n=0;n<s.length;n++)t.$set(s[n],"isSelected",!0);i.pageNum>=i.pages?t.finished=!0:t.finished=!1,t.list=s,t.isLoading=!1,t.loading=!1,0!=i.list.length||e||(t.showEmpty=!0,t.$router.replace({name:"aiAmountBody",query:{fromType:"goodOrder",successUrl:t.$route.query.successUrl}}))},function(){Object(n["a"])("提交出错了~")})}},created:function(){this.setReserveStorage(),this.getAiMeasure()},mounted:function(){var e=this;setTimeout(function(){e.$nextTick(function(){window.scrollTo(0,1)})},100)}},y=A,C=(i("e8e7"),Object(g["a"])(y,s,a,!1,null,"6de6e912",null));C.options.__file="aiCountBody.vue";t["default"]=C.exports},e4a04:function(e,t,i){},e8e7:function(e,t,i){"use strict";var s=i("0907"),a=i.n(s);a.a}}]);