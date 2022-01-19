<template>
  <div class="bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300">
    <div class="font-sans text-2xl font-semibold tracking-widest bg-gradient-to-r from-red-200 to-red-600">
      Owned Lists
    </div>
        <ListItems
          @refetchlists="refetch"
          v-for="list in myOwnedLists"
          :key="list.id"
          :list="list"/>
      <div class="bg-gradient-to-r from-green-200 to-green-500 font-mono text-2xl font-semibold tracking-widest">
        Completed Lists
      </div>
      <ListItems
        @refetchlists="refetch"
        v-for="list in myCompletedLists"
        :key="list.id"
        :list="list"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

import { useQuery } from '@vue/apollo-composable'
import { getCompletedLists, getLists } from '../gql/List/ListQueries'

import { authService } from '../boot/auth'

import List from '../interfaces/List'
import { AuthUser } from '../interfaces/AuthUser'

import ListItems from './ListItems.vue'

export default defineComponent({
  name: 'CompletedLists',
  components: {
    ListItems
  },
  setup () {
    const id = ref('')
    const user = ref<AuthUser | null>(null)
    onMounted(() => {
      authService.getProfile().then((res: any) => {
        id.value = res.sub as string
        user.value = res as AuthUser
        console.log(id.value)
      })
    })

    const { result: simpleLists, refetch } = useQuery(getLists)

    const lists = computed(
      () => simpleLists.value ? simpleLists.value.lists : []
    )

    const myOwnedLists = computed(
      () => {
        const myLists = lists.value.filter((list:List) => list.owner.id === id.value)
        return myLists
      }
    )

    const { result } = useQuery(getCompletedLists)

    const completedLists = computed(
      () => result.value ? result.value.completedLists : []
    )

    const myCompletedLists = computed(
      () => {
        const myLists = completedLists.value.filter((list : List) => list.owner.id === id.value)
        return myLists
      }
    )

    return {
      completedLists,
      myCompletedLists,
      lists,
      myOwnedLists,
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
}
</style>
