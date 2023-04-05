<template>
  <div class="container" style="min-height: 100%;min-width: 60%; padding-bottom: 100px;">
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-dialog
            title="提示"
            v-model="mediaDialogVisible"
            width="30%"
            :before-close="handleClose"
        >
          <video  ref="video" :src="url" v-show="url!='' && diarizationForm.type === '视频'" style="width: 300px; height: auto;" controls id="videos"></video>
          <audio ref="audio" :src="url" v-show="url!='' && diarizationForm.type === '音频'" style="width: 300px; height: 100px;" controls id="audios"></audio>
        </el-dialog>


        <div>
          <transition name="fade">
            <loading v-if="is_loading"></loading>
          </transition>
        </div>
<!--        <video  ref="video" :src="url" v-show="url!='' && diarizationForm.type === '视频'" style="width: 300px; height: auto;" controls></video>-->
        <el-form
            :model="diarizationForm"
            ref="diarizationForm"
            label-width="30%"
            class="demo-border"
            id="uploadForm"
        >
          <!-- 分割类型单选框-->
          <el-form-item label="分割类型" prop="type">
            <el-radio-group v-model="diarizationForm.type">
              <el-radio label="音频" name="type"></el-radio>
              <el-radio label="视频" name="type"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 如果合成图片则为图片选择，如果使用视频文件合成则是视频选择-->

          <el-form-item v-if="diarizationForm.type === '音频'" label="音频文件上传">
            <audio-select v-model="diarizationForm.audio"></audio-select>
          </el-form-item>
          <el-form-item v-else-if="diarizationForm.type === '视频'" label="视频文件上传">
            <video-select v-model="diarizationForm.video"></video-select>
          </el-form-item>

          <!-- 按钮组-->
          <el-form-item>
            <el-button type="primary" @click="submitForm">上传分割</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
<!--        <div v-if="speakers.length>=0">-->

<!--        </div>-->


        <div v-if="speakers.length > 0">
          <el-table :data="speakers" style="width: 100%" >
            <el-table-column
                :prop="propItem.prop"
                :label="propItem.label"
                v-for="propItem in propList"
                :key="propItem.prop"
            >
              <template v-slot="{ row }" #default="scope">
                <span v-if="propItem.type === 'text'"> {{ row[propItem.prop] }}</span>
                <component
                    v-else-if="propItem.type === 'watch'"
                    v-bind:is="propItem.component"
                    :rowinfo="row"
                    @click="getMedia(row)"
                >查看</component>
                <component
                    v-else-if="propItem.type === 'mark'"
                    v-bind:is="propItem.component"
                    :rowinfo="row"
                    @click="resetForm"
                > 标注</component>
              </template>

            </el-table-column>
          </el-table>
        </div>




        <!-- 视频结果展示-->
        <!-- 后端没处理完，隐藏视频 -->
<!--        <video  ref="video" :src="url" v-show="url!=''" style="width: 300px; height: auto;" controls></video>-->
        <!--        <video  ref="video" :src="url" style="width: 300px; height: auto;" controls></video>-->
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>
<script>
import VideoSelect from "../components/VideoSelect.vue";
import AudioSelect from "../components/AudioSelect.vue";
import Loading from "../components/Loading.vue";
import {ElMessage} from "element-plus";
import axios from  'axios';
import 'element-plus/theme-chalk/index.css';
import { toRaw } from 'vue';

export default {
  name: "Diarization",
  props: [],
  components: {VideoSelect, AudioSelect, Loading},
  data(){
    return{
      mediaDialogVisible: false,
      diarizationForm:{
        type: "",
        audio: null,
        video: null
      },
      speakers: [],

      is_loading: false,

      propItem: "",
      propList: [
        {
          label: "说话人",
          prop: "speakerID",
          type: "text"
        },
        {
          label: "视频/音频片段名称",
          prop: "mediaName",
          type: "text"
        },
        {
          label: "视频/音频片段时长",
          prop: "duration",
          type: "text"
        },
        {
          label: "查看视频/音频",
          prop: "lc-component",
          component: "el-button",
          type: "watch"
        },
        {
          label:"标注视频/音频",
          prop:"lc-component",
          component: "el-button",
          type: "mark"
        }
      ],
      show: false,
      row: "",
      url: "",
      screenSize: {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      },
    }
  },
  watch: {
    screenWidth(val) {
      // 避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        this.screenSize.width = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.timer = false;
        }, 400);
      }
    },
  },
  computed: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    window.addEventListener('resize', this.onresize);
    const that = this;
    window.onresize = () => {
      return (() => {
        (window.screenWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth),
          (that.screenSize.width = window.screenWidth);
        this.setNew();
      })();
    }
  },
  beforeUpdate() {},
  updated() {},
  destroyed() {},
  methods:{
    request(){},
    resetForm() {
      this.show = true

      console.log(1111)
    },
    getMedia(row){
      this.mediaDialogVisible = true
      this.is_loading = true;
      let name = (toRaw(row)).mediaName
      let formData = new FormData();
      formData.append('mediaName', name)
      if(this.diarizationForm.type === '音频'){
        formData.append('type','audio')
      }
      else{
        formData.append('type', 'video')
      }
      axios({
        method: "post",
        url: "http://127.0.0.1:1225/diarization/getMedia",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        responseType: "blob",
        withCredentials: true,
        data:formData
      }).then((res)=>{
        this.is_loading = false;
        const code = res.status;
        if (code === 200){



          if(this.diarizationForm.type === '音频'){
            let blob = new Blob([res.data], {type:"audio/*"});
            this.url = URL.createObjectURL(blob);
            let dom = document.getElementById('audios')
            dom.src = this.url
          }
          else{
            let blob = new Blob([res.data], {type:"video/*"});
            this.url = URL.createObjectURL(blob);
            let dom = document.getElementById('videos')
            dom.src = this.url
          }

          ElMessage({
            showClose: true,
            message: "运行成功",
            type: 'success',
            duration: 3000
          })
        }
        else{
          //当后端返回code非200时，根据后端返回显示报错信息
          const  READER = new FileReader();
          READER.addEventListener("loadend", function(e) {
            // console.log(e.target.result)// 此处输出结果
            ElMessage({
              showClose: true,
              message: e.target.result,
              type: 'error',
              duration: 5000
            })
            // ElMessage.error('错了哦，这是一条错误消息')
          });
          READER.readAsText(res.data);
        }
      })
    },
    handleClose(done) {
      done()
      this.url=''
    },
    // 提交表单
    submitForm(){
      //提交时出现加载动画
      this.is_loading = true;
      let formData = new FormData();

      formData.append('audio', this.diarizationForm.audio)
      formData.append('video', this.diarizationForm.video)
      if(this.diarizationForm.type === '音频'){
        formData.append('type','audio')
      }
      else{
        formData.append('type', 'video')
      }
      axios({
        method: "post",
        url: "http://127.0.0.1:1225/diarization/",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
        data:formData
      }).then((res)=>{
        this.is_loading = false;
        const code = res.status;
        if (code === 200){

          this.speakers = res.data

          ElMessage({
            showClose: true,
            message: "运行成功",
            type: 'success',
            duration: 3000
          })
        }
      })
    },
    //防抖
    debounce(fn, t) {
      const delay = t || 500;
      let timer;
      return function () {
        const args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        const context = this;
        timer = setTimeout(() => {
          timer = null;
          fn.apply(context, args);
        }, delay);
      };
    },
    //设置字体大小
    setFontSize() {
      const that = this;
      var obj = document.getElementsByTagName("label");
      obj = Array.from(obj);
      obj.forEach(function(element) {
        //console.log("resize font"+element.style.fontSize);
        element.style.fontSize = (that.screenSize.width / 2048) * 22 + "px";
      });
    },
    setNew() {
      this.setFontSize();
      this.debounce(() => this.setFontSize(), 100);
    }
  },
  //页面销毁前移除resize
  beforeDestroy() {
    window.removeEventListener('resize', this.onresize);
  },
}
</script>

<style scoped>
.container {
  text-align: center;
  background: url("../assets/img/background.png");
  background-size: cover;
}
#uploadForm >>> .el-form-item__label {
  font-size: 18px;
  line-height: 2rem;
  vertical-align: middle;
  color: #3a4253;
}
#uploadForm >>> .el-form-item {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.demo-border {
  border: 1px grey ;
  min-height: 1rem;
  border-radius: 15px;
  width: 80%;
  display: inline-block;
  padding: 2% auto;
  background: rgba(243,243,243,0.5);
}

</style>