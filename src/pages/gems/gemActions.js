import {  AUCTION_DETAILS_RECEIVED, NEW_AUCTION_CREATED} from './gemConstants'
import {db} from '../../utils/firebase'
// import store from '../../store'
import {createAuctionHelper} from './helpers'


export const getGemDetails = tokenId => dispatch => db
 .doc(`auctions/${tokenId}`)
 .get()
 .then(doc => dispatch({
     type:AUCTION_DETAILS_RECEIVED, 
     payload: doc.data()
    }))
 .catch(error => console.error('error', error))
    
 
 export const createAuction = (payload) => (dispatch, getState) => {
 
    //  eslint-disable-next-line
     const currentAccount = getState().auth.currentUserId
    //  eslint-disable-next-line
     const gemsContractInstance = getState().app.gemsContractInstance

     try {
        createAuctionHelper(
            payload.gemId,
            payload.duration,
            payload.startPrice,
            payload.endPrice,
            gemsContractInstance,
            currentAccount
          ).then(result => console.log('result', result))
        dispatch({
            type: NEW_AUCTION_CREATED, 
            payload
        })
     } catch (error) {
        console.log('error', error)
     }
}
       



