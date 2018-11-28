// @ts-check
import { db, rtdb } from '../../app/utils/firebase';
import { getMapIndexFromCountryId } from '../dashboard/helpers';

// const { map } = require('p-iteration');
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

  // map(pendingTransactions, async (tx) => {
  pendingTransactions.forEach(async (tx) => {
    console.log('resolution function started');
    if (tx.txMethod === 'gem') {
      console.log('is gem');
      await gemsContract.methods
        .ownerOf(tx.txTokenId)
        .call()
        .then(async (address) => {
          console.log('address', address);
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
      console.log('is country');

      tx.txTokenId.forEach(async (eachTokenId) => {
        await countryContract.methods.ownerOf(eachTokenId).call({}, async (errors, address) => {
          if (errors) {
            console.log('no country owner', errors, address);

            await rtdb
              .ref(
                `/worldMap/objects/units/geometries/${getMapIndexFromCountryId(
                  eachTokenId,
                )}/properties`,
              )
              .update({ sold: false })
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
                }));
          }

          if (address) {
            console.log('resolve address...', address, eachTokenId);

            // tx.txTokenId.forEach(async (eachTokenId) => {
            console.log('eachTokenId', eachTokenId);
            // get country details from rtdb
            const country = await rtdb
              .ref(
                `/worldMap/objects/units/geometries/${getMapIndexFromCountryId(
                  eachTokenId,
                )}/properties`,
              )
              .once('value')
              .then(snap => snap.val());

            await db.collection('countries')
              .doc(`${country.name}`)
              .set({
                id: country.name,
                owner: address
                  .split('')
                  .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
                  .join(''),
                onSale: false,
                lastPrice: country.price,
                lastBought: Date.now(),
                totalPlots: country.plots,
                plotsBought: 0,
                plotsMined: 0,
                plotsAvailable: country.plots,
                name: country.name,
                roi: country.roi,
                countryId: country.countryId,
                mapIndex: country.mapIndex,
                imageLinkLarge: country.imageLinkLarge,
                imageLinkMedium: country.imageLinkMedium,
                imageLinkSmall: country.imageLinkSmall,
              })
              .then(() => rtdb
                .ref(
                  `/worldMap/objects/units/geometries/${getMapIndexFromCountryId(
                    eachTokenId,
                  )}/properties`,
                )
                .update({ sold: true }))
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
              .then(() => console.log('done', eachTokenId))
              .catch(err => console.log('err reconciling in tx reconciliation function on startup', err));
          }
        });
      });
    }
    return false;
  });
};
