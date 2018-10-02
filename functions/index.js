const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateGemDetails = functions.https.onRequest(
   (request, response) => {
    const listofAllUserIds =  admin
      .firestore()
      .collection('users')
      .get()
      .then(coll => coll.docs.map(doc => doc.data())).then(listofAllUserIds => response.json({listofAllUserIds: `${listofAllUserIds}`}))

      
  }
);

//    (userId,gemContract, userName, userImage )

// listofAllUserIds
// get data from contract for each of their gems

// try {
//   const idsOfGemsUserOwns = await gemContract.methods
//     .getCollection(userId)
//     .call();

//   return Promise.all(
//     idsOfGemsUserOwns.map(gemId =>
//       getGemQualities(gemContract, gemId).then(
//         ([color, level, gradeType, gradeValue]) => ({
//           color,
//           level,
//           gradeType,
//           gradeValue,
//           gemId
//         })
//       )
//     )
//   ).then(smartContractDetails => {
//     const gemImages = Promise.all(
//       smartContractDetails.map(gem =>
//         getGemImage(gem.color, gem.gradeType, gem.level)
//       )
//     );

//     const gemStories = Promise.all(
//       smartContractDetails.map(gem => getGemStory(gem.color, gem.level))
//     );

//     return Promise.all([gemImages, gemStories]).then(([images, stories]) => {
//       const arrayofCompleteGemDetails = idsOfGemsUserOwns.map(
//         (gemId, index) => ({
//           id: Number(gemId),
//           ...smartContractDetails[index],
//           rate: Number(
//             calcMiningRate(
//               smartContractDetails[index].gradeType,
//               smartContractDetails[index].gradeValue
//             )
//           ),
//           auctionIsLive: false,
//           owner: userId,
//           gemImage: images[index],
//           story: stories[index],
//           userName,
//           userImage
//         })
//       );

//       if (arrayofCompleteGemDetails.length === 0) {
//         return Promise.reject('No Gems Available');
//       }

//       const updateOrCreate = arrayofCompleteGemDetails
//       .map( gem =>
//          db.collection('stones')
//           .where('id', '==', gem.id)
//           .get()
//           .then(coll => {

//             const doc = coll.docs.map(doc => doc.id)[0];

//             if (doc) {
//               // update it
//               return db.collection("stones").doc(doc).update(gem)
//             }
//             // or else create it
//             return db.collection("stones").add(gem)
//           })
//       )
//       // check if document exists, update it if it does and create one if it doesn't
//       return Promise.all(updateOrCreate).then(() => 'Gems Updated.')

//     });
//   });
// } catch (err) {
//   return err;
// }
