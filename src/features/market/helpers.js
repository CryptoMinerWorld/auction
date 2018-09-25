import { db } from "../../app/utils/firebase";

export const updateDBwithNewPrice = (auctionId) => db
    .collection(`stones`)
    .where(`id`, `==`, auctionId)
    .get()
    .then(coll => {
      const gemId = coll.docs.map(doc => doc.id)
      return gemId[0];
    })

export const temp = () => console.log('temp')