
import Tasks from './Tasks';
import User from './User';

export default interface List{
  id : string,
  slug : string,
  title : string,
  type: string,
  capacity : number,
  tasks : Tasks[],
  owner : User
}