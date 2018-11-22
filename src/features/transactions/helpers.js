// @ts-check
import { db } from '../../app/utils/firebase';

const { map } = require('p-iteration');
/**
 * @param {any} ctx
 * @param {{
 *  hash: string,
 *  txCurrentUser: string,
 *  txMethod: string,
 *  txTokenId: string,
 * }} event
 */
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

/**
 * @param {string} walletId
 * @param {function} setTxs
 */
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

export const removePendingTxFromFirestore = (ctx, { txReceipt }) => db
  .collection('pending')
  .where('hash', '==', txReceipt.transactionHash)
  .get()
  .then(async (coll) => {
    const pendingTxs = coll.docs.map(doc => doc.id);
    await db
      .collection('pending')
      .doc(pendingTxs[0])
      .delete();
  })
  .catch(error => console.log(error, 'error setting pedning tx'));

/**
 * @param {string} walletId
 */
export const resolveAnyPendingTx = async (
  walletId,
  gemsContract,
  auctionContract,
  AUCTION_CONTRACT_ADDRESS,
  GEM_CONTRACT_ADDRESS,
  web3,
  countryContract,
) => {
  const pendingTransactions = await db
    .collection('pending')
    .where('txCurrentUser', '==', walletId)
    .get()
    .then(coll => coll.docs.map(doc => doc.data()))
    .catch(error => console.log('error streaming pending tx data from firestore', error));

  // console.log('pendingTransactions', pendingTransactions);

  // const test = pendingTransactions.slice(0, 2);

  // console.log('test', test);

  map(pendingTransactions, async (tx) => {
    if (tx.txMethod === 'gem') {
      return gemsContract.methods
        .ownerOf(tx.txTokenId)
        .call()
        .then(async (address) => {
          // console.log('address', address);
          if (
            // if the owner is a contract address
            web3.utils.toChecksumAddress(address)
            === web3.utils.toChecksumAddress(AUCTION_CONTRACT_ADDRESS)
          ) {
            // console.log('exhibit a appears to be in auction');
            // update the db with fresh live auction details
            return auctionContract.methods
              .items(GEM_CONTRACT_ADDRESS, tx.txTokenId)
              .call()
              .then((details) => {
                // console.log('details', details);
                const { t1, p0, p1 } = details;
                return db
                  .collection('stones')
                  .doc(`${tx.txTokenId}`)
                  .update({
                    auctionIsLive: true,
                    deadline: Number(t1),
                    maxPrice: Number(p0),
                    minPrice: Number(p1),
                  })
                  .then(() => db
                    .collection('pending')
                    .where('hash', '==', tx.hash)
                    .get()
                    .then(async (coll) => {
                      const pendingTxs = coll.docs.map(doc => doc.id);
                      await db
                        .collection('pending')
                        .doc(pendingTxs[0])
                        .delete();
                    }))
                  .then(() => console.log('done'))
                  .catch(err => console.log(
                    'err reconciling liev auctions in tx reconciliation function on startup',
                    err,
                  ));
              })
              .catch(err => console.log('err getting auction details', err));
          }

          const userIdToLowerCase = address
            .split('')
            .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
            .join('');

          // console.log('exhibit a appears NOT to be in auction');
          // console.log('userIdToLowerCase', userIdToLowerCase);
          // or update the db with the gems ownerId (in lowercase)
          return db
            .collection('stones')
            .doc(`${tx.txTokenId}`)
            .update({
              owner: userIdToLowerCase,
              auctionIsLive: false,
            })
            .then(() => db
              .collection('pending')
              .where('hash', '==', tx.hash)
              .get()
              .then(async (coll) => {
                const pendingTxs = coll.docs.map(doc => doc.id);
                await db
                  .collection('pending')
                  .doc(pendingTxs[0])
                  .delete();
              }))
            .then(() => console.log('done'))
            .catch(err => console.log('err reconciling in tx reconciliation function on startup', err));
        });
    }
    if (tx.txMethod === 'country') {
      return countryContract.methods
        .ownerOf(tx.txTokenId)
        .call()
        .then(async (address) => {
          const userIdToLowerCase = address
            .split('')
            .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
            .join('');

          db
            .collection('countries')
            .doc(`${tx.txTokenId}`)
            .update({
              owner: userIdToLowerCase,
            })
            .then(() => db
              .collection('pending')
              .where('hash', '==', tx.hash)
              .get()
              .then(async (coll) => {
                const pendingTxs = coll.docs.map(doc => doc.id);
                await db
                  .collection('pending')
                  .doc(pendingTxs[0])
                  .delete();
              }))
            .then(() => console.log('done'))
            .catch(err => console.log('err reconciling in tx reconciliation function on startup', err));
        });
    }
    console.log('do nothing...');
    return false;
  });
};
