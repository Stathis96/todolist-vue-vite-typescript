import gql from 'graphql-tag'

export const getLists = gql`
  query getLists{
    lists: getLists {
      id
      title
      slug
      type
      capacity
      owner{
        id
      }
      tasks {
        id
        name
        type
        done
      }
    }
  }
`
export const getCompletedLists = gql`
  query getCompletedLists{
    completedLists: getCompletedLists{
      id
      slug
      title
      type
      owner{
        id
      }
      tasks {
        id
        name
        type
        done
      }
    }
  }
`
export const getList = gql`
  query getList($getListId: String!) {
    singleList : getList(id: $getListId) {
      id
      capacity
      owner {
        name
        email
      }
    }
  }
`