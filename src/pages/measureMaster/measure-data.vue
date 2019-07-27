/*
* createTime：2018/11/14
* author：en.chen
* description:  填写量体数据
*/
<template>
    <div class="measure-data">

        <!-- 选择量体类别 begin -->
        <div class="msr-type">
            <p class="msr-title">选择量体类别<span>（可多选）</span></p>
            <ul class="msr-type-list">
                <li v-for="item in msrTypeList" :key="" class="msr-type-item" :class="{ 'act' : actTypeList.indexOf(item.measureClassInfoId) !== -1  }">
                    <p :for="item.measureClassInfoId">{{item.measureClassInfoName}}</p>
                    <input class="checkInput" name="msr-type" type="checkbox" v-model="actTypeList" :value="item.measureClassInfoId" :disabled="hasOrder === true" @change="choseType">
                    <div class="act-bg" v-if="actTypeList.indexOf(item.measureClassInfoId) !== -1"></div>
                </li>
            </ul>
        </div>
        <!-- 选择量体类别 end -->

        <!-- 净体数据 begin -->
        <div class="msr-actual-data" v-if="actualBodyData.length > 0">
            <p class="msr-title">净体数据</p>
            <ul class="msr-body-list">
                <li class="msr-body-item" v-for="item in actualBodyData">
                    <span class="item-label">{{item.gctMeasureHdName}}</span>
                    <input type="number" class="item-val" v-model="item.value" @change="checkItem(item)" />
                </li>
            </ul>
        </div>
        <!-- 净体数据 end-->

        <!--参照量体 begin-->
        <div class="msr-refer-data" v-for="item in actMsrTypeList" :key="">
            <div class="refer-header">
                <div class="refer-header-label">
                    <label>参照商品</label>
                    <input type="text" class="refer-content" placeholder="请输入商品号" v-model="item.referGoodsName" @change="getReferSizeList(item)" />
                </div>
                <div class="refer-header-label">
                    <label>参照尺码</label>
                    <div class="refer-content"><span>{{item.referGoodsSize}}</span></div>
                    <i class="iconfont icon-gengduo" @click="choseSize(item)"></i>
                </div>
            </div>
            <div class="refer-table">
                <div class="order-goods refer-table-item border-none" v-if="hasOrder === true">
                    <div class="label">量体商品</div>
                    <div class="item-value border-none">{{item.ptiPartHdName}}</div>
                </div>
                <div class="refer-table-item item-menu">
                    <div class="label">量体项目</div>
                    <div class="label">参考数据</div>
                    <div class="item-value">修改值</div>
                    <div class="label">量体值</div>
                </div>
                <div class="refer-table-item item-detail" v-for="(data,index) in item.referData" v-show="item.showTable === true">
                    <div class="label">{{data.name}}</div>
                    <div class="label">{{data.referData}}</div>
                    <div class="item-value">
                        <div class="item-icon reduce-icon" @click="data.actualData -= 1"></div>
                        <p class="item-deviation">{{Number(data.actualData) - Number(data.referData) | Fix2}}</p>
                        <div class="item-icon add-icon" @click="data.actualData += 1"></div>
                    </div>
                    <div class="label">{{data.actualData}}</div>
                </div>
            </div>
        </div>
        <!--参照量体 end-->

        <!-- 底部按钮 begin -->
        <div class="bottom-btn-box bg-white">
            <div class="btn cancel-btn" @click="goBack">取消</div>
            <div class="btn confirm-btn" @click="saveMeasure">确定</div>
        </div>
        <!-- 底部按钮 end-->

        <!--参照尺码选择弹窗 begin-->
        <van-popup v-model="showSizeSelect" position="bottom" @click-overlay="cancelSizePopup">
            <van-picker :columns="referSizeList" show-toolbar @cancel="cancelSizePopup" @confirm="selectSize"
                        class="picker-fixed"></van-picker>
        </van-popup>
        <!--参照尺码选择弹窗 end-->

    </div>
</template>
<script>
    import { MeasureMaster } from '../../api/service'
    import { Toast, Popup, Picker } from 'vant'
    export default {
        components: {
            'van-popup' : Popup,
            'van-picker': Picker
        },
        data() {
            return {
                hasOrder: false,  // 是否存在订单
                saleCode: '',  //  订单号
                orderCode: '',  //  预约工单号
                measureCode: '', //量体工单号
                msrTypeList: [],  // 量体类别及类别下的量体数据
                actTypeList: [],  //  选中量体的类别id
                actualBodyData: [],  // 净体数据（实际量体）
                referSizeList: [], // 选中商品参照尺码
                showSizeSelect: false,  // 显示参照尺码的弹窗控制变量
            }
        },
        methods: {
            goBack(){
                this.$router.go(-1)
            },
            //  获取量体类别(预约工单绑定订单)
            getMsrType () {
                let params = {
                    saleCode: this.saleCode
                }
                MeasureMaster.getMeasureType(params).then((res) => {
                    if(res.measurePartVoList !== null && res.measurePartVoList.length > 0) {
                        res.measurePartVoList.forEach((item) => {
                            item.referGoodsName = ''  //  初始化参照商品code
                            item.referGoodsSize = ''  //  初始化参照商品尺码列表
                            item.referGoodsId = ''  //  初始化参照商品Id
                            item.referGoodsSizeId = ''  //  初始化参照商品尺码列表Id
                            item.canSelect = false  // 初始化默认不允许选择参照商品尺码
                            item.showTable = false // 初始化隐藏量体表格
                            item.referData = []  // 初始化量体表格
                        })
                    }
                    this.msrTypeList= res.measurePartVoList
                }).then(() =>{
                    //  预约工单和订单绑定的情况下默认选中订单中的量体类别，并查询实际量体
                    if(this.msrTypeList !== null && this.msrTypeList.length > 0) {
                        this.msrTypeList.forEach((item) => {
                            this.actTypeList.push(item.measureClassInfoId)

                            //  通过商品id获取参照商品的参照尺码
                            let data = {
                                id: item.ptiPartHdId
                            }
                            MeasureMaster.getGoodsData(data).then((resp) => {
                                resp.gctPartDtMeasureVos.forEach((item) => {
                                    item.text = item.sizeName
                                    item.value = item.id
                                })
                                item.referSizeList = resp.gctPartDtMeasureVos
                                item.useList = false  // 初始化设置不使用参照尺码列表
                            })
                        })
                    }
                    if(this.actTypeList.length > 0) {
                        //  通过量体类别中的量体类别id查询实际量体
                        let data = {
                            ids: this.actTypeList.join(','),
                            isGetList: true
                        }
                        MeasureMaster.getBodyData(data).then((resp) => {
                            if(resp.length > 0) {
                                resp.forEach((item) => {
                                    //  初始化每个实际量体数据的值
                                    item.value = ''
                                })
                            }
                            this.actualBodyData = resp
                        })
                    }
                })
            },

            //  获取量体类别(默认)
            getDefaultMsrType () {
                let data = {
                    pageNum: 0,
                    pageSize: 0
                }
                MeasureMaster.getDefaultMeasureType(data).then((res) => {
                    if(res.list !== null && res.list.length > 0) {
                        res.list.forEach((item) => {
                            item.measureClassInfoId = item.id  // 初始化量体类别id
                            item.measureClassInfoName = item.measureClassName  // 初始化显示字段
                            item.referGoodsName = ''  //  初始化参照商品code
                            item.referGoodsSize = ''  //  初始化参照商品尺码列表
                            item.referGoodsId = ''  //  初始化参照商品Id
                            item.referGoodsSizeId = ''  //  初始化参照商品尺码列表Id
                            item.canSelect = false  // 初始化默认不允许选择参照商品尺码
                            item.showTable = false // 初始化隐藏量体表格
                            item.referData = []  // 初始化量体表格
                        })
                    }
                    this.msrTypeList= res.list
                })
            },

            //  根据选中的量体类别查询参照量体
            choseType () {
                if(this.hasOrder === true) {  //  订单量体类别不允许修改
                    return
                }else{
                    if(this.actTypeList.length>0) {
                        let str = this.actTypeList.join(',')
                        this.msrTypeList.forEach((item) => {
                            if(str.indexOf(item.measureClassInfoId) !== -1) {
                                //  通过量体类别中的量体类别id查询实际量体
                                let data = {
                                    ids: this.actTypeList.join(','),
                                    isGetList: true
                                }
                                MeasureMaster.getBodyData(data).then((resp) => {
                                    if(resp.length > 0) {
                                        resp.forEach((item) => {
                                            //  初始化每个实际量体数据的值
                                            item.value = ''
                                        })
                                    }
                                    this.actualBodyData = resp
                                })
                            }
                        })
                    }else{
                        this.actualBodyData = []
                    }
                }
            },

            //  判断实际量体数据是否处于正确范围
            checkItem (item) {
                if((item.value * 1.0) > item.maxValue || item.value < item.minValue) {
                    Toast('请输入' + item.minValue + '至' + item.maxValue + '的数据~')
                    item.value = ''
                }else{
                    item.value = Number(item.value).toFixed(1)
                }
            },

            //  输入参照商品的编码查询商品尺寸
            getReferSizeList (item) {
                //  初始化量体类型内容
                item.referData = []
                item.showTable = false
                item.useList = false
                item.canSelect = false
                item.referGoodsSize = ''

                //  根据输入的商品code查询商品信息
                let data = {
                    partCode: item.referGoodsName
                }
                MeasureMaster.getGoodsInfo(data).then((res) => {
                    if(!res.partClassId) {
                        Toast('请输入正确的商品编码~')
                        item.referGoodsName = ''
                        return
                    }
                    //  根据获取到的商品分类id查询商品量体类型
                    let classData = {
                        partClassIds: res.partClassId
                    }
                    MeasureMaster.getGoodsMeasureType(classData).then((response) => {
                        if(response.length <= 0 || response[0].measureClassInfoId !== item.measureClassInfoId) {
                            Toast('请输入正确量体类型的商品~')
                            item.referGoodsName = ''
                            return
                        }else{
                            //  如果量体工单没有带订单，则使用商品的量体类别查询参照尺码
                            if(this.hasOrder === false) {
                                //  通过商品id获取参照商品的参照尺码
                                let data = {
                                    id: res.id
                                }
                                MeasureMaster.getGoodsData(data).then((resp) => {
                                    if(resp.gctPartDtMeasureVos !== null) {
                                        resp.gctPartDtMeasureVos.forEach((msrItem) => {
                                            msrItem.text = msrItem.sizeName
                                            msrItem.value = msrItem.id
                                        })
                                        item.referSizeList = resp.gctPartDtMeasureVos
                                        item.useList = false  // 初始化设置不使用参照尺码列表
                                    }else{
                                        item.referGoodsName = ''
                                        Toast('该商品暂无可选尺码~')
                                    }
                                }).then(() => {
                                    item.referGoodsId = res.id
                                    //  量体类型一致的情况允许选择参照尺码
                                    item.canSelect = true
                                    //  通过量体类别中的量体类别id查询实际量体
                                    let data = {
                                        ids: item.measureClassInfoId,
                                        isGetList: true
                                    }
                                    MeasureMaster.getBodyData(data).then((resp) => {
                                        if(resp.length > 0) {
                                            let map = {}
                                            map.list = []
                                            resp.forEach((respData) => {
                                                //  将分类下所有的量体类型添加进数组
                                                map.name = respData.gctMeasureHdName  // 初始化列表名称
                                                map.referData = 0 //  初始化参考数据
                                                map.changeValue = 0 // 初始化修改值
                                                map.actualData = 0 //  初始化量体值
                                                map.masmeasureHdId = respData.id
                                                item.referSizeList.forEach((sizeData) => {
                                                    //  选择量体类别相对应的尺码数组
                                                    if(sizeData.partDttMeasureVos[0].gctMeasureHdId === respData.id) {
                                                        sizeData.partDttMeasureVos[0].showData = false
                                                        map.list.push(sizeData.partDttMeasureVos[0])
                                                    }
                                                })
                                                item.referData.push(map)
                                                map = {}
                                                map.list = []
                                            })
                                        }
                                    })
                                })
                            }
                            if(this.hasOrder === true) {
                                item.referGoodsId = res.id
                                //  量体类型一致的情况允许选择参照尺码
                                item.canSelect = true
                                //  通过量体类别中的量体类别id查询实际量体
                                let data = {
                                    ids: item.measureClassInfoId,
                                    isGetList: true
                                }
                                MeasureMaster.getBodyData(data).then((resp) => {
                                    if(resp.length > 0) {
                                        let map = {}
                                        map.list = []
                                        resp.forEach((respData) => {
                                            //  将分类下所有的量体类型添加进数组
                                            map.name = respData.gctMeasureHdName  // 初始化列表名称
                                            map.referData = 0 //  初始化参考数据
                                            map.changeValue = 0 // 初始化修改值
                                            map.actualData = 0 //  初始化量体值
                                            map.masmeasureHdId = respData.id
                                            item.referSizeList.forEach((sizeData) => {
                                                //  选择量体类别相对应的尺码数组
                                                if(sizeData.partDttMeasureVos[0].gctMeasureHdId === respData.id) {
                                                    sizeData.partDttMeasureVos[0].showData = false
                                                    map.list.push(sizeData.partDttMeasureVos[0])
                                                }
                                            })
                                            item.referData.push(map)
                                            map = {}
                                            map.list = []
                                        })
                                    }
                                })
                            }
                        }
                    })
                })


            },

            //  显示参照尺码弹窗，并给弹窗内容赋值
            choseSize (item) {
                if(item.canSelect === false && !item.referGoodsName) {
                    Toast('请先输入商品号~')
                    return
                }else{
                    if(item.canSelect === false) {
                        Toast('数据正在加载中~')
                        this.cancelSizePopup
                        return
                    }
                    if(!item.referSizeList || item.referSizeList.length <= 0) {
                        Toast('该量体类别暂无参照尺码~')
                        this.cancelSizePopup
                        return
                    }else{
                        this.referSizeList = item.referSizeList
                        item.useList = true
                        this.showSizeSelect = true
                    }
                }
            },

            //  选择商品分类并查询相关的参照量体项目
            selectSize(value){
                this.msrTypeList.forEach((item) => {
                    if(item.useList === true) {
                        item.referData.forEach((data) => {
                            for(let i=0; i<value.partDttMeasureVos.length; i++) {
                                if(data.masmeasureHdId === value.partDttMeasureVos[i].gctMeasureHdId) {
                                    data.referData = value.partDttMeasureVos[i].value  //  显示参照尺码
                                    data.actualData = value.partDttMeasureVos[i].value  // 显示实际尺码
                                    item.referGoodsSize = value.text  // 显示选中尺码文字
                                    item.referGoodsSizeId = value.sizeId  // 选中尺码的id
                                    item.showTable = true  // 显示量体数据
                                    item.useList = false
                                }
                            }
                        })
                    }
                })
                this.showSizeSelect = false
            },

            //  关闭参照尺码弹窗
            cancelSizePopup () {
                this.showSizeSelect = false
                this.referSizeList = []
                this.msrTypeList.forEach((item) => {
                    item.useList = false
                })
            },

            //  保存预约量体
            saveMeasure () {
                if(this.actualBodyData.length <= 0 && this.actMsrTypeList.length <= 0) {
                    Toast('请先完善量体数据~')
                    return
                }
                let checked = true
                let map = {}
                map.volumns = []
                let arr = []
                //  选择参照量体的商品及对应数据
                this.actMsrTypeList.forEach((item) => {
                    if(item.referGoodsSize) {  // 未选择尺码的情况下不传参照数据
                        item.referData.forEach((refData) => {
                            refData.range = refData.actualData
                            refData.standardValue = refData.referData
                            refData.measureValue = null
                        })
                        this.hasOrder === true ? (map.rtlOrdDtId = this.orderCode) : (map.rtlOrdDtId = item.ptiPartHdId || null)
                        map.ptiPartHdId = item.referGoodsId || null
                        map.sizeId = item.referGoodsSizeId || null
                        map.msrModeTypeCode = 'D_REFMSR'
                        map.measureClassInfoId = item.measureClassInfoId
                        map.volumns = item.referData
                        if(map.volumns.length > 0) {
                            arr.push(map)
                        }
                    }
                    map = {}
                    map.volumns = []
                })
                //  实际量体及对应数据
                let orderMap = {}
                let measureIdArr = []
                this.actualBodyData.forEach((item) => {
                    if(measureIdArr.indexOf(item.measureClassInfoId) === -1) {
                        measureIdArr.push(item.measureClassInfoId)
                    }
                })
                for(let j =0;j<measureIdArr.length; j++) {
                    for(let i=0; i<this.actualBodyData.length; i++) {
                        let item = this.actualBodyData[i]
                        if(item.measureClassInfoId === measureIdArr[j]) {
                            if(!item.value || item.value === null) {
                                Toast('请先完善量体数据~')
                                checked = false
                            }else{
                                orderMap.masmeasureHdId = item.id
                                orderMap.measureValue = parseFloat(item.value)
                                orderMap.range = null
                                orderMap.standardValue = null
                                map.volumns.push(orderMap)
                                orderMap = {}
                                map.rtlOrdDtId = this.orderCode || null
                                map.msrModeTypeCode = 'D_ACTUALMSR'
                                map.measureClassInfoId = item.measureClassInfoId
                            }
                        }
                    }
                    arr.push(map)
                    map = {}
                    map.volumns =[]
                }
                if(checked === false) {
                    return
                }
                let data = {
//                    orderBillCode: this.saleCode || null,
                    //  需求变动，传参从预约工单改成量体工单
                    billCode: this.measureCode || null,
                    dtRefs: arr
                }
                MeasureMaster.saveMeasure(data).then((res) => {
                    if(res) {
                        Toast('保存成功~')
                        this.$router.push('/measure-master/master-center')
                    }
                })
            }
        },
        created() {
            this.saleCode = this.$route.query.saleCode
            this.measureCode = this.$route.query.measureCode
            this.orderCode = this.$route.query.orderCode
            //  当存在订单的时候从订单中取商品、量体类别、净体数据
            if(this.orderCode && this.orderCode !== null && (this.orderCode.indexOf('null') === -1)) {
                this.hasOrder = true
                this.getMsrType()
            }else{
                this.hasOrder = false
                this.getDefaultMsrType()
            }
        },
        computed : {
            'actMsrTypeList' : function () {  // 参照量体数据列表
                let actMsrTypeList = []
                this.msrTypeList.forEach((item) => {
                    if(this.actTypeList.join(',').indexOf(item.measureClassInfoId) !== -1) {
                        actMsrTypeList.push(item)
                    }
                })
                return actMsrTypeList
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .measure-data{
        position: relative;
        overflow: hidden;
        margin: 0 computed(30);
        padding-bottom: computed(124);
        .msr-title{
            margin-top: computed(30);
            font-size: computed(36);
            line-height: computed(38);
            font-weight: bold;
            color: #0D0E09;
            span{
                font-size: computed(26);
                line-height: computed(26);
                margin-left: computed(10);
            }
        }
        .msr-type{
            .msr-type-list{
                display: flex;
                flex-wrap: wrap;
                .msr-type-item{
                    box-sizing: border-box;
                    width: computed(150);
                    height: computed(56);
                    margin-top: computed(30);
                    margin-right: computed(30);
                    background: #F5F5F5;
                    position: relative;
                    border: solid 1px #CCCCCC;
                    font-size: computed(28);
                    line-height: computed(56);
                    color: #999999;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    &:nth-child(4n){
                        margin-right: 0;
                    }
                    &.act{
                        background: #ffffff;
                        border-color: #1A1A1A;
                    }
                    .checkInput{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                        z-index: 2;
                    }
                    .act-bg{
                        width: computed(24);
                        height: computed(24);
                        position: absolute;
                        top: 0;
                        right: 0;
                        background: url("../../assets/images/measure-master/choose.png") no-repeat center;
                        background-size: 100%;
                        z-index: 3;
                    }
                }
            }
        }
        .msr-actual-data{
            .msr-title{
                margin-top: computed(60);
            }
            .msr-body-list{
                display: flex;
                flex-wrap: wrap;
                .msr-body-item{
                    width: 50%;
                    display: flex;
                    margin-top: computed(40);
                    overflow: hidden;
                    color: #0D0E09;
                    .item-label{
                        display: block;
                        width: computed(90);
                        font-size: computed(28);
                        line-height: computed(46);
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .item-val{
                        display: block;
                        width: computed(180);
                        margin-left: computed(22);
                        background: #F5F5F5;
                        border: none;
                        font-size: computed(28);
                        line-height: computed(46);
                        text-align: center;
                    }
                }
            }
        }
        .msr-refer-data{
            position: relative;
            margin-top: computed(20);
            .refer-header{
                .refer-header-label{
                    box-sizing: border-box;
                    display: flex;
                    position: relative;
                    height: computed(100);
                    border-bottom: solid 1px #E6E6E6;
                    font-size: computed(28);
                    line-height: computed(100);
                    color: #0D0E09;
                    .refer-content{
                        flex: 1;
                        margin-left: computed(66);
                        border: none;
                    }
                    .icon-gengduo{
                        width: computed(60);
                        font-size: computed(24);
                        line-height: computed(100);
                        color: #0D0E09;
                        text-align: right;
                    }
                }
            }
        }
        .refer-table{
            margin-top: computed(30);
            box-sizing: border-box;
            border: solid 1px #CCCCCC;
            .refer-table-item{
                box-sizing: border-box;
                border-top: solid 1px #CCCCCC;
                display: flex;
                font-size: computed(26);
                line-height: computed(54);
                color: #666666;
                text-align: center;
                &.border-none{
                    border: none;
                }
                .label{
                    box-sizing: border-box;
                    width: computed(156);
                    height: computed(54);
                    overflow: hidden;
                    border-right: solid 1px #CCCCCC;
                }
                .item-value{
                    box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    border-right: solid 1px #CCCCCC;
                    &.border-none{
                        border: none;
                    }
                    .item-icon{
                        width: computed(40);
                        height: computed(40);
                        &.reduce-icon{
                            margin-left: computed(6);
                            background: url("../../assets/images/measure-master/reduce.png") no-repeat center;
                            background-size: 100%;
                        }
                        &.add-icon{
                            margin-right: computed(6);
                            background: url("../../assets/images/measure-master/add.png") no-repeat center;
                            background-size: 100%;
                        }
                    }
                    .item-deviation{
                        flex: 1;
                        text-align: center;
                    }
                }
            }
        }
        .bottom-btn-box{
            box-sizing: border-box;
            display: flex;
            width: 100%;
            height: computed(94);
            padding: computed(11) computed(30);
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 5;
            .btn{
                width: computed(326);
                height: computed(72);
                font-size: computed(30);
                line-height: computed(72);
                text-align: center;
            }
            .cancel-btn{
                margin-right: computed(30);
                background: #F5F5F5;
                color: #0D0E09;
            }
            .confirm-btn{
                background: #0D0E09;
                color: #E6E6E6;
            }

        }
    }
</style>