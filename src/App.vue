<template>
  <div class="bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900" id="nav">
        <router-link class="font-serif" :to="{ name: 'HomePage' }">HomePage</router-link> |
        <router-link class="font-serif" :to="{ name: 'CompletedLists' }">My Own&Completed Lists</router-link>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded fixed left-0 bottom-0" @click="logout">Logout
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              </button>
  </div>
      <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { authService } from './boot/auth'

export default defineComponent({
  name: 'App',
  methods: {
    logout () {
      authService.logout()
    }
  }
})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
