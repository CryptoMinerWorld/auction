import { db } from '../../app/utils/firebase';

export const savePendingTxToFirestore = (ctx, {
  hash, txCurrentUser, txMethod, txTokenId,
}) => {
  console.log('handle TX', ctx, hash, txCurrentUser, txMethod, txTokenId);
  return db
    .collection('pending')
    .add({
      hash,
      txCurrentUser,
      txMethod,
      txTokenId,
    })
    .catch(error => console.log(error, 'error setting pedning tx'));
};
export const removePendingTxFromFirestore = () => {};
export const resolvePendingTx = () => {};
