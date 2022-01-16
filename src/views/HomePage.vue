<template>
<div class="bg-gradient-to-bl from-red-500 to-green-500">
  <p class="font-serif text-left md:text-center font-black text-4xl">ToDo Lists</p>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="() => TogglePopup()">
      Create new List
    </button>
  <ListItems
    v-for="list in lists" :key="list.id" :list="list"
    @refetchlists="refetch"
  />
    <CreateList
      v-if="popupTriggers"
      @refetchlists="refetch"
      @TogglePopup='TogglePopup'
    />
  </div>
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { computed, defineComponent, onMounted, ref } from 'vue'
import ListItems from '../components/ListItems.vue'
import CreateList from '../components/CreateList.vue'
import { getLists } from '../gql/List/ListQueries'
import { authService } from '../boot/auth'
import { AuthUser } from '../interfaces/AuthUser'
import List from '../interfaces/List'

export default defineComponent({
  name: 'HomePage',
  components: {
    ListItems,
    CreateList
  },
  setup () {
    const user = ref({ sub: '', name: '', email: '' })

    onMounted(() => {
      authService.getProfile()
        .then((res) => {
          console.log('res from app vue is', res)
          user.value = res as AuthUser
          if (res == null) {
            authService.login()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    })

    const popupTriggers = ref(false)
    const TogglePopup = () => {
      popupTriggers.value = !popupTriggers.value
    }

    const { result, refetch } = useQuery<{ lists: List }>(getLists)

    const lists = computed(
      () => result.value ? result.value.lists : []
    )

    return {
      lists,
      popupTriggers,
      TogglePopup,
      refetch
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
  /* margin-top: 60px; */
}
</style>
