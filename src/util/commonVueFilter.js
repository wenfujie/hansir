

import Vue from 'vue'
import moment from 'moment'

//  两位小数过滤器
Vue.filter('Fix2',function(value){
    if(value == null) value = 0;
    value = Number(value);
    return value.toFixed(2);
});

// 金额分隔 1500 =》 1,500
Vue.filter('$goldDivide',function(value){
  if(value){
    return Number(value).toLocaleString();
  }
  return value;
});

Vue.filter('datetime',function(value){
  if(value){
    return moment(value).format('YYYY-MM-DD')
  }
  return value;
});

  let getFilter = Vue.filter('Fix2');
