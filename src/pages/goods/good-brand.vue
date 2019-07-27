/*
* createTime：2018/11/5
* author：fujie.wen
* description: 品牌列表
*/
<template>
    <div class="container">
        <!--列表-->
        <ul class="list">
            <li class="list-item" v-for="(item,index) in brandList" @click="goPage(item.url)">
                <div class="list-item-img">
                    <img v-lazy="getImg(item.coverFileUrl)" @error="errImg($event)" alt="">
                </div>
                <div class="list-item-title fs36B">{{item.covername}}</div>
                <p class="list-item-describe fs26">{{item.memo}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    import {Cms} from '../../api/service';
    import Storage from '../../util/storage';

    export default {
        components: {},
        data () {
            return {
                brandList: [],//商品列表
            }
        },
        created () {
            this.getPartInfo();
        },
        methods: {
            goPage (url) {
                if (url) {
                    this.$router.push(url);
                }
            },
            /**
             * 模块编码 "brand1hs"：品牌列表
             * 获取模块信息
             */
            getPartInfo () {
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.chooseBuy.name,
                    busContsCode: baseConstant.busContsCode
                }
                Cms.getUsrCmsInfoV2(data).then((res) => {
                    if (res.cmsModulepageHdList.length > 0) {
                        let moduleData = res.cmsModulepageHdList[0].cmsBackpageDtDtoList;  //正确格式
                        moduleData.forEach((item) => {

                            if ((item.cmsBackpageDttList.length !== undefined) && (item.cmsBackpageDttList.length > 0)) {
                                // 合并数组中文字、图片
                                let childItem1 = item.cmsBackpageDttList[0],
                                        childItem2 = item.cmsBackpageDttList[1];
                                if (item.cmsBackpageDtCode.indexOf("brand") == 0) {

                                    if(childItem2){
                                        if (childItem2.fileType == '1') {//图片
                                            childItem1.coverFileUrl = childItem2.coverFileUrl;
                                            if (!childItem1.url) {
                                                childItem1.url = childItem2.url;
                                            }
                                        } else if (childItem2.fileType == '0') {//文字
                                            childItem1.cmsBackpageDttName = childItem2.cmsBackpageDttName;
                                            childItem1.covername = childItem2.covername;
                                            childItem1.memo = childItem2.memo;
                                            if (!childItem1.url) {
                                                childItem1.url = childItem2.url;
                                            }
                                        } else if (childItem2.fileType == '2') {//视频
                                            childItem1.coverFileUrl = childItem2.coverFileUrl;
                                            childItem1.fileUrl = childItem2.fileUrl;
                                        }

                                    }
                                    this.brandList.push(childItem1);
                                }
                            }
                        })
                    }

                })
            }
        },

    }
</script>

<style scoped lang="scss">
    .list-item {
    }
    .list-item-img {
        height: computed(420);

        img {
            width: 100%;
            height: computed(420);
        }
    }
    .list-item-title {
        padding: computed(30) computed(20);
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .list-item-describe {
        padding: 0 computed(20) computed(40) computed(20);
        line-height: computed(36);
        color: #666;
    }
</style>