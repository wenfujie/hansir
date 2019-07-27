
<template>
    <div class="qs-map">
        <!-- 头部（省市区） -->
        <div class="qs-map-header" @click="showAreaList = true">
            <div class="header-address">
                {{addressLabel}}
                <span><i class="iconfont icon-gengduo"></i></span>
            </div>
            <span></span>
        </div>

        <!-- 地图显示区域 -->
        <div class="qs-map-content" id="allmap" ref="allmap"></div>

        <!-- 门店信息 -->
        <div class="qs-map-bottom" :class="[moreFlag ? 'bottom-more' : '']">
            <div class="qs-contant" v-if="infoList.length !== 0">
                <div @click="more" :class="[moreFlag ? 'down' : '']" class="more"></div>
                <div class="info">
                    <ul>
                        <li v-for="(item, index) in infoList" @click="addressSelect(item, index)" :key="index">
                            <div class="info-tel">
                                <div class="select-box" >
                                    <!-- <input class="checkInput" name="address" type="radio"> -->
                                    <i class="van-checkbox__icon iconfont" :class="[infoActive === index ? 'icon-xuanzhong' : 'icon-weixuanzhong']"></i>
                                </div>
                                <span class="shopTitle">{{item.dptName}}</span>
                                <span class="shopTel">
                                    {{!item.dptPhone?(!item.dptMobile?'无门店电话':item.dptMobile):item.dptPhone}}
                                </span>
                            </div>
                            <p class="info-address">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else>
                    <div class="word-row">该区域没有门店</div>
                    <div class="word-row-info">请重新选择地区，或者移动地图试试</div>
            </div>
            <div @click="mapSubmit()" class="submit">确定</div>
        </div>
        <van-popup v-model="showAreaList" position="top">
            <van-area :area-list="areaList" @confirm="areaChange" :value="addressInfo.addressId ? addressInfo.addressId : ''" @cancel="showAreaList = false"/>
        </van-popup>
    </div>
</template>
<script>
import { Base } from '../../api/service';
    import { Popup, Area, Toast } from 'vant'
    // import { citydata } from '../../assets/js/cityData'
    import Storage from '../../util/storage'
    import { MP } from '../../util/map'
    import { Volume, UserService } from '../../api/service'
    export default {
        components: {
            'van-area': Area,
            'van-popup': Popup
        },
        data () {
            return {
                addressDetails:'',
                moreFlag: false,
                showAreaList: false,
                infoActive: '',
                actAddressDetail: '',
                // 门店信息
                infoList: [
                    
                ],
                // 百度地图
                map: '',
                // 省市区数据
                areaList: {},
                // 选中的省市区信息
                addressInfo: {},
                addressLabel: '',
                userInfo: {},
                dptId:null,
                dptCode:null,
                currentCity:null
            }
        },
        created () {
            this.getCityData();
            this.getUser()
            this.getPage()
            Storage.set('map', true)
            Storage.set("s_router", { fromPage: 'map' });
        },
        mounted () {},
        methods: {
            //  获取省市区
            getCityData () {
                Base.getDestnation().then((res) => {
                    let provinceMap = {}
                    let cityMap = {}
                    let countyMap = {}
                    res.list.forEach((item) => {
                        if(item.destTypeId === res.code[0]) {
                            provinceMap[item.code] = item.name
                        }
                        if(item.destTypeId === res.code[1]) {
                            cityMap[item.code] = item.name
                        }
                        if(item.destTypeId === res.code[2]) {
                            countyMap[item.code] = item.name
                        }
                    })
                    this.areaList.province_list = provinceMap
                    this.areaList.city_list = cityMap
                    this.areaList.county_list = countyMap
                })
            },
            /**
             * 展开查看更多的门店
             */
            more () {
                this.moreFlag = !this.moreFlag
            },
            /**
             * 点击门店
             */
            addressSelect (item, index) {
                this.infoActive = index
                this.actAddressDetail = item.dptName
                this.addressDetails =item.address
                this.dptId = item.dptId
                this.dptCode = item.dptCode
                // 点击覆盖物，中心移动到覆盖物
                this._mapToCenter(item.lng, item.lat)
            },
            /**
             * 初始化地图
             * npm run build
             */
            _initMap () {
                // 防止ak暴露
                console.log("有进来哦")
                MP('kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG').then(BMap => {
                    this.map = new BMap.Map('allmap')
                    console.log("地图的map",this.map)
                    let top_left_navigation = new BMap.NavigationControl()  //右下角，添加默认缩放平移控件
                    this.map.centerAndZoom(this.currentCity, 12)                       //初始化地图,设置城市和地图级别
                    this.map.enableScrollWheelZoom(true)                    // 缩放
                    this.map.addControl(top_left_navigation)
                    this.infoList.forEach((item, index) => {
                        let point = new BMap.Point(item.lng, item.lat)
                        let marker = new BMap.Marker(point)             // 创建标注
                        this.map.addOverlay(marker)                     // 将标注添加到地图中
                        marker.addEventListener('click', this._attribute)
                        if(item.dptId == Storage.get('VOLUME_STORE').dptId){
                            this.infoActive = index
                        }
                    })
                })
            },
            /**
             * 地图坐标点击事件
             * @param e 当前坐标的信息
             * @param e.currentTarget.point.ln 经度
             * @param e.currentTarget.point.lat 纬度
             */
            _attribute (e) {
                let x = e.currentTarget.point.lng
                let y = e.currentTarget.point.lat
                this._mapToCenter(x, y)

                // 遍历门店，选中门店
                this.infoList.forEach((item, index) => {
                    if (item.lng === x && item.lat === y) {
                        this.infoActive = index
                        this.actAddressDetail = item.dptName
                        this.addressDetails =item.address
                        this.dptId = item.dptId
                        this.dptCode = item.dptCode
                    }
                })
            },
            /**
             * 点击地图坐标，坐标移动中心
             * @param lng 经度
             * @param lat 纬度
             * @private
             */
            _mapToCenter (lng, lat) {
                this.map.panTo(new BMap.Point(lng, lat))
            },
            /**
             * 省市区选择
             * @param value
             */
            areaChange (value) {
                this.addressInfo.province = value[0].name
                this.addressInfo.city = value[1].name
                this.addressInfo.district = value[2].name
                this.addressInfo.addressId = value[2].code
                this.addressLabel = value[0].name + '' + value[1].name + '' + value[2].name
                let storeData = Storage.get('VOLUME_STORE')
                storeData.address = this.addressLabel
                // storeData.addressId = this.addressInfo.addressId
                storeData.addressDetail = ""
                storeData.addressDetails = ""
                storeData.dptId = ""
                this.actAddressDetail = ""
                this.infoActive = ""
                storeData.addressInfo = this.addressInfo
                Storage.set('VOLUME_STORE',storeData)
                this.showAreaList = false
                this.getShopAddr()
            },
            /*
             * 确定
             */
            mapSubmit () {
                if(!this.actAddressDetail){
                    Toast('请先选择门店~')
                    return
                }
                if(this.$route.query.type == 'choiceDressed'){
                    let storeData = Storage.get('VOLUME_STORE')
                    storeData.addressDetail = this.actAddressDetail
                    storeData.dptId = this.dptId
                    storeData.dptCode = this.dptCode
                    storeData.addressInfo = this.addressInfo
                    storeData.addressDetails = this.addressDetails
                    Storage.set('VOLUME_STORE', storeData)
                    //  this.$router.push('/choiceDressed?from=map')
                    Storage.set("s_router", { fromPage: 'map' });
                    window.history.go(-1)
                    // this.$router.go(1);
                    this.actAddressDetail = ''
                    this.infoActive = ''
                }
                if(this.$route.query.type === 'store'){
                    let storeData = Storage.get('VOLUME_STORE')
                    storeData.addressDetail = this.actAddressDetail
                    storeData.addressInfo = this.addressInfo
                    storeData.addressDetails = this.addressDetails
                    storeData.dptId = this.dptId
                    storeData.dptCode = this.dptCode
                    Storage.set('VOLUME_STORE', storeData)
                    Storage.set("s_router", { fromPage: 'map' });
                    //  this.$router.push('/reserve?from=map')
                    window.history.go(-1)
                    // this.$router.go(1);
                    this.actAddressDetail = ''
                    this.infoActive = ''
                }
            },
            //  获取页面基本信息
            getPage () {
                let type = this.$route.query.type || ''
                if(type === 'store'){
                    let storeData = Storage.get('VOLUME_STORE')
                    this.addressLabel = storeData.address
                    this.addressInfo = storeData.addressInfo
                    this.actAddressDetail = storeData.addressDetail || storeData.addressDetails
                }
                if(type === 'choiceDressed'){
                    let storeData = Storage.get('VOLUME_STORE')
                    this.addressLabel = storeData.address
                    this.addressInfo = storeData.addressInfo
                }
            },
            //  获取到店量体地址列表
            getShopAddr () {
                let data = {
                    ownCompanyId: Storage.get("COMPANYID").company_id,
                    stateName: Storage.get('VOLUME_STORE').addressInfo.province,
                    cityName: Storage.get('VOLUME_STORE').addressInfo.city,
                    destName: Storage.get('VOLUME_STORE').addressInfo.district,
                    cardNo: this.userInfo.cardNo,
                    buscontscode:'D_BUSCONTS_WSC'
                }
                Volume.getShopAddr(data).then((res)=> {
                    this.infoList = []
                    res.forEach((item)=> {
                        item.lng = item.lon
                        this.infoList.push(item)
                    })
                    this.currentCity= Storage.get('VOLUME_STORE').addressInfo.city
                    this._initMap()
                }, (err)=> {})
            },
            //  获取用户信息
            getUser () {
                let data ={}
                UserService.getUserInfo(data).then((res) => {
                    this.userInfo = res
                }).then(()=>{
                    this.getShopAddr()
                })
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to)
                if (to.path == "/reserve") {
                    to.meta.keepAlive = true;
                } else {
                    to.meta.keepAlive = false;
                }
            }
        }
        //  beforeRouteLeave(to, from, next) {
        //     if (to.path == "/reserve") {
        //         to.meta.keepAlive = true;
        //     } else {
        //         to.meta.keepAlive = false;
        //     }
        // next();
        // }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .qs-map{
        $whiteColor: rgba(255,255,255,1);
        $blackColor: #0D0E09;
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow-y: hidden;
        .qs-map-header{
            height: computed(100);
            line-height: computed(100);
            background-color: $whiteColor;
            .header-address{
                padding: 0 computed(33);
                font-size:computed(28);
                font-weight:500;
                color:rgba(13,14,9,1);
                span{
                    float: right;
                    i{
                       font-size: computed(24);
                    }
                }
            }
        }
        .qs-map-content{
            flex: 1;
            overflow-y: hidden;
            background-color: #999999;
        }
        .qs-map-bottom{
            position: relative;
            transition: .6s;
            height: computed(363);
            padding: computed(30);
            box-sizing: border-box;
            background-color: $whiteColor;
            .word-row{
                margin-top: computed(51);
                font-size:computed(30);
                font-weight:bold;
                color:rgba(13,14,9,1);
                text-align: center;
            }
            .word-row-info{
                text-align: center;
                margin-top: computed(29);
                font-size:computed(24);
                font-weight:400;
                color:rgba(102,102,102,1);
            }
            &.bottom-more{
                transition: .6s;
                height: computed(1065) !important;
                .info{
                    height: computed(920) !important;
                    overflow-y: auto;
                }
            }
            .more{
                position: absolute;
                top: computed(10);
                right: computed(339);
                width:computed(72);
                height:computed(10);
                background:rgba(210,210,210,1);
                border-radius:computed(5);
                z-index: 999;  
                cursor: pointer;
            }
            .info{
                margin-top: computed(14);
                height: computed(200);
                overflow-y: hidden;
                ul{
                    li{
                        font-size: computed(24);
                        color: $blackColor;
                        padding: computed(30) 0;
                        border-bottom: 1px solid #E6E6E6;
                        .info-tel{
                            .shopTitle{
                                font-size:computed(28);
                                font-weight:bold;
                                color:rgba(13,14,9,1);
                                margin-left: computed(16);
                            }
                            .shopTel{
                                font-size:computed(28);
                                font-weight:bold;
                                color:rgba(13,14,9,1);
                                margin-left: computed(60);
                            }
                            .select-box{
                                position: relative;
                                display: inline-block;
                                margin: 0 0 -4px 0;
                                i{
                                    font-size: computed(30);
                                }
 
                                .checkInput{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    opacity: 0;
                                    z-index: 2;
                                }
                                // .van-checkbox__icon{
                                //     display: block;
                                //     box-sizing: border-box;
                                //     width: computed(30);
                                //     height: computed(30);
                                //     position: relative;
                                //     border: 1px solid #2BA4F3;
                                //     font-size: computed(30);
                                //     line-height: computed(30);
                                // }
                                .checked::after{
                                    position: absolute;
                                    content: '';
                                    width: computed(16);
                                    height: computed(16);
                                    left: 50%;
                                    top: 50%;
                                    background: #2BA4F3;
                                    overflow: hidden;
                                    transform: translate(-50%,-50%);
                                }
                            }
                            strong{
                                font-weight: bold;
                            }
                            span{
                                margin-left: computed(10);
                            }
                        }
                        .info-address {
                            margin-top: computed(25);
                            box-sizing: border-box;
                            padding-left: computed(53);
                            font-size:computed(24);
                            font-weight:500;
                            color:rgba(102,102,102,1);
                        }
                        &:first-child{
                            padding: 0 0 computed(30) 0;
                        }
                    }
                }
            }
            .submit{
                position: absolute;
                bottom: computed(30);
                height: computed(100);
                width: 92%;
                line-height: computed(100);
                text-align: center;
                background-color: $maincolor;
                color: white;
            }
        }
    }
</style>
