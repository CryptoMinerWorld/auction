import { db } from '../../app/utils/firebase';

export const handleGiftFormSubmit = async (show, giftCountryMutation) => {
  show(true);
  await giftCountryMutation();
  // send transaction to firebase
};

export const fetchCountryList = () => db
  .collection('countries')
  .get()
  .then((coll) => {
    const docs = coll.docs.map(doc => doc.data());

    return docs;
  })
  .catch(err => console.error('error fetching country list for filter on map page', err));

export const ethToWei = eth => Number(eth * 1000000000000000000);
