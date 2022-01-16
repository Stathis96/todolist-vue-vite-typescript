import List from "./List";


export default interface Tasks{
  id: string,
  name: string,
  type: string,
  list: List,
  done : boolean
}