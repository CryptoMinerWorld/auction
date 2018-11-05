export const handleGiftFormSubmit = async (show, giftCountryMutation) => {
  show(true);
  await giftCountryMutation();
  // send transaction to firebase
};


export const temp = e => (show, country) => {
  e.preventDefault();
  show(true);
  console.log('country', country);
};
