import gql from 'graphql-tag'

export const createTask = gql `
  mutation createTask($createTaskData: TasksInputData!){
    createTask: createTask(data: $createTaskData) {
      id
      name
      type
      done
    }
  }
`
export const updateTask = gql `
  mutation updateTask($updateTaskData: TasksInputData!, $updateTaskId: String!){
    updateTask: updateTask(data: $updateTaskData, id: $updateTaskId) {
      id
      name
      type
      done
    }
  }
`
export const deleteTask = gql `
  mutation deleteTask($deleteTaskId: String!){
    deleteTask: deleteTask(id: $deleteTaskId)
  }
`