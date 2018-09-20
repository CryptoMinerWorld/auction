import { NEW_AUCTIONS_RECEIVED,NEW_AUCTION_ADDED} from './marketConstants'
import {db} from '../../utils/firebase'
import store from '../../store'




export const getAuctions = () => (dispatch) => db
 .collection('auctions')
 .onSnapshot(collection => {
    const auctions = collection.docs.map(doc => doc.data())
    dispatch({type:NEW_AUCTIONS_RECEIVED, payload: auctions})
 })

export const addAuction = auction =>  db
     .collection('auctions')
     .add(auction)
     .then(() => store.dispatch({type:NEW_AUCTION_ADDED}))
     .catch(error => console.error('error', error))

   



    



 
 




