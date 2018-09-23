import { NEW_AUCTIONS_RECEIVED} from './marketConstants'
import {db} from '../../utils/firebase'

export const getAuctions = () => (dispatch) => db
 .collection('auctions')
 .onSnapshot(collection => {
    const auctions = collection.docs.map(doc => doc.data())
    dispatch({type:NEW_AUCTIONS_RECEIVED, payload: auctions})
 })

 export const temp = () => console.log('temp')


 



    



 
 




