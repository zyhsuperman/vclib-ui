<template>
  <div class="container" style="min-height: 100%;min-width: 60%; padding-bottom: 100px;">
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="30%"
            class="demo-border"
            id="uploadForm"
        >
          <!-- 文本输入框-->
          <el-form-item label="请输入要合成的文本内容" prop="text">
            <el-input   class="textarea" v-model="ruleForm.text"></el-input>
          </el-form-item>
          <!-- 合成目标选择-->
          <el-form-item label="请选择合成目标" prop="target">
            <el-select v-model="ruleForm.target" placeholder="请选择合成目标">
              <el-option label="英文" value="english"></el-option>
              <el-option label="cyw普通话" value="cyw_mandarin"></el-option>
            </el-select>
          </el-form-item>
          <!-- 选择英文克隆时，音频文件选择-->
          <el-form-item v-if="ruleForm.target==='english'" label="音频文件上传">
            <audio-select v-model="ruleForm.audio"></audio-select>
          </el-form-item>
          <!-- 合成类型单选框-->
          <el-form-item label="合成类型" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="使用图片文件合成" name="type"></el-radio>
              <el-radio label="使用视频文件合成" name="type"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 如果合成图片则为图片选择，如果使用视频文件合成则是视频选择-->

          <el-form-item v-if="ruleForm.type === '使用视频文件合成'" label="视频文件上传">
            <video-select v-model="ruleForm.video"></video-select>
          </el-form-item>
          <el-form-item v-else-if="ruleForm.type === '使用图片文件合成'" label="图片文件上传">
            <image-select v-model="ruleForm.video"></image-select>
          </el-form-item>

          <!-- 按钮组-->
          <el-form-item>
            <el-button type="primary" @click="submitForm">上传合成</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 视频结果展示-->
        <video  ref="video" :src="url" style="width: 300px; height: auto;" controls></video>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>

import VideoSelect from "@/components/VideoSelect"
import AudioSelect from "@/components/AudioSelect"
import ImageSelect from "@/components/ImageSelect"
import axios from  'axios'

export default {
  name:'Generate',
  props: [],
  components: {VideoSelect, AudioSelect, ImageSelect},
  data() {
    return {
      //提交的表格的参数
      ruleForm: {
        text: "",
        audio: null,
        video: null,
        target:""
      },
      rules: {
        text: [
          {
            required: true,
            message: "请输入文本内容",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        target: [
          {
            required: true,
            message: "请选择合成目标",
            trigger: "change",
          },
        ],
        audio: [
          {
            required:true,
          }
        ],
        video: [
          {
            required:true,
          }
        ],
        type: [
          {
            required: true,
            message: "请至少选择合成类型",
            trigger: "change",
          },
        ],
      },
      url: ""
    }
  },
  watch: {},
  computed: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  destroyed() {},
  methods: {
    request() {},
    resetForm() {

      console.log(this.ruleForm.type==='使用图片文件合成')

      console.log(this.ruleForm)

      console.log("submit!")
    },
    // 提交时间
    submitForm() {
      let formData = new FormData();
      // 将text，aduio，video，target和tyoe放入传入后端的参数中
      formData.append('text', this.ruleForm.text)
      formData.append('audio', this.ruleForm.audio)
      formData.append('video', this.ruleForm.video)
      formData.append('target', this.ruleForm.target)
      if (this.ruleForm.type === '使用图片文件合成'){
        formData.append('type', 'image')
      }
      else{
        formData.append('type', 'video')
      }
      axios({
        method:"post",
        // 本地运行时需要更改对应的端口
        url:"http://127.0.0.1:1225/synthesis/",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        responseType: "blob",
        withCredentials:true,
        // 设置request的参数
        data:formData
      }).then((res)=>{
        // 将视频流转换为blob数据，并使用creatObjectURL提取对应的url
        let blob = new Blob([res.data], {type:"video/*"});
        var url =  URL.createObjectURL(blob);
        // 设置video的src的url，在前端显示结果
        this.$refs.video.src = (url)
      });
    },
  },
}
</script>

<style scoped>
.el-icon--right{}
.el-icon-upload{}
.line{}
.textarea>>>.el-input__inner{
  font-size: 18px!important;
  color:#000000!important;
  height: auto;
  min-height: 50px;
  font-family: cursive!important;
  border:none    !important;
}
.container {
  text-align: center;
}
#uploadForm >>> .el-form-item__label {
  font-size: 16px;
}
.demo-border {
  border: 1px grey ;
  min-height: 1rem;
  border-radius: 5px;
  width: 50%;
  display: inline-block;
}
</style>
