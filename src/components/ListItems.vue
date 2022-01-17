<template>
<div class="container mb-2 flex mx-auto w-full items-center justify-center">
  <div class="relative h-auto w-auto flex items-center justify-center bg-gradient-to-r from-indigo-300 to-purple-400 font-sans border-2 p-6 hover:shadow-2xl border-red-400 rounded-2xl" >
    <button
      v-if="list.owner.id === ownerId"
      class="rounded absolute bottom-1 right-1"
      @click="submitDeleteList">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" style="overflow: visible" fill="none" viewBox="-12 0 24 24" stroke="currentColor" >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete List
    </button>
    <button
      v-if="list.owner.id === ownerId"
      class ="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
      @click="TogglePopup">
        Edit List
    </button>
    <button
      v-if="list.owner.id === ownerId"
      class="rounded absolute top-1 right-1"
      @click="sumbitCloneList">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" style="overflow: visible" fill="none" viewBox="-12 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
        Clone List
    </button>
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div class="overflow-hidden text-gray-100">
              <h1 class="w-full text-black text-xl">
                LIST NAME: {{list.title}}</h1>
              <p class="text-black text-opacity-75 text-base font-style: italic" >
                List Slug: {{list.slug}}</p>
              <p class="text-black text-opacity-75 text-base font-style: italic" >
                List Type: {{list.type}}</p>
                <p class="text-black text-opacity-75 text-base font-style: italic" >
                List Capacity: {{list.tasks.length}}/{{list.capacity}}</p>
                <div v-if="list.owner.id === ownerId" class="flex mt-4">
                    <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-black"
                     placeholder="Add Todo"
                      v-model="newTask"
                      @keyup.enter="submitCreateTask">
                    <button
                      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                     @click="submitCreateTask">Add new task</button>
                </div>
          </div>
              <div
               v-for="task in tasks" :key="task.id">
                 <p class="inline-grid grid-cols-4 gap-x-4 mt-2 relative text-grey-darkest text-base font-style: italic py-2" > {{task.name}}
                    <span :class="task.done ? 'bg-green-600 text-white font-bold py-2 px-4 border border-blue-700 rounded' : 'bg-red-600 text-white font-bold py-2 px-4 border border-blue-700 rounded' ">
                     Done Task</span>
                   <button
                    :class="list.owner.id === ownerId ? 'bg green-200 hover:bg-green-400 flex-no-shrink p-1 ml-1 mr-1 border-2 rounded hover:text-white' : 'bg gray-200 hover:bg-gray-400 flex-no-shrink p-1 ml-1 mr-1 border-2 rounded hover:text-white cursor-not-allowed'"
                    @click="() => TogglePopup2(task)" >
                     Edit Task</button>
                   <button
                    :class="list.owner.id === ownerId ? 'bg red-200 hover:bg-red-400 flex-no-shrink p-1 ml-1 mr-1 border-2 rounded text-white' : 'bg gray-200 hover:bg-gray-400 flex-no-shrink p-1 ml-1 mr-1 border-2 rounded text-white cursor-not-allowed'"
                    @click="submitDeleteTask(task.id)">Remove Task</button>
                 </p>
              </div>
        </div>
  </div>
    <UpdateList
      v-if="popupTriggers"
      @updatelists='updatelists'
      @TogglePopup='TogglePopup'
      :list="list"/>
    <UpdateTask
      v-if="popupTriggers2.button2Trigger"
      @TogglePopup='TogglePopup2'
      @updatetasks="updatetasks"
      :list="list"
      :task="obj"
      />
</div>
</template>

<script lang="ts">

import { useMutation } from '@vue/apollo-composable'
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { authService } from '../boot/auth'

import { cloneList, deleteList } from '../gql/List/ListMutations'
import { createTask, deleteTask } from '../gql/Tasks/TaskMutations'
import { AuthUser } from '../interfaces/AuthUser'

import List from '../interfaces/List'
import Tasks from '../interfaces/Tasks'
import UpdateList from './UpdateList.vue'
import UpdateTask from './UpdateTask.vue'

export default defineComponent({
  name: 'ListItems',
  components: {
    UpdateList,
    UpdateTask
  },
  props: {
    list: {
      type: Object as PropType<List>,
      required: true
    }
  },

  setup (props, { emit }) {
    const ownerId = ref('')
    const user = ref<AuthUser | null>(null)

    const obj = ref()

    const tasks = computed(() => props.list.tasks) // computed gia na doulevei to emit sto deletetask
    const newTask = ref('')// const newTask = ref({}) can also do it this way , but i need the values to be empty at first
    let taskId = ''

    const list = ref(props.list)

    onMounted(() => {
      authService.getProfile().then((res: any) => {
        ownerId.value = res.sub as string
        user.value = res as AuthUser
      })
    })

    const popupTriggers = ref(false) // first way just a boolean
    const popupTriggers2 = ref({ button2Trigger: false }) // 2nd way with a ref object

    const TogglePopup = () => {
      popupTriggers.value = !popupTriggers.value
    }
    const TogglePopup2 = (task?: Tasks | undefined) => { // so i dont need the close method, returning tasks OR undefined so when gets called by updatetask with no parameter is still valid
      obj.value = task
      popupTriggers2.value.button2Trigger = !popupTriggers2.value.button2Trigger
    }

    // todo podi
    // const close = () => {
    //   popupTriggers2.value.button2Trigger = !popupTriggers2.value.button2Trigger first way of solving the closing of the modal by updateTask - not right
    // }

    const { mutate: createTaskMutation } = useMutation(createTask,
      () => ({
        variables: {
          createTaskData: {
            list_id: list.value.id,
            name: newTask.value,
            type: list.value.type.toLowerCase()
          }
        }
      })
    )

    const submitCreateTask = () => {
      createTaskMutation().then((res) => {
        console.log('response is', res)
        tasks.value.push(res?.data.createTask)
        newTask.value = ''
        emit('refetchlists')
      }).catch((err) => {
        alert(err.message)
      })
    }

    const { mutate: deleteListMutation } = useMutation(deleteList,
      () => ({
        variables: {
          deleteListId: list.value.id
        }
      })
    )

    const submitDeleteList = () => {
      deleteListMutation().then(() => {
        emit('refetchlists')
        console.log('emited refetch from delete list')
      }).catch((err) => {
        alert(err.message)
      })
    }

    const { mutate: cloneListMutation } = useMutation(cloneList,
      () => ({
        variables: {
          cloneListId: list.value.id
        }
      })
    )

    const sumbitCloneList = () => {
      cloneListMutation().then(() => {
        emit('refetchlists')
        console.log('emited refetch from clone list')
      })
    }

    const { mutate: deleteTaskMutation } = useMutation(deleteTask,
      () => ({
        variables: {
          deleteTaskId: taskId
        }
      })
    )
    const submitDeleteTask = (id: string) => {
      console.log('id for deletion is: ', id)
      taskId = id
      deleteTaskMutation().then(() => {
        emit('refetchlists')
        console.log('emited refetch from delete task')
      }).catch((err) => {
        alert(err.message)
      })
    }

    const updatetasks = () => {
      emit('refetchlists')
      console.log('emited refetch from update tasks')
    }
    const updatelists = () => {
      emit('refetchlists')
      console.log('emited refetch from update lists')
    }

    return {
      tasks,
      newTask,
      submitCreateTask,
      submitDeleteList,
      submitDeleteTask,
      sumbitCloneList,
      popupTriggers,
      popupTriggers2,
      TogglePopup,
      TogglePopup2,
      updatetasks,
      obj,
      ownerId,
      updatelists
    }
  }
})
</script>
<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.event-card {
  padding: 20px;
  width: 250px;
  cursor: pointer;
  border: 1px solid #39495c;
  margin-bottom: 18px;
}
</style>
