import {AUCTION_CREATED, AUCTIONS_REQUESTED} from './marketConstants'
import {db} from '../../utils/firebase'

export const createAuction = (auction) => ({type:AUCTION_CREATED, payload: auction})

export const getAuctions = () => (dispatch) => db
 .collection('auctions')
 .get()
 .then(collection => collection.docs.map(doc => doc.data()))
 .then( auctions => dispatch({type:AUCTIONS_REQUESTED, payload: auctions})
 )



