/*
* createTime：2018/12/20
* author：fujie.wen
* description: 编辑绣字绣花页（入口：引流页）
*/
<template>
    <div class="container">
        <div class="flex-box good-info">
            <div class="good-info-left">
                <img v-lazy="getImg(goodDetail.fileUrl)" @error="errImg($event)" alt="">
            </div>
            <div class="flex-auto good-info-right">
                <div class="fs28 good-name">{{goodDetail.goodName}}</div>
                <div class="fs26B good-price">¥{{goodDetail.salePrice | $goldDivide}}</div>
            </div>
        </div>

        <!--已选中部位区域-->
        <div class="pd30 good-select-part flex-vcenter" v-show="embPartSelectedList.length || eptPartSelectedList.length">
            <div class="good-select-container flex-auto">
                <div class="good-select-cont flex-box" v-show="embPartSelectedList.length">
                    <div class="good-select-label fs24">绣字区域：</div>
                    <ul class="flex-auto">
                        <li class="good-select-item"
                            :key="item.id"
                            v-for="(item,index) in embPartSelectedList">
                            <span>{{item.regionClassName}}</span>
                            <img @click="clearCustInfo(item,index,1)" class="icon-select-close" src="@/assets/images/goods/small-close.png" alt="">
                        </li>
                    </ul>
                </div>
                <div class="good-select-cont flex-box" v-show="eptPartSelectedList.length">
                    <div class="good-select-label fs24">绣花区域：</div>
                    <ul class="flex-auto">
                        <li v-if="item.custInfo && item.custInfo.ept.length"
                            class="good-select-item"
                            :key="item.id"
                            v-for="(item,index) in eptPartSelectedList">
                            <span>{{item.regionClassName}}</span>
                            <img @click="clearCustInfo(item,index,2)" class="icon-select-close" src="@/assets/images/goods/small-close.png" alt="">
                        </li>
                    </ul>
                </div>
            </div>

            <div class="good-select-detail fs26" @click="setDialogState(true)">查看详情</div>
        </div>

        <!--绣字绣花区域-->
        <div class="emb">
            <ul class="flex-box tab">
                <li v-for="(item,index) in tabList"
                    @click="switchNav(item,index)"
                    :class="['fs30', 'nav', {'selected':tabIndex == index}]"
                    :key="item.id">{{item.title}}</li>
            </ul>

            <!--绣字内容-->
            <div v-show="activeNavId == 1">
                <div class="model-cont">
                    <div class="title fs30B pdTb30">绣字部位</div>
                    <ul class="part-list">
                        <!--'selected-success'已填写完成状态； 当前选中状态-->
                        <li @click="selectPart(item,index)"
                            :key="item.id"
                            v-for="(item,index) in embPartList"
                            :class="['part-item', 'fs28', {'selected':index == embPartIndex}]">
                            {{item.regionClassName}}
                            <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                        </li>
                    </ul>
                </div>
                <div>
                    <div class="model-cont">
                        <div class="title fs30B pdTb30" >绣字内容</div>
                        <!--去掉maxlength，因为限制输入会导致苹果自带输入法输入中文bug-->
                        <van-field class="font-input"
                                   v-model="fontVal"
                                   clearable
                                   placeholder="最多输入3个全中文或3个全英文"
                                   :error-message="fontErrTip"
                                   @focus="inputFocus"
                                   @blur="resetPage"/>
                    </div>
                    <div class="model-cont">
                        <div class="title fs30B pdTb30">绣字颜色</div>
                        <ul class="color-list">
                            <li @click="colorIndex = index"
                                :key="item.id"
                                v-for="(item,index) in colorFontList.colorList"
                                :class="['color-item', 'fs28', {'selected':index == colorIndex}]">
                                <div class="color-cont"
                                     :style="{background: item.colorNumberHx}"
                                ></div>
                            </li>
                        </ul>
                    </div>
                    <div class="model-cont">
                        <div class="title fs30B pdTb30">绣字样式</div>
                        <div class="font-container">
                            <ul class="font-list">
                                <li @click="fontIndex = index"
                                    :key="item.id"
                                    v-for="(item,index) in colorFontList.fontList"
                                    :style="{fontFamily:item.ictEmbFontsHdName+''}"
                                    :class="['font-item', 'fs30', {'selected':index == fontIndex}]">
                                    {{item.ictEmbFontsHdName}}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!--撑开底部按钮高度-->
                    <div class="bottom-btn-height"></div>
                </div>
            </div>

            <!--绣花内容-->
           <div v-show="activeNavId == 2">
               <div class="model-cont">
                   <div class="title fs30B pdTb30">绣花部位</div>
                   <ul class="part-list">
                       <!--'selected-success'已填写完成状态； 当前选中状态-->
                       <li @click="selectPart(item,index)"
                           :key="item.id"
                           v-for="(item,index) in eptPartList"
                           :class="['part-item', 'fs28', {'selected':index == eptPartIndex}]">
                           {{item.regionClassName}}
                           <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                       </li>
                   </ul>
               </div>
               <div>
                   <div class="model-cont">
                       <div class="title fs30B pdTb30">绣花图</div>
                       <ul class="flex-box pic-list">
                           <li @click="picIndex = index"
                               :key="item.id"
                               v-for="(item,index) in picList"
                               :class="['pic-item', 'fs28', 'mgB30', {'selected':index == picIndex}]">
                               <img v-lazy="getImg(item.imageUrl)" alt="">
                               <div class="selected-img"></div>
                           </li>
                       </ul>
                   </div>
               </div>

               <!--撑开底部按钮高度-->
               <div class="bottom-btn-height"></div>
           </div>
        </div>

        <!--无可选部位显示-->
        <div class="no-useable-part fs26" v-show="!hasUseablePart">暂无可个性定制部位</div>

        <!--底部按钮-->
        <div class="foot-btn">
            <div class="foot-btn-item fs30 not-btn" @click="checkoutCanBuy">暂不设计</div>
            <div class="foot-btn-item fs30 sure-btn" @click="setDialogState(true)">确定设计</div>
        </div>

        <!--加载遮罩-->
        <div class="com-shade-style" v-show="isLoading">
            <div class="com-loading-style">
                <van-loading type="spinner" color="white"/>
            </div>
        </div>

        <!--绣字绣花详情弹窗-->
        <emb-detail-dialog ref="embDialogRef"
                           :embList="embPartSelectedList"
                           :eptList="eptPartSelectedList"
                           @sureEmitBill="sureEmitBill"
                           @handlerEdit="handlerEdit"
                           @handlerRemove="handlerRemove">
        </emb-detail-dialog>

    </div>
</template>

<script>
    import { Field,Toast,Loading,Dialog } from 'vant';
    import {Goods,Order,UserService} from "../../api/service";
    import EmbDetailDialog from './components/embDetailDialog.vue';
    import ComGoodEmbData from "./components/ComGoodEmbData.vue";

    export default {
        components:{'van-field':Field,'van-loading':Loading,EmbDetailDialog},
        mixins:[ComGoodEmbData],
        data() {
            return {
                tabList:[],// tab导航
                tabIndex: 0,// 导航当前index
                embPartIndex: -1,//绣字部件当前index
                eptPartIndex: -1,//绣花部件当前index
                colorIndex: -1,//颜色当前index
                fontIndex: -1,//字体当前index
                picIndex: -1,//图片当前index
                fontVal:'',//字体内容

                colorFontList:{},// 颜色字体列表
                goodDetail:{},//商品详情
                embPartList:[],//绣字部件列表
                eptPartList:[],//绣花部件列表
                picList:[],//绣花图片列表

                isLoading:false,//显示loading组件
                showCustDialog:true,//显示已选绣字绣花弹窗
                fontErrTip:'',//输入字体内容错误提示
            }
        },
        computed:{
            // 当前导航
            activeNavId(){
                if(this.tabList.length && this.tabIndex >= 0){
                    return this.tabList[this.tabIndex].id;
                }else{
                    return ''
                }
            },
            // 当前部件信息
            activePartItem(){
                if(this.activeNavId == 1){
                    if(this.embPartIndex >= 0){
                        return this.embPartList[this.embPartIndex];
                    }else{
                        return null
                    }
                }else{
                    if(this.eptPartIndex >= 0){
                        return this.eptPartList[this.eptPartIndex];
                    }else{
                        return null
                    }
                }
            },

            // 绣字绣花数组对应key名
            partListKey(){
                if(this.activeNavId == 1){//绣字
                    return 'embPartList';
                }else{
                    return 'eptPartList';
                }
            },
            // 绣字绣花选中index对应key名
            partIndexKey(){
                if(this.activeNavId == 1){//绣字
                    return 'embPartIndex';
                }else{
                    return 'eptPartIndex';
                }
            },

            // 已选绣字区域
            embPartSelectedList(){
                let arr = this.embPartList;
                if(arr.length > 0){
                    return arr.filter(item=>{
                        if(item.custInfo && item.custInfo.emb && item.custInfo.emb.length){
                            return true;
                        }
                    })
                }else {
                    return [];
                }
            },
            // 已选绣花区域
            eptPartSelectedList(){
                let arr = this.eptPartList;
                if(arr.length > 0){
                    return arr.filter(item=>{
                        if(item.custInfo && item.custInfo.ept && item.custInfo.ept.length){
                            return true;
                        }
                    })
                }else {
                    return [];
                }
            },
            hasUseablePart(){
                if(this.embPartList.length || this.eptPartList.length){
                    return true;
                }else{
                    return false;
                }
            },
        },
        methods: {
            // 选中部位
            selectPart(item,index){
                if(this[this.partIndexKey] === index)return
                // 所点击绣花部位若该部位无绣字，则做提示  反之亦然
                let allPartList = this.goodDetail.detailedList;
                for(let i=0;i<allPartList.length;i++){
                    if(allPartList[i].regionCode == item.regionClassCode){
                        if(this.activeNavId == 1){
                            if(!allPartList[i].emb.length && allPartList[i].ept.length){
                                this.dialogTip('该区域已有绣花，是否确认继续绣字？',() => {
                                    this[this.partIndexKey] = index;
                                });
                                return;
                            }
                        }else{
                            if(allPartList[i].emb.length && !allPartList[i].ept.length){
                                this.dialogTip('该区域已有绣字，是否确认继续绣花？',() => {
                                    this[this.partIndexKey] = index;
                                });
                                return;
                            }
                        }
                        break;
                    }
                }
                this[this.partIndexKey] = index;
            },
            dialogTip(msg,sucCallback){
                Dialog.confirm({
                    message: msg
                }).then(() => {
                    typeof sucCallback === 'function' && sucCallback();
                }).catch(()=>{});
            },
            // 清空绣字或绣花信息
            clearCustInfo(item,index,activeNavId){
                // 在清除绣字绣花前调用 否则无法找到对应index
                let realIndex = this.getOperateIndex(index,activeNavId);
                if(activeNavId == 1) {// 绣字
                    item.custInfo.emb = [];
                }else{
                    item.custInfo.ept = [];
                }
                if(realIndex >= 0){
                    this.setFormInfo(realIndex,activeNavId);
                }
            },
            // 控制绣字绣花弹窗显示状态
            setDialogState(boolean){
                if(boolean){
                    if(this.checkFormFull()){
                        this.$refs.embDialogRef.$data.show = boolean;
                    }
                }else{
                    this.$refs.embDialogRef.$data.show = boolean;
                }
            },
            // 详情弹窗确认回调
            sureEmitBill(){
                this.checkoutCanBuy('design');
            },
            // 编辑回调
            handlerEdit(index,activeNavId){
                // 设置tab的index
                for(let i=0;i<this.tabList.length;i++){
                    if(this.tabList[i].id == activeNavId){
                        this.tabIndex = i;
                        break;
                    }
                }

                // 设置部位的index
                this[this.partIndexKey] = this.getOperateIndex(index,activeNavId);
                this.setDialogState(false);
            },
            // 删除回调
            handlerRemove(item,index,activeNavId){
                this.clearCustInfo(item,index,activeNavId);
            },
            // input聚焦事件
            inputFocus(){
                this.scrollHeight = document.documentElement.scrollTop;
            },

            //  ios唤起键盘后导致按钮点击无效
            resetPage(){
                let letter = /[^\a-\z\A-\Z]/g;//字母
                let chi = /[^\u4E00-\u9FA5]/g;//汉字
                let letterAndChi = /^[\u0391-\uFFE5A-Za-z]+$/;//中文+字母

                if(this.fontVal){
//                    if(this.fontVal.length == 1){
//                        if(!letterAndChi.test(this.fontVal)){
//                            this.fontVal = '';
//                        }
//                    }else if(this.fontVal.length > 3){
//                        this.fontVal = '';
//                    }else{
//                        if(letter.test(this.fontVal) && chi.test(this.fontVal)){
//                            this.fontVal = '';
//                        }
//                    }

                    if(!(letter.test(this.fontVal))){// 全是字母
                        if(this.fontVal.length > 8){
                            this.fontVal = '';
                        }
                        return
                    }else{
//                        this.fontVal = '';
                    }

                    if(!chi.test(this.fontVal)){// 全是汉字
                        if(this.fontVal.length > 4){
                            this.fontVal = '';
                        }
                    }else{
                        this.fontVal = '';
                    }
                }
                setTimeout(()=>{
                    window.scroll(0,this.scrollHeight);
                },100)
            },
            /**
             * 操作已选中区域 过滤出当前操作对象对应可选部位index
             * @index 已选中区域index
             */
            getOperateIndex(index,activeNavId){
                let selectedArr = [];
                let partArr = [];
                if(activeNavId == 1) {// 绣字
                    selectedArr = this.embPartSelectedList;
                    partArr = this.embPartList;
                }else{
                    selectedArr = this.eptPartSelectedList;
                    partArr = this.eptPartList;
                }
                for(let i=0;i<partArr.length;i++){
                    if(partArr[i].regionClassCode == selectedArr[index].regionClassCode){
                        return i;
                    }
                }
            },
            /**
             * 传入部位编码 ，返回商品信息列表中对应部件index
             * @index 已选中区域index
             */
            getGoodInfoPartIndex(regionClassCode){
                let part = this.goodDetail.detailedList;
                for(let i=0;i<part.length;i++){
                    if(regionClassCode == part[i].regionCode){
                        return i;
                    }
                }
            },
            /**
             * 下单前校验 库存，手机
             * @params isDesign ‘isDesign’：确认设计  不传值：暂不设计
             **/
            checkoutCanBuy(isDesign){
                if(this.ms_isUnSell){
                    Toast('该商品已下架')
                    return;
                }
                if(this.isSaveing)return// 保存订单锁
                this.isSaveing = true;// 保存订单锁 加锁
                // 未绑定手机号不能下单
                if(!this.userInfo.mobilePhone) {
                    this.$router.push('/bind-phone');
                    this.isSaveing = false;// 保存订单锁 解锁
                    return;
                }
                this.checkoutStockPromise().then(res=>{
                    if(res.enoughAll == 1){
                        this.toBuy(isDesign);
                    }else{
                        Toast("库存不足~")
                        this.isSaveing = false;// 保存订单锁 解锁
                    }
                },err=>{
                    this.isSaveing = false;// 保存订单锁 解锁
                })
            },
            // 校验库存promise
            checkoutStockPromise(){
                let inventoryJudgeDtos = [];
                // todo 目前只有单品  后续有组合此处判断需修改
                if(true){//单品
                    inventoryJudgeDtos.push({
                        "count": this.amount,
                        "orderFlag": this.goodDetail.orderFlag,
                        "ptiPartDtSkuId": this.goodDetail.ptiPartSkuId,
                        "ptiPartHdCode": this.goodDetail.goodCode,
                        "ptiPartHdId": this.goodDetail.ptiPartHdId
                    })
                }else{//组合
                    this.groupGoodDetail.goodsList.forEach(item=>{
                        inventoryJudgeDtos.push({
                            "count": this.amount,
                            "orderFlag": item.orderFlag,
                            "ptiPartDtSkuId": item.ptiPartSkuId,
                            "ptiPartHdCode": item.goodCode,
                            "ptiPartHdId": item.ptiPartHdId
                        })
                    })
                }
                let stockData = {
                    companyId:Storage.get("COMPANYID").company_id,
                    ownCompanyId:Storage.get("COMPANYID").company_id,
                    usrId: Storage.get("USER_INFO").usrId,
                    inventoryJudgeDtos: inventoryJudgeDtos,
                    shopId: Storage.get('properties').shopId
                };
                // 库存校验
                return Goods.getGroupGoodsStockCust(stockData)
            },
            /**
             * 点击确认设计或暂不设计下单
             * @params isDesign ‘isDesign’：确认设计  不传值：暂不设计
             **/
            toBuy(isDesign){
                let orderData = {
                    companyId: Storage.get("COMPANYID").company_id,
                    usrId: Storage.get("USER_INFO").usrId,
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    cookieId: Storage.get("USER_INFO").cookieId,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    usrKey: Storage.get("USER_INFO").usrId,
                    sourceCode: "D_ORDWEIN",
                };

                if(isDesign == 'design'){
                    if(!this.checkFormFull()){//表单未填写完整
                        this.isSaveing = false;// 保存订单锁 解锁
                        return false;
                    }

                    this.addCustInfoToParams();
                }else{
                    this.goodDetail.detailedList = this.getPartListParams(this.goodDetail.detailedList);
                }

                orderData.skuList = [{
                    mainFabricId:this.goodDetail.mainFabricId,
                    amount: this.amount,
                    colorCode: this.goodDetail.colorCode,
                    dealPrice:'',
                    sizeCode: this.goodDetail.sizeCode,
                    salePrice: this.goodDetail.salePrice,
                    tagPrice: this.goodDetail.tagPrice,
                    goodsCode: this.goodDetail.goodCode,
                    thumb: this.goodDetail.fileUrl,
                    pictFileId: this.goodDetail.pictFileId,
                    partList: this.goodDetail.detailedList
                }];
                orderData.amountOrd = this.goodDetail.salePrice*this.amount;

                c_emitBill(orderData).then(res=>{
                    // todo 修改预约页流程
                    console.log(this.$route.params,"========")
                    this.$router.replace({
                        name:'orderSettlement',
                        query:{orderHdId: res},
                        params:this.$route.params
                    });
//                    this.$router.replace("/order-settlement?orderHdId=" + res);
                    this.isSaveing = false;// 保存订单锁
                },err=>{
                    this.isSaveing = false;// 保存订单锁
                })

//                Order.saveCartTemp(orderData).then((res) => {
//                    Order.orderPreferCal({ ordId: res }).then(()=>{
//                        this.isSaveing = false;// 保存订单锁
//                        this.$router.replace("/order-settlement?orderHdId=" + res);
//                    });
//                },err=>{
//                    this.isSaveing = false;// 保存订单锁
//                })
            },
            // 将绣字绣花信息添加到 提交接口参数
            addCustInfoToParams(){
                let paramsPart = this.goodDetail.detailedList;
                let json = {
                    orderFlag:1
                };
                let custArr = [{arrKey:'embPartSelectedList',dataKey:'emb'},{arrKey:'eptPartSelectedList',dataKey:'ept'}];

                custArr.forEach(child=>{
                    this[child.arrKey].forEach(item=>{
                        for(let i=0;i<paramsPart.length;i++){
                            if(paramsPart[i].regionCode == item.regionCode){
                                json[child.dataKey] = item.custInfo[child.dataKey];
                                Object.assign(paramsPart[i],json);
                                break;
                            }
                        }
                    })
                })
            },
            // 获取部件参数（用于保存）
            getPartListParams(partList){
                return partList.map(item=>{
                    return {
                        "regionCode": item.regionCode,
                        "partCode": item.partCode,
                        "fabricCode": item.fabricCode,
                        "partId": item.partId,
                        "fabricId": item.fabricId,
                        "regionId": item.regionId,
                        "memo": "",
                        "emb": [],
                        "ept": [],
                        "prt": [],
                        "salePrice": "",
                        "tagPrice": ""
                    }
                })
            },
            /***
             * 设置绣字绣花信息
             * @isRemove 从部件中删除当前绣花或绣字数据
             * @activeNavId 1 绣字； 2 绣花
             * @return true:设置绣字绣花信息  false:设置失败
             */
            setEmbInfo(isRemove,activeNavId){
                let partList = this.goodDetail.detailedList;
                let item = {};

                if(activeNavId == 1){// 绣字
                    item = this.embPartList[this.embPartIndex];
                }else{
                    item = this.eptPartList[this.eptPartIndex];
                }

                for(let i=0;i<partList.length;i++){
                    if(item.regionClassCode == partList[i].regionCode){
                        let json = {}
                        switch (activeNavId){// 绣字
                            case 1:
                                if(isRemove){
                                    if(item.custInfo){
                                        item.custInfo.emb = [];
                                    }
                                    return false;
                                }
                                let embObj = {}
                                // 绣字内容
                                embObj.content = this.fontVal
                                // 颜色
                                embObj.colorId = this.colorFontList.colorList[this.colorIndex].id
                                // 字体
                                embObj.fontsId = this.colorFontList.fontList[this.fontIndex].id
                                // 旋转
                                embObj.rotate = 0
                                // 缩放
                                embObj.scale = 0
                                // x轴坐标
                                embObj.xcoordinate = 0
                                // y轴坐标
                                embObj.ycoordinate = 0
                                // 绣字UV图
                                embObj.embPictId = ''

                                // 以下只做弹窗展示
                                embObj.colorNumberHx = this.colorFontList.colorList[this.colorIndex].colorNumberHx
                                embObj.ictEmbFontsHdName = this.colorFontList.fontList[this.fontIndex].ictEmbFontsHdName

                                json.emb = [];
                                json.emb.push(embObj);
                                break;
                            case 2:
                                if(isRemove){
                                    if(item.custInfo){
                                        item.custInfo.ept = [];
                                    }
                                    return false;
                                }

                                let eptObj = {}
                                // 绣花档案id  传的是id而不是imageId(确认过)
                                eptObj.embId = this.picList[this.picIndex].id
                                // 旋转
                                eptObj.rotate = 0
                                // 缩放
                                eptObj.scale = 0
                                // x轴坐标
                                eptObj.xcoordinate = 0
                                // y轴坐标
                                eptObj.ycoordinate = 0
                                // 绣花UV图
                                eptObj.embPrintPictId = ''

                                // 以下只做本地使用
                                eptObj.imageUrl = this.picList[this.picIndex].imageUrl
                                eptObj.imageId = this.picList[this.picIndex].imageId


                                json.ept = [];
                                json.ept.push(eptObj)
                                break;
                        }

                        item.custInfo = Object.assign(partList[i],json);
                        return item;
                    }
                }
                Toast('该设计部位与默认部件匹配不上~');
                return false;
            },

            /**
             * 点确定设计  校验绣字、花表单是否填写完整
             * @return true:表单完整 false:表单不完整
             **/
            checkFormFull(){
                if(this.embPartSelectedList.length || this.eptPartSelectedList.length){
                    return true;
                }

                let msg = '';
                if(this.activeNavId == 1){// 绣字
                    switch (true){
                        case this.embPartIndex<0:
                            msg = '绣字部位';
                            break;
                        case !this.fontVal:
                            msg = '绣字内容';
                            break;
                        case this.colorIndex<0:
                            msg = '绣字颜色';
                            break;
                        case this.fontIndex<0:
                            msg = '绣字样式';
                            break;
                    }
                }else{
                    switch (true){
                        case this.eptPartIndex<0:
                            msg = '绣花部位';
                            break;
                        case this.picIndex<0:
                            msg = '绣花图';
                            break;
                    }
                }
                if(msg){
                    Toast(msg+'不能为空');
                    return false;
                }else{
                    return true;
                }
            },
            // 获取商品可绣花、绣字部位
            getUseablePart(item){
                let partListKey = '',
                        partIndexKey = '';
                if(item.id == 1){//绣字
                    partListKey = 'embPartList';
                    partIndexKey = 'embPartIndex';
                }else{
                    partListKey = 'eptPartList';
                    partIndexKey = 'eptPartIndex';
                }
                this.ms_getUseablePart(item,this.goodDetail.ptiPartHdId).then(res=>{
                    res.forEach(item=>{
                        item.custInfo = {
                            emb: [],// 绣字
                            ept:[]// 绣花
                        };
                    })
                    this[partListKey] = res;
                    this[partIndexKey] = -1;
                    // 不存在可选部位 删除对应tab
                    if(!res || res.length <= 0){
                        for(let i=0;i<this.tabList.length;i++){
                            if(this.tabList[i].id == item.id){
                                this.tabList.splice(i,1);
                                break;
                            }
                        }
                    }else{
                        //绣字存在可选部位  加载颜色字体样式
                        if(item.id == 1) {
                            this.getColorFontList();
                        }
                    }

                    this.callGetUseablePartNum--;

                    // 做是否有部位判断   但有是否有库存问题
                    if(this.callGetUseablePartNum === 0){
                        if(!this.hasUseablePart){
                            this.dialogTip('该商品暂无个性定制部位，是否生成订单？',this.checkoutCanBuy);
                        }
                    }
                })
            },
            // 获取颜色字体列表
            getColorFontList(){
                Goods.getEmbFontColorList({}).then(res=>{
                    // 过滤未启用字体
                    res.fontList = res.fontList.filter(item=>{
                        return item.effFlag == 1;
                    })
                    this.colorFontList = res;
                    if(res.fontList.length){
                        // 暂时不需要展示字体样式
//                        this.getFont(res.fontList);
                    }
                    this.fontIndex = -1;
                    this.colorIndex = -1;
                })
            },
            // 获取绣花图片列表
            async getPicList(regionCode){
                let data = {
                    type:2,
                    goodsCode: this.goodsCode,
                    regionCode: regionCode,
                    definedFlag: 0,//自定义标记 0为不允许用户上传图片，1为允许用户上传图片
                }
                await Goods.getEmbPicList(data).then(res=>{
                    this.picList = res;
                })
            },
            /**
             * 获取绣字颜色字体
             *  author：yating.sun
             *  data:2018-07-09
             * @returns {Promise.<*>} 绣字颜色及字体
             */
            getFont: async function (getEmbFonts) {
                // 获取的字体路径写入head标签中
                let newStyle = document.createElement('style');

                getEmbFonts.forEach(font => {
                    let url = baseConstant.serverUrl + 'file-system/getImg?fileUrl=' + font.fontttfUrl + '&companyId=' + Storage.get('COMPANYID').company_id;
                    newStyle.appendChild(document.createTextNode('@font-face {font-family:' + font.ictEmbFontsHdName + ';src: url("'+ url + '")}'));
                })
                document.head.appendChild(newStyle);
            },


            // 获取单品信息
            async getGoodsInfo () {
                let data = {
                    busContsCode: baseConstant.busContsCode,
                    partCode: this.goodsCode,
                    shopId: Storage.get('USER_INFO').shopId
                };
                await Goods.getGoodsInfoCus(data).then(res => {
                    let imgList = res.urlList;
                    if(!imgList || imgList.length == 0){
                        res.urlList = [];
                        res.urlList.push({url:'aa',fileId:''});
                    }
                    // 重组部位数据
                    res.detailedList = this.getPartListParams(res.detailedList);

                    this.goodDetail = res;
                })
            },
            // 切换导航
            switchNav(item,index){
                if(this.tabIndex === index)return;
                this.tabIndex = index;
                if(this.activePartItem){
                    let goodPartIndex = this.getGoodInfoPartIndex(this.activePartItem.regionClassCode);
                    let goodPartItem = this.goodDetail.detailedList[goodPartIndex];
                    let rememberIndex = 0;
                    if(item.id == 1){
                        if(!goodPartItem.emb.length && goodPartItem.ept.length){
                            rememberIndex = this.embPartIndex;
                            this.embPartIndex = -1;
                            this.selectPart(this.embPartList[rememberIndex],rememberIndex);
                        }
                    }else{
                        if(goodPartItem.emb.length && !goodPartItem.ept.length){
                            rememberIndex = this.eptPartIndex;
                            this.eptPartIndex = -1;
                            this.selectPart(this.eptPartList[rememberIndex],rememberIndex);
                        }
                    }
                    console.log(goodPartItem,this.activePartItem)
                }
            },
            //  获取用户信息
            getUserInfo(callback) {
                this.isLoading = true;
                UserService.getUserInfo({
                    "usrId": Storage.get("USER_INFO").usrId,
                    "companyId": Storage.get("COMPANYID").company_id,
                }).then((res) => {
                    this.isLoading = false;
                    this.userInfo = res;
                    typeof callback === "function" && callback();
                },err=>{
                    this.isLoading = false;
                });
            },
            // 校验表单完整性 并设置数据信息
            checkoutFormFull(activeNavId){
                if(activeNavId == 1){// 绣字
                    if(this.embPartIndex >= 0){
                        if(this.fontIndex >= 0 && this.colorIndex >= 0 && this.fontVal){
                            this.setEmbInfo(false,1);
                        }else{
                            this.setEmbInfo(true,1);
                        }
                    }
                }else{
                    if(this.eptPartIndex >= 0){
                        if(this.picIndex >= 0){
                            this.setEmbInfo(false,2);
                        }else{
                            this.setEmbInfo(true,2);
                        }
                    }
                }
            },
            // 根据已选部位 设置表单信息
            setFormInfo(index,activeNavId){
                let colorFontList = this.colorFontList;
                if(activeNavId == 1){// 绣字
                    let embArr = this.embPartList[index].custInfo.emb;
                    if(embArr && embArr.length){
                        this.fontVal = embArr[0].content;

                        for(let i=0;i<colorFontList.colorList.length;i++){
                            if(colorFontList.colorList[i].id == embArr[0].colorId){
                                this.colorIndex = i;
                                break;
                            }
                        }
                        for(let i=0;i<colorFontList.fontList.length;i++){
                            if(colorFontList.fontList[i].id == embArr[0].fontsId){
                                this.fontIndex = i;
                                break;
                            }
                        }
                    }else{
                        if(index == this.embPartIndex){
                            this.fontVal = '';
                            this.colorIndex = -1;
                            this.fontIndex = -1;
                        }
                    }
                }else{
                    let eptArr = this.eptPartList[index].custInfo.ept;
                    if(eptArr && eptArr.length){

                        for(let i=0;i<this.picList.length;i++){
                            if(this.picList[i].imageId == eptArr[0].imageId){
                                this.picIndex = i;
                                break;
                            }
                        }
                    }else{
                        if(index == this.eptPartIndex){
                            this.picIndex = -1;
                        }
                    }
                }
            },
        },
        async created() {
            // todo
            this.goodsCode = this.$route.query.goodsCode;
//            this.goodsCode = 'HS3003';// dev 绣字有部件
//            this.goodsCode = 'QZJ001';// 测试库 绣花有图
            // 印花:10130301  D_EMBTYPE_PRT     绣字:10130302  D_EMBTYPE_FONT  绣花:10130303  D_EMBTYPE_EMBPIC
            this.tabList = this.ms_tabList;
            this.amount = this.$route.query.amount || 1;

            // 获取单品信息
            await this.getGoodsInfo();

            this.ms_checkoutGoodSell();//判断是否下架

            this.callGetUseablePartNum = this.tabList.length;// 调用getUseablePart次数
            // 获取商品可绣花、绣字部位
            this.tabList.forEach((item)=>{
                // 不要传index，因为有异步删除导致index错误问题
                this.getUseablePart(item);
            })

            //  获取用户信息
            this.getUserInfo();

            // 屏幕高度
            this.fullHeight = document.documentElement.clientHeight;
            window.resize = ()=>{
                let fixedDom = document.getElementsByClassName('foot-btn');
                if(this.fullHeight > document.documentElement.clientHeight){
                    fixedDom.style.position = 'absolute';
                }else{
                    fixedDom.style.position = 'fixed';
                }
            }
        },
        watch:{
            // 绣字
            colorIndex(num){
                this.checkoutFormFull(1);
            },
            fontIndex(num){
                this.checkoutFormFull(1);
            },
            fontVal(str){
                this.checkoutFormFull(1);
            },
            embPartIndex(num){
                if(num >= 0){
                    this.setFormInfo(num,1);
                    setTimeout(()=>{
                        this.checkoutFormFull(1);
                    },200);
                }
            },

            // 绣花
            picIndex(num){
                if(num >= 0) {
                    this.checkoutFormFull(2);
                }
            },
            async eptPartIndex(num){
                if(num >= 0) {
                    // 获取绣花图片列表
                    await this.getPicList(this.eptPartList[num].regionClassCode);
                    this.setFormInfo(num,2);
                    setTimeout(()=>{
                        this.checkoutFormFull(2);
                    },200);
                }else{
                    this.picIndex = -1;
                    this.picList = [];
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    .container{
        box-sizing: border-box;
        height: 100%;
    }
    .bottom-btn-height{
        height: computed(130);
        width: 100%;
    }
    .good-info{
        padding: computed(30);
    }
    .good-info-left{
        width: computed(220);
        height: computed(220);
        img{
            width: 100%;
            height: 100%;
        }
    }
    .good-info-right{
        padding: computed(60) computed(18) 0 computed(18);

        .good-price{
            padding-top: computed(40);
        }
    }
    .emb{}
    .tab{
        /*display: flex;*/
    }
    .nav{
        flex:1;
        text-align: center;
        line-height: computed(90);
        border-bottom: computed(1) solid #DBDBDB;

        &.selected{
            color: $maincolor;
            border-bottom: computed(4) solid $maincolor;
        }
    }
    .model-cont{
        padding: 0 computed(30);
        .title{}
    }
    .part-list{
        display: flex;
        flex-wrap: wrap;

        .part-item{
            width:computed(140);
            line-height:computed(64);
            text-align: center;
            border:1px solid #ccc;
            margin: 0 computed(30) computed(20) 0;
            position: relative;
            .icon-selected-right{
                position: absolute;
                right: 0px;
                top: 0;
                width: computed(24);
                height: computed(24);
                display: none;
            }
            &:nth-child(4n){
                margin-right: 0;
            }

            &.selected{
                border-color: $maincolor;
                color: $maincolor;
                background: #FFF3F3;
            }
            // 选过
            &.selected-success{
                border-color: $maincolor;
                color: $maincolor;
                &.icon-selected-right{
                    display: inline-block;
                }
            }
        }
    }
    .color-list{
        display: flex;
        flex-wrap: wrap;

        .color-item{
            width: computed(52);
            height: computed(52);
            border-radius: 50%;
            border: computed(2) solid transparent;
            margin-right: computed(40);
            position: relative;
            margin-bottom: computed(20);

            .color-cont{
                width: computed(44);
                height: computed(44);
                border-radius: 50%;
                position: absolute;
                left: 50%;
                top: 50%;
                margin-left: computed(-22);
                margin-top: computed(-22);
            }
            &.selected{
                border-color: $maincolor;
            }
        }
    }
    .font-container{
        width: 100%;
    }
    .font-list{
        overflow-x: auto;
        white-space: nowrap;

        .font-item{
            margin-right: computed(40);
            border-bottom: computed(4) solid transparent;
            max-width: computed(185);
            overflow: hidden;
            text-align: center;
            text-overflow: ellipsis;
            display: inline-block;
            line-height: computed(70);

            img{
                width: 100%;
                height: computed(65);
            }

            &.selected{
                border-color: $maincolor;
            }
        }
    }
    .font-input{
        background: #F5F5F5;
    }
    .foot-btn{
        position: fixed;
        bottom: computed(10);
        left: 0;
        padding: 0 computed(30);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 100%;

        .foot-btn-item{
            width: 46%;
            line-height: computed(72);
            background: #0D0E09;
            text-align: center;
        }
        .not-btn{
            background: #F5F5F5;
        }
        .sure-btn{
            color: #fff;
        }
    }
    .pic-list{
        flex-wrap: wrap;
    }
    .pic-item{
        width: computed(141);
        height: computed(141);
        border: computed(2) solid transparent;
        margin-right: computed(30);
        position: relative;

        &:nth-child(4n){
            margin-right: 0;
        }
        img{
            width: 100%;
            height: 100%;
        }
        .selected-img{
            width: computed(24);
            height: computed(24);
            position: absolute;
            top:0;
            right:0;
            display: none;
            background-image: url('../../assets/images/goods/choose.png');
            background-repeat: no-repeat;
            background-size: 100%;
        }
        &.selected{
            border-color: $maincolor;
            .selected-img{
                display: block;
            }
        }
    }
    .good-select-part{
        display: flex;
    }
    .good-select-cont{
        margin-bottom: computed(5);
        .good-select-label{
            color: #999;
            line-height: computed(42);
            margin-top: computed(5);
        }

        ul{
            flex-wrap: wrap;

            .good-select-item{
                font-size: computed(22);
                line-height:computed(42);
                text-align: center;
                border:1px solid #ccc;
                color: #666;
                margin: 0 computed(12) computed(12) 0;
                padding: 0 computed(20);
                display: inline-block;
                &:nth-child(3n){
                    margin-right: 0;
                }

                &.selected{
                    border-color: $maincolor;
                    color: $maincolor;
                }
                .icon-select-close{
                    margin-left: computed(10);
                    width: computed(15);
                    height: computed(15);
                }
            }
        }
    }
    .good-select-detail{
        width:computed(150);
        line-height:computed(54);
        background:#F5F5F5;
        text-align: center;
    }
    .no-useable-part{
        color:#999;
        height: calc(100% - #{computed(280)});
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>