// FileSelect.vue

<template>
  <label class="video-select">
    <div class="select-button">
      <el-icon-video-camera style="margin-top: 1em;width: 50px;"></el-icon-video-camera><br>
      <span v-if="modelValue">Selected File: {{modelValue.name}}</span>
      <span v-else>Select File</span>
    </div>
    <input type="file" accept="video/*, avi" @change="handleFileChange"/>
  </label>
</template>

<script>
export default {
  props: {
    // 这里接受一个 value 因为 v-model 会给组件传递一个 value 属性
    modelValue: File
  },

  methods: {
    handleFileChange(e) {
      // 同样触发一个 input 来配合 v-model 的使用
      this.$emit('update:modelValue', e.target.files[0])
    }
  }
}
</script>

<style scoped>
.video-select > .select-button {
  padding: 5px;

  color: #808695;
  background-color: #fafafa;

  border: 2px solid #E5E5E5;
  border-radius: .3rem;
  width: 25vw;

  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  
  transition: background-color .2s linear;
}
.video-select > .select-button:hover {
  background-color: #f0f0f0;
}

/* Don't forget to hide the original file input! */
.video-select > input[type="file"] {
  display: none;
}
</style>
