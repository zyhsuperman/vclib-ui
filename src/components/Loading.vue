<template>
    <div class="loading"></div>
</template>
 
<script>
export default {
  name: 'Loading' // 定义的组件名称 使用时写法：loading
}
</script>
 
<style scoped>
.loading {
  position: fixed;
  left: 0;
  top: 0;
  background: url('../assets/img/loading.svg') center center no-repeat #fff;
  opacity: 0.7;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}
</style>
     