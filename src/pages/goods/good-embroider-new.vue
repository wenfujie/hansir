/*
* createTime：2018/12/20
* author：fujie.wen
* description: 编辑绣字绣花页（入口：引流页）
*/
<template>
    <div class="container">

        <div class="model-cont" v-show="this.hasUseablePart">
            <div class="title fs30B pdTb30">
                <img src="@/assets/images/goods/good-embroider/select-part.png" class="title-logo">
                选择刺绣部位
            </div>
            <ul class="part-list">
                <!--'selected-success'已填写完成状态； 当前选中状态-->
                <!--v-for="(item,index) in embPartList"-->
                <li @click="selectPart(item,index)"
                    :key="item.id"
                    v-for="(item,index) in allUseablePart"
                    :class="['part-item', 'fs28','flex-vbox']">
                    <div :class="['part-img',{'selected-success':index == partIndex}]">
                        <img v-lazy="getImg(item.gblFileUrl)" class="main-img">
                        <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                    </div>
                    <div class="item-title">{{item.regionClassName}}</div>
                </li>
            </ul>
        </div>

        <div class="dom-cut" v-show="this.hasUseablePart"></div>

        <!--绣字内容-->
        <div class="emb" v-show="this.hasUseablePart">
            <div class="model-cont">
                <div class="title fs30B pdTb30">
                    <img src="@/assets/images/goods/good-embroider/select-content.png" class="title-logo">
                    选择刺绣内容
                </div>
                <ul class="flex-box tab pdR30">
                    <li v-for="(item,index) in tabList"
                        v-show="activePartItem.custLevel=='all' || (item.id==1&&activePartItem.custLevel=='emb') || (item.id==2&&activePartItem.custLevel=='ept')"
                        @click="switchNav(item,index)"
                        :class="['fs30', 'nav', {'selected':tabIndex == index}]"
                        :key="item.id">{{item.title}}</li>
                </ul>
            </div>

            <div v-show="activeNavId == 1">
                <div>
                    <div class="model-cont pdTb30">
                        <div class="pdR30">
                            <!--去掉maxlength，因为限制输入会导致苹果自带输入法输入中文bug-->
                            <van-field class="font-input"
                                       v-model="fontVal"
                                       clearable
                                       placeholder="最多输入4个全中文或8个全英文"
                                       :error-message="fontErrTip"
                                       @focus="inputFocus"
                                       @blur="resetPage"/>
                        </div>
                    </div>

                    <div class="dom-cut" v-show="activeNavId == 1"></div>

                    <div class="model-cont">
                        <div class="title fs30B pdTb30">
                            <img src="@/assets/images/goods/good-embroider/select-font.png" class="title-logo">
                            选择刺绣字体
                        </div>
                        <div class="font-container">
                            <ul class="part-list">
                                <!--'selected-success'已填写完成状态； 当前选中状态-->
                                <!--v-for="(item,index) in embPartList"-->
                                <li @click="fontIndex = index"
                                    :key="item.id"
                                    v-for="(item,index) in colorFontList.fontList"
                                    :class="['part-item','flex-vbox']">
                                    <div :class="['part-img','part-font-img',{'selected-success':index == fontIndex}]">
                                        <img v-lazy="getImg(item.picFileUrl)" class="main-img">
                                        <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                                    </div>
                                    <div class="item-title">{{item.ictEmbFontsHdName}}</div>
                                </li>
                            </ul>

                            <div class="null-list" v-show="!colorFontList.fontList || !colorFontList.fontList.length">暂无刺绣字体</div>

                        </div>
                    </div>

                </div>
            </div>

            <!--绣花内容-->
            <div v-if="activeNavId == 2" class="pd30">

                <swiper @onSwiper="onSwiper" ref="swiperRef">

                    <div class="model-cont model-cont-ept-img"
                         v-if="pIndex < picListPages"
                         v-for="(pItem,pIndex) in picListPages"
                         :key="pIndex">
                        <div>
                            <ul class="part-list star-list">
                                <li @click="switchEptPic(item,index)"
                                    :key="pIndex+index"
                                    v-for="(item,index) in picList"
                                    :class="['part-item', 'fs28','flex-vbox','ept-list']">
                                    <div :class="['part-img','part-img-star',{'selected-success':index == picIndex}]">
                                        <img v-lazy="getImg(item.imageUrl)" class="main-img" v-if="pageNum == pIndex+1 && showRealPicFlag">
                                        <img src="@/assets/images/common/default-img.png" class="main-img" v-else>
                                        <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                                    </div>
                                    <div class="item-title">{{item.embPrintName}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                </swiper>

                <!--点点点 分页指引-->
                <ul class="indicator-list flex-center" v-show="picListPages>1">
                    <li :class="['indicator-item',{'selected': pageNum == index+1}]"
                        :key="index"
                        v-for="(item,index) in picListPages"></li>
                </ul>

                <div class="null-list" v-show="picListPages <= 0">暂无刺绣图片</div>

            </div>

            <div class="dom-cut" v-show="this.hasUseablePart && (activeNavId==1 || (activeNavId==2 && picIndex>=0))"></div>

            <div class="model-cont" v-show="activeNavId==1 || (activeNavId==2 && picIndex>=0)">
                <div class="title fs30B pdTb30">
                    <img src="@/assets/images/goods/good-embroider/select-color.png" class="title-logo">
                    选择刺绣颜色
                </div>

                <div v-show="activeNavId == 1">
                    <!--绣字颜色列表-->
                    <ul class="part-list color-list">
                        <!--'selected-success'已填写完成状态； 当前选中状态-->
                        <!--v-for="(item,index) in embPartList"-->
                        <li @click="colorIndex = index"
                            :key="item.id"
                            v-for="(item,index) in colorFontList.colorList"
                            :class="['part-item','flex-vbox']">
                            <div :class="['part-img','part-img-color',{'selected-success':index == colorIndex}]">
                                <img v-lazy="getImg(item.picFileUrl)" class="main-img">
                                <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                            </div>
                            <div class="item-title">{{item.ictEmbColorsHdName}}</div>
                        </li>
                    </ul>

                    <div class="null-list" v-show="!colorFontList.colorList || !colorFontList.colorList.length">暂无刺绣颜色</div>
                </div>

                <!--绣花 && 已选绣花图-->
                <div v-show="activeNavId == 2">
                    <!--绣花颜色列表-->
                    <ul class="part-list color-list" v-show="eptColors.length">
                        <li @click="eptColorIndex = index"
                            :key="item.id"
                            v-for="(item,index) in eptColors"
                            :class="['part-item','flex-vbox']">
                            <div :class="['part-img','part-img-color',{'selected-success':index == eptColorIndex}]">
                                <img v-lazy="getImg(item.fileUrl)" class="main-img">
                                <img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">
                            </div>
                            <div class="item-title">{{item.colorName}}</div>
                        </li>
                    </ul>

                    <div class="null-list" v-show="!eptColors.length">暂无刺绣颜色</div>
                </div>

                <!--旧版 显示色块-->
                <!--<ul class="color-list">-->
                    <!--<li @click="colorIndex = index"-->
                        <!--:key="item.id"-->
                        <!--v-for="(item,index) in colorFontList.colorList"-->
                        <!--:class="['color-item', 'fs28','flex-vbox']">-->
                        <!--<div :class="['color-cont',{'selected':index == colorIndex}]"-->
                             <!--:style="{background: item.colorNumberHx}">-->
                            <!--<img class="icon-selected-right" src="@/assets/images/goods/choose.png" alt="">-->
                        <!--</div>-->
                        <!--<div class="color-name">{{item.ictEmbColorsHdName}}</div>-->
                    <!--</li>-->
                <!--</ul>-->
            </div>
        </div>

        <!--无可选部位显示-->
        <div class="no-useable-part fs26" v-show="!hasUseablePart">{{callGetUseablePartNum==0?'暂无可个性定制部位':'加载中..'}}</div>

        <!--底部按钮-->
        <div class="foot-btn">
            <p class="cust-tip" v-if="hasUseablePart && embOrEptPrice">
                <span class="cust-tip-logo">提示</span>
                <span class="cust-tip-cont">
                    选择(确定刺绣)会收取{{embOrEptPrice}}元的刺绣费喔！
                </span>
            </p>

            <div class="foot-btn-item fs30 not-btn" @click="checkoutCanBuy">不刺绣</div>
            <div class="foot-btn-item fs30 sure-btn" @click="checkoutCanBuy('design')">确定刺绣</div>
        </div>

        <div class="bottom-btn-height"></div>

        <!--加载遮罩-->
        <div class="com-shade-style" v-show="isLoading">
            <div class="com-loading-style">
                <van-loading type="spinner" color="white"/>
            </div>
        </div>

    </div>
</template>

<script>
    import { Field,Toast,Loading,Dialog } from 'vant';
    import {Goods,Order,UserService} from "../../api/service";
    import ComGoodEmbData from "./components/ComGoodEmbData.vue";
    import swiper from './components/swiper'
    import BScroll from "better-scroll";

    export default {
        components:{'van-field':Field,'van-loading':Loading,swiper},
        mixins:[ComGoodEmbData],
        data() {
            return {
                tabList:[],// tab导航
                tabIndex: 0,// 导航当前index
                partIndex: -1,//部件当前index
                colorIndex: -1,//绣字颜色当前index
                eptColorIndex: -1,//绣花颜色当前index
                fontIndex: -1,//字体当前index
                picIndex: -1,//图片当前index
                fontVal:'',//字体内容

                colorFontList:{},// 颜色字体列表
                goodDetail:{},//商品详情
                embPartList:[],//绣字部件列表
                eptPartList:[],//绣花部件列表
                allUseablePart:[],//绣字、绣花部件合并列表

                picList:[],//绣花图片列表
                eptColors:[],//绣花颜色列表

                isLoading:false,//显示loading组件
                showCustDialog:true,//显示已选绣字绣花弹窗
                showRealPicFlag:true,// 显示真实绣花图
                fontErrTip:'',//输入字体内容错误提示
                custPrice:{},//定制价格 绣字: embFontsPrice 绣花: embPrice 印花：printPrice
                pageNum: 1,//绣花图页数
                picListPages: 1,//绣花图总页数
                callGetUseablePartNum:2,//获取可用部位次数
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
                if(this.partIndex >= 0){
                    return this.allUseablePart[this.partIndex];
                }else{
                    return {}
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
            hasUseablePart(){
                if(this.embPartList.length || this.eptPartList.length){
                    return true;
                }else{
                    return false;
                }
            },
            // 底部展示 绣字或绣花费用
            embOrEptPrice(){
                let price = 0;
                if(this.activeNavId == 1){
                    price = this.custPrice.embFontsPrice;
                }else{
                    price = this.custPrice.embPrice;
                }
                return price * this.amount;
            },
        },
        methods: {
            // 选中绣花图
            switchEptPic(item,index){
                if(this.picIndex == index)return;

                this.picIndex = index;
                this.getEptColors(item.id);
            },
            //获取绣花图对应颜色列表
            getEptColors(id){
                Goods.getEptColors({id}).then(res=>{
                    this.eptColorIndex = -1;
                    if(res && res.length){
                        // 后台无启用功能 不做判断
//                        res = res.filter(item=>{
//                            return item.effFlag == 1;
//                        })
                        this.eptColors = res;
                    }else{
                        this.eptColors = [];
                    }
                })
            },
            // 选中部位
            selectPart(item,index){
                if(this.partIndex === index)return
                this.partIndex = index;
            },
            dialogTip(msg,sucCallback){
                Dialog.confirm({
                    message: msg
                }).then(() => {
                    typeof sucCallback === 'function' && sucCallback();
                }).catch(()=>{});
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

                    if(!(letter.test(this.fontVal))){// 全是字母
                        if(this.fontVal.length > 8){
                            this.fontVal = '';
                            Toast("最多输入4个全中文或8个全英文~")
                        }else{
                            this.checkoutLoadFont('D_USELANGUAGE_EN');
                        }
                        return
                    }else{
//                        this.fontVal = '';
                    }

                    if(!chi.test(this.fontVal)){// 全是汉字
                        if(this.fontVal.length > 4){
                            this.fontVal = '';
                            Toast("最多输入4个全中文或8个全英文~")
                        }else{
                            this.checkoutLoadFont('D_USELANGUAGE_CH');
                        }
                    }else{
                        Toast("最多输入4个全中文或8个全英文~")
                        this.fontVal = '';
                    }
                }
                setTimeout(()=>{
                    window.scroll(0,this.scrollHeight);
                },100)
            },
            // 判断是否重新加载字体
            checkoutLoadFont(language){
                if(language !== this.useLanguage){
                    this.colorIndex = -1;//颜色当前index
                    this.fontIndex = -1;//字体当前index
                    this.useLanguage = language;
                    this.getColorFontList(this.useLanguage);
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
                    sourceCode: "D_ORDWEIN"
                };

                if(isDesign == 'design'){
                    if(!this.checkFormFull()){//表单未填写完整
                        this.isSaveing = false;// 保存订单锁 解锁
                        return false;
                    }
                    this.setEmbInfo(false,this.activeNavId);
                }else{
                    this.goodDetail.detailedList = this.getPartListParams(this.goodDetail.detailedList);
                }
                orderData.skuList = [{
                    // 有传面料id则使用 否则用默认面料id
                    mainFabricId:Storage.get('toReserveParams').mainFabricId || this.goodDetail.mainFabricId,
                    ptiPartDtSkuId:this.goodDetail.ptiPartSkuId,
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

                console.log("打印一波参数",orderData)

                c_emitBill(orderData).then(res=>{
                    this.$router.push({
                        name:'orderSettlement',
                        query:{orderHdId: res},
                        params:this.$route.params
                    });
//                    this.$router.replace("/order-settlement?orderHdId=" + res);
                    this.isSaveing = false;// 保存订单锁
                },err=>{
                    this.isSaveing = false;// 保存订单锁
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
                item = this.allUseablePart[this.partIndex];

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
                                // 绣花颜色id
                                eptObj.colorId = this.eptColors[this.eptColorIndex].colorId


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
                let msg = '';
                if(this.activeNavId == 1){// 绣字
                    switch (true){
                        case this.partIndex<0:
                            msg = '请选择刺绣部位';
                            break;
                        case !this.fontVal:
                            msg = '请输入绣字内容';
                            break;
                        case this.fontIndex<0:
                            msg = '请选择刺绣字体';
                            break;
                        case this.colorIndex<0:
                            msg = '请选择刺绣颜色';
                            break;
                    }
                }else{
                    switch (true){
                        case this.partIndex<0:
                            msg = '请选择刺绣部位';
                            break;
                        case this.picIndex<0:
                            msg = '请选择刺绣图片';
                            break;
                        case this.eptColorIndex<0:
                            msg = '请选择刺绣颜色';
                            break;
                    }
                }
                if(msg){
                    Toast(msg);
                    return false;
                }else{
                    return true;
                }
            },
            // 获取商品可绣花、绣字部位
            getUseablePart(item){
                let partListKey = '';
                if(item.id == 1){//绣字
                    partListKey = 'embPartList';
                }else{
                    partListKey = 'eptPartList';
                }
                this.ms_getUseablePart(item,this.goodDetail.ptiPartHdId).then(res=>{
                    res.forEach(child=>{
                        child.custInfo = {
                            emb: [],// 绣字
                            ept:[]// 绣花
                        };
                        child.custLevel = item.id==1?'emb':'ept';
                    })
                    this[partListKey] = res;
                    // 不存在可选部位 删除对应tab
                    if(!res || res.length <= 0){
                    }else{
                        //绣字存在可选部位  加载颜色字体样式
                        if(item.id == 1) {
                            this.checkoutLoadFont('');
                        }
                    }

                    this.callGetUseablePartNum--;

                    // 做是否有部位判断   但有是否有库存问题
                    if(this.callGetUseablePartNum === 0){
                        if(!this.hasUseablePart){
                            this.dialogTip('该商品暂无个性定制部位，是否生成订单？',this.checkoutCanBuy);
                        }else{

                            // 将绣字、绣花可用部位合并成一个数组
                            if(this.allUseablePart.length){
                                let arr = [];
                                res.forEach(json=>{
                                    for(let i=0;i<this.allUseablePart.length;i++){
                                        if(this.allUseablePart[i].id == json.id){
                                            this.allUseablePart[i].custLevel = 'all';
                                            break;
                                        }
                                        if(this.allUseablePart.length == i+1){// 最后一个
                                            arr.push(json);
                                        }
                                    }
                                })
                                this.allUseablePart = this.allUseablePart.concat(arr);
                            }else{
                                this.allUseablePart = res;
                            }

                            // 部位排序
//                            this.allUseablePart = this.allUseablePart.sort((obj1,obj2)=>{
//                                return obj1.seq - obj2.seq;
//                            })
                            this.partIndex = 0;
                        }
                    }else if(this.callGetUseablePartNum === 1){
                        this.allUseablePart = res;
                    }
                })
            },
            // 获取颜色字体列表
            getColorFontList(language){
                let data = {
                    // 判断输入字体是否是中文
                    useLanguageCode: language || ''
                }
                Goods.getEmbFontColorList(data).then(res=>{
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
            // 活动切换绣花图页数
            onSwiper(index){
                if(this.pageNum == index + 1)return;
                this.showRealPicFlag = false;
                let goodPartIndex = this.getGoodInfoPartIndex(this.activePartItem.regionClassCode);
                this.pageNum = index + 1;
                this.picIndex = -1;
                this.eptColorIndex = -1;
                this.eptColors = [];
                this.getPicList(this.goodDetail.detailedList[goodPartIndex].regionCode);
            },
            // 获取绣花图片列表
            async getPicList(regionCode){
                let data = {
                    pageNum: this.pageNum,
                    pageSize: 12,
                    type:2,
                    goodsCode: this.goodsCode,
                    regionCode: regionCode,
                    definedFlag: 0,//自定义标记 0为不允许用户上传图片，1为允许用户上传图片
                }
                await Goods.getEmbPicList(data).then(res=>{
                    this.picList = res.list;
                    this.picListPages = res.pages;
                    this.$nextTick(()=>{
                        this.$refs.swiperRef.initScroll();
                        this.showRealPicFlag = true;
                    })
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
            /**
             * 切换导航
             * @param item
             * @param index
             * @param refresh 控制相同tab时是否刷新 true往下执行 false不刷新数据
             */
            switchNav(item,index,refresh){
                if(this.tabIndex === index && !refresh)return;
                this.tabIndex = index;
                if(item.id == 2){
                    let goodPartIndex = this.getGoodInfoPartIndex(this.activePartItem.regionClassCode);
                    this.pageNum = 1;
                    this.getPicList(this.goodDetail.detailedList[goodPartIndex].regionCode);
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
            // 根据id找tab
            getTabItem(id){
                for(let i=0;i<this.tabList.length;i++){
                    if(this.tabList[i].id == id){
                        return {item:this.tabList[i], index: i};
                    }
                }
            },
            // 清空已选表单 all:清空所有； emb：清空绣字； ept：清空绣花
            clearSelectedForm(clearType='all'){
                if(clearType === 'all' || clearType === 'emb'){
                    this.colorIndex = -1;//颜色当前index
                    this.fontIndex = -1;//字体当前index
                    this.fontVal = '';//字体内容
                }
                if(clearType === 'all' || clearType === 'ept'){
                    this.picIndex = -1;//图片当前index
                    this.eptColorIndex = -1;//当前index
                    this.eptColors = [];
                }
            },
            // 获取绣字绣花价格
            getCustPrice(){
                let data = {
                    "hasEmb": true,
                    "orderFlag": 1,
                    "hasEmbFonts": true,
                    "hasPrint": true,
                    "ptiPartHdId": this.goodDetail.ptiPartHdId
                }
                Goods.getCustPrice(data).then(res=>{
                    this.custPrice = res;
                })
            },
        },
        async created() {
            // todo
            this.goodsCode = Storage.get('toReserveParams').goodCodes;
//            this.goodsCode = 'HS3003';// dev 绣字有部件
//            this.goodsCode = 'QZJ001';// 测试库 绣花有图
            // 印花:10130301  D_EMBTYPE_PRT     绣字:10130302  D_EMBTYPE_FONT  绣花:10130303  D_EMBTYPE_EMBPIC
            this.tabList = this.ms_tabList;
            this.amount = Storage.get('toReserveParams').amount || 1;

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

            // 获取绣字绣花价格
            this.getCustPrice();

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
            fontVal(val){
                // 内容为空
                if(!val){
                    this.checkoutLoadFont('');
                }
            },
            partIndex(index){
                this.clearSelectedForm('ept');

                // 根据部位控制导航显示
                this.$nextTick(()=>{
                    // 将绣花图片页数置位0
                    if(this.$refs.swiperRef){
                        this.$refs.swiperRef.toIndex(0);
                    }
                    let tabItem = {};
                    switch(this.activePartItem.custLevel){
                        case 'all':
                        case 'emb':
                            tabItem = this.getTabItem(1);
                            this.switchNav(tabItem.item,tabItem.index);
                            break;
                        case 'ept':
                            tabItem = this.getTabItem(2);
                            this.switchNav(tabItem.item,tabItem.index,true);
                            break;

                    }
                })
            },
        }
    }
</script>
<style scoped lang="scss">
    .container{
        box-sizing: border-box;
        height: 100%;
    }
    .dom-cut{
        background: #f5f5f5;
        height: computed(20);
    }
    .bottom-btn-height{
        height: computed(160);
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
        line-height: computed(64);
        background: #f5f5f5;

        &.selected{
            color: #fff;
            background: $maincolor;
        }
    }
    .model-cont{
        padding-left: computed(30);

        /*绣花图样式覆盖*/
        &.model-cont-ept-img{
            display:inline-block;
            width: computed(750);
            padding: 0;
        }
        .title{
            align-items: center;
            display: flex;
            .title-logo{
                width: computed(28);
                height: computed(28);
                margin-right: computed(14);
            }
        }
    }
    .part-list{
        flex-wrap: nowrap;
        display: flex;
        overflow-y: auto;
        // 星座图列表覆盖样式
        &.star-list{
            flex-wrap: wrap;
            .part-item{
                margin-right: computed(30);
                .part-img{
                    &.part-img-star{
                        width: computed(142);
                        height: computed(142);
                    }
                }
                .item-title{
                    width: computed(142);
                }
                &:nth-child(4n){
                    margin-right: 0;
                    padding-right: 0;
                }
            }
        }

        // 星座颜色覆盖样式
        &.color-list{
            .part-item{
                .part-img{
                    &.part-img-color{
                        width: computed(90);
                        height: computed(90);
                    }
                }
                .item-title{
                    width: computed(90);
                    font-size: computed(26);
                }
            }
        }

        .part-item{
            text-align: center;
            margin-right: computed(20);
            position: relative;

            .part-img{
                width: computed(210);
                height: computed(210);
                position: relative;
                border:1px solid #fff;

                // 字体图片
                &.part-font-img{
                    border-color: #B3B3B3;
                }
                .main-img{
                    width: 100%;
                    height: 100%;
                }
                .icon-selected-right{
                    position: absolute;
                    right: 0px;
                    top: 0;
                    width: computed(24);
                    height: computed(24);
                    display: none;
                }
                // 选过
                &.selected-success{
                    border-color: $maincolor;
                    .icon-selected-right{
                        display: inline-block;
                    }
                }
            }
            .item-title{
                line-height: computed(70);
                width: computed(210);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &:last-child{
                padding-right: computed(30);
            }
        }
    }
    .color-list{
        display: flex;
        flex-wrap: nowrap;
        overflow-y: auto;
        align-items: flex-start;

        .color-item{
            margin-right: computed(30);
            position: relative;
            justify-content: center;

            .color-cont{
                width: computed(210);
                height: computed(100);
                border: computed(1) solid transparent;
                .icon-selected-right{
                    position: absolute;
                    right: 0px;
                    top: 0;
                    width: computed(24);
                    height: computed(24);
                    display: none;
                }
                // 选过
                &.selected{
                    border-color: $maincolor;
                    .icon-selected-right{
                        display: inline-block;
                    }
                }
            }
            .color-name{
                line-height: computed(70);
                text-align: center;
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
        bottom: 0;
        left: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        width: 100%;

        .foot-btn-item{
            flex:1;
            line-height: computed(94);
            background: $maincolor;
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
    .cust-tip{
        font-size: computed(24);
        line-height: computed(50);
        position: absolute;
        top: computed(-50);
        left: computed(30);
        background: #fff;
        width:100%;
        .cust-tip-logo{
            padding: 0 computed(10);
            background: #FFE3E3;
            color: $maincolor;
        }
        .cust-tip-cont{
            color: #999;
            margin-left: computed(15);
        }
    }
    .null-list{
        font-size: computed(26);
        text-align: center;
        color: #999;
        padding: computed(30) 0 computed(60) 0;
    }
    .indicator-list{
        justify-content: center;
        padding: computed(20) computed(30);
        .indicator-item{
            width: computed(14);
            height: computed(14);
            border-radius: 50%;
            overflow: hidden;
            background: #ccc;
            margin: 0 computed(10);

            &.selected{
                background: #000;
            }
        }
    }

</style>