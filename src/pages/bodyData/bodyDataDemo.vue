<template>
    <div class="design">
        <div class="toast">请填写身材数据，为您匹配</div>
        <div class="container" v-if="show">
            <van-tabs v-model="active">
                <!-- 上门量体tab begin -->
                <van-tab title="上门量体">
                    <div class="company-content">
                        <ul class="form">
                            <li class="form-row">
                                <label class="row-label" for="">联系人</label>
                                <input type="text" placeholder="请输入您的名字">
                            </li>
                            <li class="form-row">
                                <label class="row-label" for="">联系方式</label>
                                <input type="text" placeholder="请输入联系方式">
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">预约时间</div>
                                <div class="input-dialog">请选择量体日期
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">所在地区</div>
                                <div class="input-dialog">请选择城市地区
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            
                            <li class="form-row">
                                <div class="row-div" for="">具体地址</div>
                                <textarea placeholder="请输入具体地址" id="" cols="30" rows="10"></textarea>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">备注</div>
                                <textarea id="" cols="30" rows="10"></textarea>
                            </li>
                        </ul>
                    </div>
                </van-tab>
                <!-- 上门量体tab end -->

                <!-- 到店量体tab begin -->
                <van-tab title="到店量体">
                    <div class="company-content">
                        <ul class="form">
                            <li class="form-row">
                                <label class="row-label" for="">联系人</label>
                                <input type="text" placeholder="请输入您的名字">
                            </li>
                            <li class="form-row">
                                <label class="row-label" for="">联系人</label>
                                <input type="text" placeholder="请输入您的名字">
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">预约时间</div>
                                <div class="input-dialog">请选择量体日期
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">所在地区</div>
                                <div class="input-dialog">请选择城市地区
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <li class="form-row">
                                <div class="row-div" for="">选择门店</div>
                                <div class="input-dialog">请选择量体门店
                                    <div class="icon-img">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </div>
                            </li>
                            <!-- 
                            <li class="form-row">
                                <div class="row-div" for="">具体地址</div>
                                <textarea placeholder="请输入具体地址" id="" cols="30" rows="10"></textarea>
                            </li> -->
                            <li class="form-row">
                                <div class="row-div" for="">备注</div>
                                <textarea id="" cols="30" rows="10"></textarea>
                            </li>
                        </ul>
                        
                    </div>
                    
                </van-tab>
                <!-- 到店量体tab end -->
            </van-tabs>
        </div>
        
        <!-- 第二步表格 -->
        <div class="company-content">
            <ul class="form" v-if="!show">
                <li class="form-row">
                    <label class="row-label" for="">您的身高</label>
                    <input type="text" placeholder="请输入您的身高">
                    <div class="dangwei">cm</div>
                </li>
                <li class="form-row">
                    <label class="row-label" for="">您的体重</label>
                    <input type="text" placeholder="请输入您的体重">
                    <div class="dangwei">kg</div>
                </li>
                <li class="form-row">
                    <label class="row-label" for="">您的中腰</label>
                    <input type="text" placeholder="请输入您的中腰">
                    <div class="dangwei">kg</div>
                </li>
                <li class="form-row">
                    <div class="row-div" for="">穿衣习惯</div>
                    <div class="input-radio">
                        <van-radio-group v-model="radio">
                            <van-radio name="1">紧身</van-radio>
                            <van-radio name="2">宽松</van-radio>
                        </van-radio-group>
                    </div>
                </li>
            </ul>
        </div>
        <div class="submit">提交预约</div>


        <!-- 省市区选择 -->
        <van-popup v-model="showAreaList" position="bottom">
            <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false"/>
        </van-popup>

        <!-- 日期选择 -->
        <van-popup v-model="showDataList" position="bottom">
            <van-datetime-picker v-model="currentDate" type="datetime" @confirm="dataChange"
                                 @cancel="showDataList = false" :min-date="minDate" :max-date="maxDate"/>
        </van-popup>
    </div>
</template>
<script>
    // import _ from 'lodash'
     import {RadioGroup,Radio,Popup,Toast, Icon, Field, Loading, Dialog,Tab,Tabs,Area,DatetimePicker,Picker} from 'vant'
    // import Storage from './../../util/storage'
    // import ISCC from '../../assets/js/custom_method'
    // import axios from 'axios'

    export default {
        name: 'web-design',
        components: {
            "van-popup": Popup,
            "van-area": Area,
            "van-datetime-picker": DatetimePicker,
            "van-picker": Picker,
            "van-tab": Tab,
            "van-tabs": Tabs,
            "van-radio-group":RadioGroup,
            "van-radio": Radio


        },
        data() {
            return {
                // tab选中选项
                active:1,
                show: false,
                radio: '1'
            }
        },
        computed: {

        },
        methods: {
            
        },
        created() {
            // Dialog.confirm({
            //     message: '汉狮要求使用你的地理位置，是否允许？',
            //     confirmButtonText: '是',
            //     cancelButtonText: '否'
            // }).then(() => {
            // }).catch(() => {
            // });

        }
    }
</script>
<style scoped lang="scss" type="text/scss">
    // @import "../../assets/scss/goods/web-design";
    @import "../../assets/scss/common/myReserve";
</style>
