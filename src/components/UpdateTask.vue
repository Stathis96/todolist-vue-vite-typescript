<template>
<div class="popup min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
      <div class="max-w-md mx-auto">
        <div class="flex items-center space-x-5">
          <div class="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">T</div>
          <div class="block pl-2 font-semibold text-xl self-start text-gray-700">
            <h2 class="leading-relaxed">Update Task</h2>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div class="flex flex-col">
              <label class="leading-loose">New Task Title</label>
              <input type="text"
                class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Tasks's title"
                v-model="updatedTaskData.name">
            </div>
            <div class="pt-3 flex flex-col">
              <label class="inline-flex items-center mt-3">
                <input type="checkbox"
                  class="ml-1 form-checkbox h-6 w-6 text-green-600"
                  v-model="updatedTaskData.done">
                <span class="text-gray-700 ml-10">Is task finished?</span>
            </label>
            </div>
              <div class="pt-4 flex flex-col">
                <label class="leading-loose">Move Task to List  </label>
                <select
                class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                v-model="listId"
                >
                <option v-for="list in sameTypeOfLists" :key="list.id" :value="list.id" :label="list.title"></option>
            </select>
            </div>
          </div>
          <div class="pt-4 flex items-center space-x-4" >
              <button class="bg-red-500 flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none" @click="closeModal">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancel
              </button>
              <button class="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"  @click="submitUpdateTask()">Update Task</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import { computed, defineComponent, PropType, ref } from 'vue'

import { useMutation, useQuery } from '@vue/apollo-composable'
import { getLists } from '../gql/List/ListQueries'
import { updateTask } from '../gql/Tasks/TaskMutations'

import List from '../interfaces/List'
import Tasks from '../interfaces/Tasks'

export default defineComponent({
  name: 'UpdateList',
  props: {
    // TogglePopup2: {
    //   type: Object
    // },
    list: {
      type: Object as PropType<List>,
      required: true
    },
    task: {
      type: Object as PropType<Tasks>,
      required: true
    }
  },
  setup (props, { emit }) {
    const listId = ref(props.list.id)
    const { result } = useQuery(getLists)

    const lists = computed(
      () => result.value ? result.value.lists : []
    )

    const sameTypeOfLists = computed(
      () => {
        const myLists = lists.value.filter((list:List) => list.type === props.list.type)
        return myLists
      }
    )

    const updatedTaskData = ref({
      name: props.task.name,
      type: props.list.type.toLowerCase(),
      list_id: listId,
      done: ref(false)
    })

    const { mutate: updateTaskMutation } = useMutation(updateTask,
      () => ({
        variables: {
          updateTaskId: props.task.id,
          updateTaskData: updatedTaskData.value
        }
      })
    )

    const submitUpdateTask = () => {
      console.log(listId)
      console.log('task id is ', props.task.id)
      updateTaskMutation().then(() => {
        emit('updatetasks')
        console.log('emited update from update tasks')
        closeModal()
      }).catch((err) => {
        alert(err.message)
      })
    }

    const closeModal = () => {
      emit('TogglePopup')
    }

    return {
      closeModal,
      updatedTaskData,
      submitUpdateTask,
      sameTypeOfLists,
      listId
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
