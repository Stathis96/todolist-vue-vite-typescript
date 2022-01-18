<template>
<div class="popup min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
      <div class="max-w-md mx-auto">
        <div class="flex items-center space-x-5">
          <div class="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">L</div>
          <div class="block pl-2 font-semibold text-xl self-start text-gray-700">
            <h2 class="leading-relaxed">Update List's Title or Slug</h2>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div class="flex flex-col">
              <label class="leading-loose">New List Title</label>
              <input type="text" class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="List's title"
                v-model="updatedListData.title">
            </div>
            <div class="flex flex-col">
              <label class="leading-loose">New List Slug</label>
              <input type="text" class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="List's slug"
                v-model="updatedListData.slug"
                @keyup.enter="submitUpdateList">
            </div>
          </div>
          <div class="pt-4 flex items-center space-x-4">
              <button class="bg-red-500  flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none" @click="closeModal">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancel
              </button>
              <button class="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none" @click="submitUpdateList">Update List</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import { useMutation } from '@vue/apollo-composable'
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { authService } from '../boot/auth'
import { updateList } from '../gql/List/ListMutations'
import { AuthUser } from '../interfaces/AuthUser'
import List from '../interfaces/List'

export default defineComponent({
  name: 'UpdateList',
  props: {
    TogglePopup: {
      type: Object
    },
    list: {
      type: Object as PropType<List>,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: false,
      required: true
    }
  },
  setup (props, { emit }) {
    const ownerId = ref('')
    const user = ref<AuthUser | null>(null)

    onMounted(() => {
      authService.getProfile().then((res: any) => {
        ownerId.value = res.sub as string
        user.value = res as AuthUser
        // console.log(ownerId.value)
      })
    })

    const listId = ref(props.list.id)

    const updatedListData = computed(() => {
      return {
        slug: props.list.slug,
        title: props.list.title,
        type: props.list.type.toLowerCase(),
        capacity: props.list.capacity
      }
    })

    console.log(ownerId.value)

    const { mutate: updateListMutation } = useMutation(updateList,
      () => ({
        variables: {
          updateListData: updatedListData.value,
          updateListId: listId.value
        }
      })
    )
    const submitUpdateList = () => {
      updateListMutation().then(() => {
        emit('updatelists')
        console.log('emited update from update lists')
        emit('TogglePopup')
      }).catch((err) => {
        alert(err.message)
      })
    }
    const closeModal = () => {
      emit('TogglePopup')
    }

    return {
      updatedListData,
      submitUpdateList,
      closeModal
    }
  }

})
</script>

<style scoped>
.popup {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 99;
background-color: rgba(0, 0, 0, 0.2);

display: flex;
align-items: center;
justify-content: center;

}
</style>
