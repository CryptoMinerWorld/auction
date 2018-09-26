import { db } from "../../app/utils/firebase";

export const updateDBwithNewPrice = (auctionId) => db
    .collection(`stones`)
    .where(`id`, `==`, auctionId)
    .get()
    .then(coll => {
      const gemId = coll.docs.map(doc => doc.id)
      return gemId[0];
    })

export const calculatePercentage = (max, current) => ((max - current) / max) * 100;


export const weiToEth = wei => Number((wei / 1000000000000000000).toFixed(3));