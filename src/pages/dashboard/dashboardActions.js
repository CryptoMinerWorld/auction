import { USER_GEMS_RETRIEVED} from './dashboardConstants'
import {db} from '../../utils/firebase'
import store from '../../store'

export const getUserGems =  (userId) => () => db
.collection('auctions')
.where('owner', '==', userId)
.get()
.then(collection => {
   const gems = collection.docs.map(doc => doc.data())
   store.dispatch({type:USER_GEMS_RETRIEVED, payload: gems})
})






export const TEMP = () => console.log('frog')