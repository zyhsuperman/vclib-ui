<template>
  <label class="image-select">
    <div class="select-button">
      <span v-if="modelValue">Selected File: {{modelValue.name}}</span>
      <span v-else>Select File</span>
    </div>
    <input type="file" accept="image/*" @change="handleFileChange"/>
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
.image-select > .select-button {
  padding: 1rem;

  color: white;
  background-color: #2EA169;

  border-radius: .3rem;

  text-align: center;
  font-weight: bold;
}

/* Don't forget to hide the original file input! */
.image-select > input[type="file"] {
  display: none;
}
</style>
