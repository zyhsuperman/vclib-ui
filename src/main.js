import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
//全局css
import './assets/css/index.css'

createApp(App)
    .use(router)
    .use(ElementUI)
    .mount('#app')

