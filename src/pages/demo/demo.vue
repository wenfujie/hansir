
<template>
    <div>1111111111111</div>
    <!-- <div id="allmap"></div> -->
</template>
<script>
    import { Popup, Area, Toast } from 'vant'
    import { citydata } from '../../assets/js/cityData'
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
                moreFlag: false,
                showAreaList: false,
                infoActive: '',
                actAddressDetail: '',
                // 门店信息
                infoList: [
                    {
                     lng:21,
                    lat:21
                    },
                    {
                     lng:21,
                    lat:21
                    },
                    {
                     lng:21,
                    lat:21
                    }
                    
                ],
                // 百度地图
                map: '',
                // 省市区数据
                areaList: citydata,
                // 选中的省市区信息
                addressInfo: {},
                addressLabel: '',
                userInfo: {}
            }
        },

        created () {
            var a={"id":1,"name":"danlis"};
            delete a.id;
            console.log(a['name'])
            // this.myFunction()
            // var aaa =  this.GetRequest("http://localhost:8080/#/demo?goodCodes=BL003&unique_needCache=1")
            // console.log("22222",aaa)
        },
        mounted () {},
        methods: {
             myFunction(){

                var animal = ["dog", "cat", "elephant", "tiger"];

                var str=animal.join(',');

                console.log("类型是："+typeof(str)+"，字符串是："+str);   

            },
             GetRequest(_url) { 
                var url = _url; //获取url中"?"符后的字串
                var index =url.lastIndexOf("\?");
                url=url.substring(index,url.length);
                console.log("youyouyou",url)
                var theRequest = new Object();  
                if (url.indexOf("?") != -1) {  
                    var str = url.substr(1);  
                    var strs = str.split("&");  
                    for(var i = 0; i < strs.length; i ++) {  
                        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
                    }  
                }  
                return theRequest;  
            } , 
            getCityByIP(rs) { 
                var cityName = rs.name; 
                console.log("$$$$$$$$$$",rs)
                // alert("根据IP定位您所在的城市为:" + cityName); 
            },
            theLocation(cityName){
                if(cityName != ""){
                    map.centerAndZoom(cityName,11);      // 用城市名设置地图中心点
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
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
