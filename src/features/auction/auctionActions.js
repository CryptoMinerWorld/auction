import {  AUCTION_DETAILS_RECEIVED} from './auctionConstants'
import {db} from '../../app/utils/firebase'
import store from '../../app/store'


export const getAuctionDetails = tokenId => db
 .collection(`stones`)
 .where(`id`, `==`, tokenId)
 .onSnapshot(coll => {

    const gemDetails = coll.docs.map(doc => doc.data());

    store.dispatch({
        type:AUCTION_DETAILS_RECEIVED, 
        payload: gemDetails[0]
    })

 })


 export const temp = () => console.log('temp')
 
 
 