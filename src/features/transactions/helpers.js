import { db } from '../../app/utils/firebase';

export const savePendingTxToFirestore = (ctx, {
  hash, txCurrentUser, txMethod, txTokenId,
}) => db
  .collection('pending')
  .add({
    hash,
    txCurrentUser,
    txMethod,
    txTokenId,
  })
  .catch(error => console.log(error, 'error setting pedning tx'));

export const removePendingTxFromFirestore = () => {};
export const resolvePendingTx = () => {};

export const fetchAnyPendingTransactions = (walletId, setTxs) => db
  .collection('pending')
  .where('txCurrentUser', '==', walletId)
  .onSnapshot(
    (coll) => {
      const pendingTxs = coll.docs.map(doc => doc.data());
      setTxs(pendingTxs);
    },
    error => console.log('error streaming pending tx data from firestore', error),
  );
