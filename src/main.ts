import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { MotionPlugin } from '@vueuse/motion'
import 'vue-advanced-cropper/dist/style.css'


import App from './App.vue'
import router from './router'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { lightTheme, darkTheme } from './styles/theme.ts'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.use(MotionPlugin)
app.use(
  createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
  }),
)

app.mount('#app')
