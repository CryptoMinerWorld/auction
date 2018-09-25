import { NEW_AUCTIONS_RECEIVED} from './marketConstants'
import {db} from '../../app/utils/firebase'

export const getAuctions = () => (dispatch) => db
 .collection('stones')
 .where('auctionIsLive', '==', true)
 .onSnapshot(collection => {
    const auctions = collection.docs.map(doc => doc.data())
    dispatch({type:NEW_AUCTIONS_RECEIVED, payload: auctions})
 })

 export const getSoonestAuctions = () => (dispatch) => db
 .collection('stones')
 .where('auctionIsLive', '==', true)
 .orderBy("deadline")
 .onSnapshot(collection => {
    const auctions = collection.docs.map(doc => doc.data())
    dispatch({type:NEW_AUCTIONS_RECEIVED, payload: auctions})
 })

 export const getLowestAuctions = () => (dispatch) => db
 .collection('stones')
 .where('auctionIsLive', '==', true)
 .orderBy("currentPrice", "desc")
 .onSnapshot(collection => {
    const auctions = collection.docs.map(doc => doc.data())
    dispatch({type:NEW_AUCTIONS_RECEIVED, payload: auctions})
 })

 export const getHighestAuctions = () => (dispatch) => db
 .collection('stones')
 .where('auctionIsLive', '==', true)
 .orderBy("currentPrice")
 .onSnapshot(collection => {
    const auctions = collection.docs.map(doc => doc.data())
    dispatch({type:NEW_AUCTIONS_RECEIVED, payload: auctions})
 })

 



    



 
 




