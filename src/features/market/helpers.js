import { db } from '../../app/utils/firebase';

export const updateDBwithNewPrice = auctionId => db
  .collection('stones')
  .where('id', '==', auctionId)
  .get()
  .then((coll) => {
    const gemId = coll.docs.map(doc => doc.id);
    return gemId[0];
  })
  .catch(err => err);

export const calculatePercentage = (max, current) => ((max - current) / max) * 100;

export const weiToEth = wei => Number((wei / 1000000000000000000).toFixed(3));

export const gradeConverter = gradeValue => ({
  1: 'D',
  2: 'C',
  3: 'B',
  4: 'A',
  5: 'AA',
  6: 'AAA',
}[gradeValue]);
