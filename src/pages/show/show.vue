/*
* createTime：2018/11/1
* author：fujie.wen
* description: 首页
*/
<template>
    <div class="show-container _footer-bar-padding">

        <!--banner-->
        <div class="show-head">
            <!--<div class="show-link">-->
            <!--进入3D搭配-->
            <!--<i class="iconfont icon-gengduo show-icon-more"></i>-->
            <!--</div>-->
            <van-swipe :autoplay="5000" @change="onChange" v-if="banners.length > 0">
                <van-swipe-item v-for="(item,index) in banners" :key="index">
                    <div class="show-item" @click="goPage(item.url)">
                        <img v-lazy="getImg(item.coverFileUrl)"  @error="errImg($event)" alt="">
                    </div>
                </van-swipe-item>

                <!--自定义指示器 li的for循环需修改-->
                <div class="custom-indicator" slot="indicator" v-if="banners.length > 1">
                    <ul class="custom-list">
                        <li :class="['custom-item',{'selected':currentIndex===index}]"
                            v-for="(item,index) in banners" ></li>
                    </ul>
                </div>
            </van-swipe>
        </div>

        <!--导航链接跳转-->
        <ul class="show-tab">
            <li class="show-nav" v-for="(item,index) in linkList" :key="index" @click="goPage(item.url,item)">
                <!--<div class="show-nav-logo" :style="{backgroundImage: 'url(' + require(`../../assets/images/show/${item.img}`) +')'}"></div>-->
                <div class="show-nav-logo" :style="{backgroundImage: 'url(' + getImg(item.coverFileUrl) +')'}"></div>
                <div class="show-nav-describe">{{item.covername}}</div>
            </li>
        </ul>
        <div class="introduce" v-for="(item,index) in introduce" :key="index" v-if="introduce.length>0">
            <img v-lazy="getImg(item.coverFileUrl)" @error="errImg($event)" @click="goPage(item.url)">
        </div>
        <!--视频播放-->
        <div class="show-video" v-if="videoInfo.fileUrl">
            <div class="show-video-title">{{videoInfo.covername}}</div>
            <div class="show-video-cont">
                <!--<img :src="getImg(videoInfo.coverFileUrl)" alt="" v-if="!videoInfo.isVideo" @click="playVideo">-->
                <!--<video :src="getVideo(videoInfo.fileUrl)" v-else></video>-->

                <video :poster="getImg(videoInfo.coverFileUrl)"
                       controls
                       preload="none"
                       :src="getVideo(videoInfo.fileUrl)">
                </video>
            </div>
        </div>

        <!--会员福利-->

        <div class="vip-better" v-if="firstItem.length > 0 || secItem.length > 0 || thirdItem.length > 0" >
            <div class="vip-row">
                <img src="../../assets/images/show/vip-img.png" alt="">
            </div>
            <div class="first-card">
                <template  v-for="(child, index) in firstItem">
                    <img v-if="child.fileType==1" v-lazy="getImg(child.coverFileUrl)" @click="goPage(child.url,child)"/>
                    <div v-if="child.fileType==0" class="touchTip" @click="goPage(child.url,child)">{{child.cmsBackpageDttName}}</div>

                </template>
            </div>
            <div>
                <div class="secItem" >
                    <template class="secItem" v-for="(child, index) in secItem">
                        <img v-if="child.fileType==1" :src="getImg(child.coverFileUrl)" @click="goPage(child.url,child)"/>
                        <div v-if="child.fileType==0" class="touchTip" @click="goPage(child.url,child)">{{child.cmsBackpageDttName}}</div>
                    </template>
                </div>
                <div class="thirdItem">
                <template class="thirdItem" v-for="(child, index) in thirdItem">
                    <img v-if="child.fileType==1" :src="getImg(child.coverFileUrl)" @click="goPage(child.url,child)"/>
                    <div v-if="child.fileType==0" class="touchTip" @click="goPage(child.url,child)">{{child.cmsBackpageDttName}}</div>
                </template>
                </div>
            </div>
        </div>

        <!--精品搭配列表-->
        <div class="show-match">
            <div class="show-match-head">
                <div class="show-match-left">职场福利</div>
                <div class="show-match-right"  @click="goPage('/goods')">
                    查看更多
                    <i class="iconfont icon-gengduo fs26"></i>
                </div>
            </div>
            <ul class="show-match-list">
                <li class="show-match-item" v-for="(item,index) in matchList" @click="goPage(item.url)">
                    <img v-lazy="getImg(item.coverFileUrl)"  @error="errImg($event)" alt="">
                    <div class="show-img-describe">
                        <div class="show-img-describe1">{{item.covername}}</div>
                        <div class="show-img-describe2">{{item.memo}}</div>
                    </div>
                </li>
            </ul>
        </div>

        <!--footer-->
        <div class="show-foot">
            <list-foot/>
        </div>

        <!--底部导航-->
        <footer-bar></footer-bar>
        <!--新用户弹窗-->
        <van-data-Dialog v-if="showNewUserDialog"
                         v-show="!showNewYearDialog"
                         custText="已获得新用户礼包"
                         @handleClickBtn="handleClickBtn"
                         router-url=""></van-data-Dialog>
        <new-year-dialog v-if="showNewYearDialog"
                        @hideDialog="hideDialog">
                        </new-year-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import { Swipe, SwipeItem, Toast } from 'vant';
    import { Cms } from '../../api/service';
    import Storage from '../../util/storage';
    import ListFoot from '@/components/ListFoot.vue';
    import FooterBar from '@/components/FooterBar.vue';
    import shopPointDialog from '@/components/shopPointDialog.vue';
    import newYearDialog from '@/components/newYearDialog.vue';

    export default {
        components:{'van-swipe':Swipe, 'van-swipe-item':SwipeItem, ListFoot, FooterBar, "van-data-Dialog": shopPointDialog, 'new-year-dialog': newYearDialog},
        data() {
            return {
                firstItem:[],
                secItem:[],
                thirdItem:[],
                currentIndex:0,//当前指示器位置下标-
                banners:[],//banner列表
                linkList:[],//链接列表
                videoInfo:{},//视频信息
                matchList:[],//精选列表
                showNewUserDialog:false,//显示新用户弹窗
                introduce: [],   // 跳转引流页的图片
                showNewYearDialog: false // 显示春节放假公告
            }
        },
        created(){
            if(Storage.get('USER_INFO')){
                this.showNewUserDialog = false;
            }else{
                this.showNewUserDialog = true;
            }
        },
        methods: {
            // 新人弹窗点击前往事件
            handleClickBtn(){
                checkoutAuthorized('',this)
                this.showNewUserDialog = false;
            },
            // 春节放假公告
            hideDialog(){
                this.showNewYearDialog = false
            },
            // 页面跳转
            goPage(routerSrc,item){
                if(!routerSrc){
                    Toast('敬请期待~');
                    return
                }

                if(routerSrc){
                    // 跟实施确认路径配置为page/introduce/introduce则跳转引流页
                    if(routerSrc.indexOf('page/introduce/introduce') != -1){
                        getAuthorize("","/page/introduce/introduce");
                        return
                    }
                    this.$router.push(routerSrc);
                }
            },

            // 播放视频
            playVideo(){
                this.videoInfo.isVideo = true;
            },

            // 指示器切换
            onChange(index) {
                this.currentIndex = index;
            },

            /**
             * 模块编码 bannerhs：swipe图片切换 jg01hs：链接切换 videohs：视频 ad3hs：商品列表
             *
             * 获取模块信息
             */
            getPartInfo(){
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.index.name,
                    busContsCode: baseConstant.busContsCode
                }
                Cms.getUsrCmsInfoV2(data).then((res)=> {

                    let moduleData = res.cmsModulepageHdList[0].cmsBackpageDtDtoList;  //正确格式
                    moduleData.forEach((item)=> {
                        if(!!item.cmsBackpageDttList && (item.cmsBackpageDttList.length > 0)) {
                            // 合并数组中文字、图片
                            let childItem1 = item.cmsBackpageDttList[0],
                                childItem2 = item.cmsBackpageDttList[1];
                            if(item.cmsBackpageDtCode !== pageCode.index.children.bannerhs){
                                if(childItem2){
                                    if(childItem2.fileType == '1'){//图片
                                        childItem1.coverFileUrl = childItem2.coverFileUrl;
                                        if(!childItem1.url){
                                            childItem1.url = childItem2.url;
                                        }
                                    }else if(childItem2.fileType == '0'){//文字
                                        childItem1.cmsBackpageDttName = childItem2.cmsBackpageDttName;
                                        childItem1.covername = childItem2.covername;
                                        childItem1.memo = childItem2.memo;
                                        if(!childItem1.url){
                                            childItem1.url = childItem2.url;
                                        }
                                    }else if(childItem2.fileType == '2'){//视频
                                        childItem1.coverFileUrl = childItem2.coverFileUrl;
                                        childItem1.fileUrl = childItem2.fileUrl;
                                    }
                                }
                            }
                            switch (item.cmsBackpageDtCode){
                                case pageCode.index.children.bannerhs:
                                    this.banners = item.cmsBackpageDttList;
//                  console.log(this.banners,"banner数据")
                                    break;
                                case pageCode.index.children.hyfl:
                                    this.firstItem = item.cmsBackpageDttList;
                                    break;
                                //   this.banners = item.cmsBackpageDttList;
                                case "shouyeviphuiyuan":
                                    this.secItem = item.cmsBackpageDttList
                                    break;
                                case "lingjuanzhongxin1":
                                    this.thirdItem =item.cmsBackpageDttList
//                  console.log(this.banners,"banner数据")
                                    break;
                                case "YL01":
                                    this.introduce =item.cmsBackpageDttList
                                    break;
                                // sjd---------->

                                case pageCode.index.children.jg01hs:
                                case pageCode.index.children.jg02hs:
                                case pageCode.index.children.jg03hs:
                                case pageCode.index.children.jg04hs:
                                    childItem1.parentCode = item.cmsBackpageDtCode;
                                    this.linkList.push(childItem1);
                                    break;

                                case pageCode.index.children.videohs:
                                    childItem1.isVideo = false;//设置显示图片/视频
                                    this.videoInfo = childItem1;
//                  console.log(this.videoInfo,"video列表数据");
                                    break;
                            }

                            if(item.cmsBackpageDtCode.indexOf("ad") == 0){
                                this.matchList.push(childItem1);
                            }
                        }
                    })
                    console.log(this.linkList,"金刚区数据")
                })
            }
        },
        mounted() {
            this.getPartInfo()
        }
    }
</script>

<style scoped lang="scss">
    .secItem{
        padding: 0 computed(30);
    }
    .secItem,.thirdItem{
        margin-top: computed(28);
        box-sizing: border-box;
        position: relative;
        display: inline-block;
    img{
        width: computed(330);
        height:computed(490);
    }
    .touchTip{
        position: absolute;
        left:computed(120);
        bottom:computed(50);
        width: computed(179);
        height: computed(47);
        text-align: center;
        line-height: computed(47);
        color:white;
        background-color: black;
    }
    }
    .first-card{
        padding: 0 computed(30);
        margin-top: computed(28);
        box-sizing: border-box;
        position: relative;
    img{
        width: computed(690);
        height:computed(330);
    }
    .touchTip{
        position: absolute;
        left:computed(120);
        bottom:computed(50);
        width: computed(179);
        height: computed(47);
        text-align: center;
        line-height: computed(47);
        color:white;
        background-color: black;
    }
    }
    .vip-better{
        width: 100%;
        background-color: #C41717;
        margin-top: computed(30);
        padding-bottom: computed(56);
        display: inline-block;
    .vip-row{
        text-align: center;
        margin-top: computed(27);
    img{
        width: computed(286);
        height:computed(49);

    }
    }
    }
    .show-icon-more{
        font-size: computed(26);
    }
    .show-head{
        position: relative;
    }
    .show-item{

    img{
        width: 100%;
        height: computed(750);
    }
    }
    .show-link{
        line-height: computed(64);
        padding: 0 computed(30);
        background: #C41717;
        opacity: 0.6;
        text-align: center;
        color: #fff;
        position: absolute;
        left: 50%;
        margin-left: computed(-114);
        bottom: computed(62);
        font-size: computed(28);
        z-index: 10;
    }
    .show-tab{
        display: flex;
        justify-content: space-around;
        padding: computed(50) 0 computed(60) 0;
    }
    .show-nav{


    .show-nav-logo{
        margin: 0 auto;
        width: computed(84);
        height: computed(84);
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .show-nav-describe{
        text-align: center;
        font-size: computed(24);
        color: $blackcolor;
        padding-top: computed(10);
    }
    }

    .show-video{
    .show-video-title{
        text-align: center;
        padding-bottom: computed(30);
        font-size: computed(36);
        line-height: 1;
    }

    .show-video-cont{
        height: computed(420);
        border: computed(1) solid #dcdcdc;
    video,
    img{
        width: 100%;
        height: 100%;
    }
    }
    }

    .show-match{
        line-height: computed(36);
    }
    .show-match-head{
        display: flex;
        justify-content: space-between;
        padding: computed(80) computed(30) computed(40) computed(30);

    .show-match-left{
        font-size: computed(36);
    }
    .show-match-right{
        font-size: computed(26);
        color: #C41717;
    }
    }
    .show-match-list{

    .show-match-item{
        // margin-bottom: computed(20);
        position: relative;

    &:last-child{
         margin-bottom: 0;
     }

    img{
        width: computed(750);
        height: computed(562);
        display: block;
    }
    }
    }
    .show-img-describe{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        bottom: computed(19);
        width: 100%;

    .show-img-describe1{
        padding-bottom: computed(17);
        font-size: computed(26);
        color: #fff;
    }
    .show-img-describe2{
        font-size: computed(32);
        color: #fff;
    }
    }

    .show-foot{
        /*background: #f5f5f5;*/
    }
    .custom-indicator{
        position: absolute;
        bottom: computed(18);
        width: 100%;
    }
    .custom-list{
        justify-content: center;
        display: flex;
        width: 100%;
    }
    .custom-item{
        width: computed(14);
        height:computed(14);
        background: #A5BBD4;
        border-radius: 50%;
        margin: 0 computed(10);


    &.selected{
         background: #fff;
     }
    }
    .introduce{
        img{
            width: 100%;
        }
    }
</style>