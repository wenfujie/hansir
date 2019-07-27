/*
* createTime：2018/11/1
* author：en.chen
* description:
*/
<template>
    <div class="salon-detail">
        <p class="title">{{pageInfo.title}}</p>
        <p class="date">{{pageInfo.crtLog}}</p>
        <div class="salon-content" v-html="pageInfo.content"></div>
    </div>
</template>
<style scoped lang="scss" type="text/scss">
    .salon-detail{
        padding: computed(30);
        overflow: hidden;
        .title{
            font-size: computed(42);
            line-height: computed(44);
            font-weight: bold;
        }
        .date{
            color: #999;
            padding: computed(59) 0;
        }
        img{
            display: block;
            width: 100%;
        }
    }
</style>
<script>
    import { Salon } from '../../api/service'
    export default {
        data () {
            return {
                id: '',
                pageInfo: {}
            }
        },
        methods: {
            getPage () {
                let data = {
                    id: this.id || this.$route.query.id,
                }
                Salon.getDetail(data).then((res) =>{
                    this.pageInfo = res
                    let pageInfo = res.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = getImg(src.substring(index, img.length))
                        return '<img src="' + imgData + '" style="width: 100%; display: block; margin: 0;">'
                    })
                    this.pageInfo.content = pageInfo
                })
            }
        },
        created () {
            this.id = this.$route.query.id
            this.getPage()
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>