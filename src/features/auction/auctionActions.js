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


 export const updateGemOwnership = (gemId, newOwner, priceInWei) =>  {

    console.log('newOwner', newOwner)
    console.log('gemId', gemId)


    // get name and image
    const newGemOwner = db.doc(`users/${newOwner}`).get().then( doc => doc.data())
    const {name, imageURL} = newGemOwner;
    console.log('name, imageURL', name, imageURL)

    // update gem with new owner, name and image
    db
 .collection(`stones`)
 .where(`id`, `==`, Number(gemId)).get().then(doc => {
    db.doc(`stones/${doc.id}`).update({
        userName: name,
        userImage: imageURL,
        lastSoldFor: priceInWei
      })
 })

 }

 
 
 