import { createApp, h, provide } from 'vue'
import App from './App.vue'
import './index.css'

import { apolloClient } from './boot/apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'
import router from './router'

createApp(
  {
    setup () {
      provide(DefaultApolloClient, apolloClient)
    },
    render () {
      return h(App)
    }
  }
)
.use(router)
.mount('#app')
