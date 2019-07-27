<template>
  <!-- 图片上传 -->
  <div class="content">
    <div class="group">
      <div class="upload">上传图片
        <span class="limit">支持最多上传5张,每张最大2M</span>
      </div>
    </div>
    <!-- 图片 -->
    <div class="img-group">
      <van-uploader class="img-box border-dash flex-center" :after-read="onRead" :disabled="isDisabled" v-if="isBeyongLimit">
        <div class="flex-center w100 h100">
          <span>+</span>
        </div>
      </van-uploader>
      <div class="img-box box-border" v-for=" (file, index) in imgs" :key='index'>
        <div class="icon-box" @click="delImg(index)">X</div>
        <img :src="file.content" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { Uploader } from "vant";
import Storage from "@/util/storage";
export default {
  name: "upload-file",
  props: {
    good: {
      commentPictList: [],
      images: []
    }
  },
  components: {
    "van-uploader": Uploader
  },
  data() {
    return {
      imgs: [],
      images: [],
      isDisabled: false
    };
  },
  methods: {
    onRead(file) {
      this.isDisabled = true;
      uploadImg(file.file).then((res) => {
        console.log(res);
        let result = res.uploadDetail.successDetail;
        this.images.push({
          fileLength: result.fileSize,
          md5: result.md5,
          pictPath: result.filePath,
          sourceFileName: file.file.name,
          pictClass: "D_COMMENTPICT"
        });
        this.imgs.push(file);
        this.$emit("update:images", this.images);
        if (this.imgs.length >= 5) {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
      });
    },
    // 删除图片
    delImg(index) {
      this.imgs.splice(index, 1);
      this.images.splice(index, 1);
      this.isDisabled = false;
    }
  },
  computed: {
    isBeyongLimit: function() {
      return this.imgs.length == 5 ? false : true;
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  padding: computed(10) 0;
  .upload {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999999;
    font-size: computed(28);
    font-family: "PingFang-SC-Medium";
    padding: computed(30) 0;
  }
  .img-box {
    position: relative;
    width: 20vw;
    height: 20vw;
    margin: 0 2.4vw 4vw 0;
    float: left;
    img {
      width: 100%;
      height: 100%;
    }
    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -2.66667vw;
      right: -2.66667vw;
      width: 5.33333vw;
      height: 5.33333vw;
      color: #fff;
      margin: 0;
      padding: 0;
      font-size: 2.66667vw;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .box-border {
    border: 1px solid #fff;
  }
  .border-dash {
    border: 1px dashed #ccc;
  }
}
</style>