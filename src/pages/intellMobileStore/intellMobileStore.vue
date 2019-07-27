
<template>
    <div class="qs-map">
        <!-- 头部（省市区） -->
        <!-- <div class="qs-map-header" @click="showAreaList = true">
            <div class="header-address">
                {{addressLabel}}
                <span><i class="iconfont icon-gengduo"></i></span>
            </div>
            <span></span>
        </div> -->

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

                                <!-- <div class="select-box">
                                    <i class="van-checkbox__icon iconfont" :class="[infoActive === index ? 'icon-xuanzhong' : 'icon-weixuanzhong']"></i>
                                </div> -->
                                <div class="shopTitle">
                                    {{item.dptName}}
                                    <div class="dianhua"><a :href="'tel:'+ item.mobile"><i class="iconfont icon-dianhua"></i> </a> </div> 
                                    <div class="dingwei" @click="countPosition(item, index)"> <i class="iconfont icon-dizhidingwei"></i> </div> 
                                    
                                </div>
                                <div class="shopTel">{{item.personMobile}}</div>
                            </div>
                            <p class="info-address">福建省厦门市思明区 厦门市思明区中山路思明南路189号中华城广场2层{{item.address}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else>
                    <div class="word-row">该区域没有门店</div>
                    <div class="word-row-info">请重新选择地区，或者移动地图试试</div>
            </div>
            <!-- <div @click="mapSubmit()" class="submit">确定</div> -->
        </div>

        <!-- <van-popup v-model="showAreaList" position="top">
            <van-area :area-list="areaList" @confirm="areaChange" :value="addressInfo.addressId ? addressInfo.addressId : ''" @cancel="showAreaList = false"/>
        </van-popup> -->
    </div>
</template>
<script>
    import { Popup, Area, Toast } from 'vant'
    import { citydata } from '../../assets/js/cityData'
    import Storage from '../../util/storage'
    import { MP } from '../../util/map'
    import { Volume, UserService,Base } from '../../api/service'
    export default {
        components: {
            'van-area': Area,
            'van-popup': Popup
        },
        data () {
            return {
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
                areaList: citydata,
                // 选中的省市区信息
                addressInfo: {},
                addressLabel: '',
                userInfo: {},
                myPoint:{
                    lng:'',
                    lat:''
                
                }
            }
        },
        created () {
            this.getUser()
            this.getPage()
            // this.getShopList()
//            this.getShopAddr()
           
        },
        mounted () {},
        methods: {
            countPosition (item, index) {
                console.log(this.myPoint);
                console.log(item);
                var p1 = new BMap.Point(this.myPoint.lng, this.myPoint.lat);
                var p2 = new BMap.Point(item.lng,item.lat);

                this.map.centerAndZoom(p1,15);

                var driving = new BMap.DrivingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}});
                driving.search(p1, p2);
            },
            getLocalPosition () {
            // var map = new BMap.Map("allmap");
            // var point = new BMap.Point(116.331398,39.897445);
            // map.centerAndZoom(point,12);
            let self = this
            console.log("3333333",this);
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    // var myIcon = new BMap.Icon("../../assets/images/member/dingwei.png", new BMap.Size(300,157));
                    var mk = new BMap.Marker(r.point);
                    self.map.addOverlay(mk);
                    self.map.panTo(r.point);
                    self.myPoint.lng =r.point.lng
                    self.myPoint.lat =r.point.lat
                    self.map.centerAndZoom(r.point,15);
                    self.map.panTo(new BMap.Point(r.point.lng, r.point.lat))
                    var opts = {
                    position : r.point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(30, -30)    //设置文本偏移量
                    }
                    var label = new BMap.Label("您的位置在这里", opts);  // 创建文本标注对象
                        label.setStyle({
                            color : "blue",
                            fontSize : "12px",
                            height : "20px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑"
                        });
                    self.map.addOverlay(label);  
                    alert('您的位置：'+r.point.lng+','+r.point.lat);
                    
                }
                else {
                    alert('failed'+this.getStatus());
                }        
            },{enableHighAccuracy: true})
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
                console.log(item)
                this.infoActive = index
                this.actAddressDetail = item.dptName
                // 点击覆盖物，中心移动到覆盖物
                this._mapToCenter(item.lng, item.lat)
            },
            /**
             * 初始化地图
             * npm run build
             */
            _initMap () {
                // 防止ak暴露
                let seft = this
                MP('kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG').then(BMap => {
                    this.map = new BMap.Map('allmap')
                    let top_left_navigation = new BMap.NavigationControl()  //右下角，添加默认缩放平移控件
                    // this.map.centerAndZoom('厦门', 15)                       //初始化地图,设置城市和地图级别
                    this.map.enableScrollWheelZoom(true)                  // 缩放
                    this.map.addControl(top_left_navigation)
                    this.infoList.forEach((item, index) => {
                        let point = new BMap.Point(item.lng, item.lat)
                        let marker = new BMap.Marker(point)             // 创建标注
                        this.map.addOverlay(marker)                     // 将标注添加到地图中
                        marker.addEventListener('click', this._attribute)
                    })
                    console.log("4444444444",this.map);
                    this.getLocalPosition()
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
                console.log(this.infoList)

                // 遍历门店，选中门店
                this.infoList.forEach((item, index) => {
                    if (item.lng === x && item.lat === y) {
                        this.infoActive = index
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
                this.addressInfo.district = value[1].name
                this.addressInfo.city = value[2].name
                this.addressInfo.addressId = value[2].code
                this.addressLabel = value[0].name + '' + value[1].name + '' + value[2].name
                let storeData = Storage.get('VOLUME_STORE')
                storeData.address = this.addressLabel
                storeData.addressId = this.addressInfo.addressId
                storeData.addressInfo = this.addressInfo
                Storage.set('VOLUME_STORE',storeData)
                this.showAreaList = false
                this.getShopList()
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
                    

                }
                if(this.$route.query.type === 'store'){
                    let storeData = Storage.get('VOLUME_STORE')
                    console.log(storeData.addressDetail)
                    storeData.addressDetail = this.actAddressDetail
                    storeData.addressInfo = this.addressInfo
                    Storage.set('VOLUME_STORE', storeData)
                     this.$router.replace('/reserve?from=map')
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
                }
            },
            getShopList () {
                let data = {code:350203,pageNo: 1 , pageSize: 10}
                 var _that = this
                 Base.getShopList(data).then(
                    (res) => {
                        console.log("1111111111",res);
                        var addData = [
                            {
                               dptName: "1111",
                               lat:"24.474884",
                               lng:"118.172036"
                            },
                            {
                                dptName: "2222",
                               lat:"24.477121",
                               lng:"118.183642" 
                            },
                            {
                                dptName: "3333",
                               lat:"118.187631",
                               lng:"24.475739"
                            }
                         ]
                        res.list.push(addData[0])
                        res.list.push(addData[1])
                        res.list.push(addData[2])
                        _that.infoList= res.list
                        console.log(_that.infoList)
                    },
                    () => {
                    }
                );
                this._initMap()
                console.log("5555555",this);
            },

            //  获取到店量体地址列表
            getShopAddr () {
                let data = {
                    stateName: Storage.get('VOLUME_STORE').addressInfo.province,
                    cityName: Storage.get('VOLUME_STORE').addressInfo.district,
                    destName: Storage.get('VOLUME_STORE').addressInfo.city,
                    cardNo: this.userInfo.cardNo
                }
                Volume.getShopAddr(data).then((res)=> {
                    this.infoList = []
                    res.forEach((item)=> {
                        item.lng = item.lon
                        this.infoList.push(item)
                    })
                    console.log(this.infoList)
                    this._initMap()
                }, (err)=> {})
            },

            //  获取用户信息
            getUser () {
                this.userInfo = Storage.get('USER_INFO')
                this.getShopList()
            }
        }
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
                // height: computed(200);
                overflow-y: hidden;
                ul{
                    li{
                        font-size: computed(24);
                        color: $blackColor;
                        padding: computed(30) 0;
                        border-bottom: 1px solid #E6E6E6;
                        .info-tel{
                            .shopTitle{
                                font-size:computed(32);
                                font-weight:bold;
                                color:rgba(13,14,9,1);
                                overflow: hidden;
                                .dingwei{
                                    display: inline-block;
                                    float:right;
                                    margin-right: computed(67);
                                    i{
                                        font-size: computed(40);
                                        color: #666666;
                                    }

                                }
                                .dianhua{
                                    display: inline-block;
                                    float:right;
                                    i{
                                        font-size: computed(39);
                                        color: #666666;
                                    }

                                }
                            }
                            .shopTel{
                                font-size:computed(26);
                                font-weight:500;
                                color:rgba(13,14,9,1);
                                margin-top: computed(22);
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
                        }
                        .info-address {
                            margin-top: computed(25);
                            box-sizing: border-box;
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
