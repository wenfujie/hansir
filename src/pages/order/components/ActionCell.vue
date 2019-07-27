<style lang='scss' scoped>
 .container{
   font-size: computed(28);
   .item{
     display: flex;
     padding: computed(30) 0;
     justify-content: space-between;
     align-items: center;
     .auto{
       flex: 1;
       display: flex;
       
     }
     .span2{
        flex: 2;
     }

     .value{
         margin-left: computed(50);
     }
       &.item--search{
           align-items: flex-start;
       }
   }
   .flex-center{
        justify-content: center;

   }
   .flex-left{
       justify-content: flex-start;
   }
    .flex-right{
       justify-content: flex-end;
   }
    .pdTb5{
       padding: computed(5) 0;
   }
   .pdTb10{
       padding: computed(10) 0;
   }
   .pdTb15{
       padding: computed(15) 0;
   }
   .pdTb20{
       padding: computed(20) 0;
   }
   .pdTb30{
       padding: computed(30) 0;
   }
 }
    .reset-input{
        background: #f5f5f5;
        font-size: computed(26);
        padding: computed(10);

    }
    .search-btn{
        width: computed(120);
        line-height: computed(56);
        border: computed(1) solid #999;
        text-align: center;
    }
    .search-errortip{
        margin-top: computed(8);
        color: $maincolor;
    }
    .pointer-tip{
        color: #999;
    }
    .pointer-icon{
        margin-right: computed(5);
        color: #999;
    }
    .mg-left{
        margin-left: computed(30);
    }
    .align-center{
        align-items: center;
    }
</style>

<template>
    <div class="container">
        <div class="item" v-if="renderType=='arrow'" @click="onClick()">
            <div class="">{{label}}</div>
            <div class="mg-left auto flex-left">{{content}}</div>
            <div class="flex-right">
                <i class="iconfont icon-gengduo"></i>
            </div>
        </div>
        <div class="item pdTb15" v-if="renderType=='swicth'&&componentId==3&&item.show">
            <div :class="['align-center',{'auto':!item.unUseText}]">
                <span>{{label}}</span>
                <!-- <i @click="onPointerIcon"
                   v-if="item.showIcon"
                   class="iconfont icon-bangzhu pointer-icon"></i> -->
            </div>
            <div class="auto flex-left" v-if="!item.unUseText">{{content}}</div>
            <div class="auto flex-right">
                <i @click="onPointerIcon"
                   v-if="item.showIcon"
                   class="iconfont icon-bangzhu pointer-icon"></i>
                <span v-if="item.unUseText" class="pointer-tip">{{item.unUseText}}</span>
                <van-switch
                    :value="switchOn"
                    active-color="#000"
                    inactive-color="#e6e6e6"
                    v-else
                    @input="onSwitch"
                />
            </div>
        </div>
        <div class="item pdTb15" v-if="renderType=='swicth'&&componentId==4">
            <div class="auto">{{label}}</div>
            <div class="auto flex-left">{{content}}</div>
            <div class="auto flex-right">
                <van-switch
                        :value="switchOn"
                        active-color="#000"
                        inactive-color="#e6e6e6"
                        @input="onSwitch"
                />
            </div>
        </div>
        <div class="item pdTb5" v-if="renderType=='field'">
            <div class="auto">{{label}}</div>
            <van-field
                maxlength="40"
                clearable
                v-model="message"
                @blur="onFieldBlur()"
                placeholder="填写留言，最多40个字"
                class="span2"
            />
        </div>
        <div class="item item--search pdTb15" v-if="renderType=='input'">
            <div class="span2">
                <van-field
                        ref="searchRef"
                        clearable
                        @blur="onSearchBlur"
                        @input="onSearchInput"
                        v-model="searchValue"
                        placeholder="请输入券号"
                        class="reset-input"
                />
                <p v-show="item.errMsg" class="fs28 search-errortip">{{item.errMsg}}</p>
            </div>
            <div class="search-btn mgL30" @click="excutCb">确定</div>
        </div>
    </div>
</template>

<script>
import { Field, Switch, Radio, Area, } from 'vant';
export default {
    props: {
        item: {
            type: Object
        }
    },
    data() {
        return {
            switchOn: true,
            message: "",
            searchValue:"",//券号值
            // label: 'name'
        }
    },
    components: {
        'van-field': Field,
        'van-switch': Switch,
        'van-radio': Radio,
        'van-area': Area,
    },
    methods: {
        // 执行回调
        excutCb(value = {}) {
            if (!this.item.action) return false;
            if (typeof this.item.action != "function") return false;
            if (this.renderType == 'field') {
                this.item.action(value)
            } else if(this.renderType == 'input'){
                this.item.action(this.searchValue)
            }else {
                this.item.action(this.item, value)
            }
        },
        onClick() {
            this.excutCb();
        },
        onSwitch(value) {
            this.switchOn = value;
            this.excutCb(value);
        },
        // 输入框值
        onFieldBlur() {
            this.excutCb(this.message);
        },
        // 查券输入框失焦
        onSearchBlur(){
            if(typeof this.item.blurAction == 'function'){
                this.item.blurAction(this.searchValue);
            }
        },
        // 查券输入框值变化
        onSearchInput(){
            if(typeof this.item.inputAction == 'function'){
                this.item.inputAction(this.searchValue);
            }
        },
        // 搜索券组件公共方法
        searchInputCommonFun(type){
            switch(type){
                //清空输入框
                case 'clear':
                    this.searchValue = "";
                    break;
                    //聚焦输入框
                case 'focus':
                    this.$refs.searchRef.focus();
                    break;
            }
        },
        // 点击积分icon
        onPointerIcon(){
            if(typeof this.item.clickIcon === 'function'){
                this.item.clickIcon();
            }
        },
    },
    computed: {
        renderType: function () {
            return this.item.renderType;
        },
        label: function () {
            return this.item.name;
        },
        content: function () {
            return this.item.value;
        },
        enable: function () {
            return this.item.enable;
        },
        componentId(){
            return this.item.id;
        }
    },

}
</script>