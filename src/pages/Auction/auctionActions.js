import {  AUCTION_DETAILS_RECEIVED} from './auctionConstants'
import {db} from '../../utils/firebase'
import store from '../../store'


export const getAuctionDetails = tokenId => db
 .doc(`auctions/${tokenId}`)
 .get()
 .then(doc => {
    console.log("poo", doc.data(), typeof tokenId);
   
    return store.dispatch({
     type:AUCTION_DETAILS_RECEIVED, 
     payload: doc.data()
    })

 })
 .catch(error => console.error('error', error))
    
 
 export const temp = () => console.log('temp')
 
 
 