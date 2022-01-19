import gql from 'graphql-tag'

export const createList = gql `
  mutation createList($createListData: ListInputData!) {
    createList: createList(data: $createListData) {
    id
    slug
    title
    capacity
    type
    owner {
      id
      name
    }
  }
}
`
export const updateList = gql `
  mutation updateList($updateListData: ListInputData!, $updateListId: String!){
    updateList: updateList(data: $updateListData, id: $updateListId) {
    id
    slug
    title
    capacity
    type
    owner{
      id
      name
    }
    }
}
`
export const deleteList = gql `
  mutation deleteList($deleteListId: String!){
    deleteList: deleteList(id: $deleteListId)
}
`
export const cloneList = gql `
  mutation cloneList($cloneListId: String!){
  cloneList: cloneList(id: $cloneListId) {
    id
    capacity
    slug
    title
    tasks {
      id
      name
      type
      done
    }
  }
}
`