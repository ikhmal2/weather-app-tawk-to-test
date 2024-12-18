import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

const store = createStore({
  state() {
    return {
      profile: {
        name: 'John Doe',
        email: 'jane@gmail.com',
        phoneNum: '+01 234 567 89',
      },
    }
  },
  mutations: {
    updateProfile(state, key: string, value: string) {
      state.profile[key] = value
    },
  },
})

const app = createApp(App)

app.use(router, store)

app.mount('#app')
