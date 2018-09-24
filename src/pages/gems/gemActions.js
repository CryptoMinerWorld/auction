import {  AUCTION_DETAILS_RECEIVED, NEW_AUCTION_CREATED} from './gemConstants'
import {db} from '../../utils/firebase'
// import store from '../../store'
import {createAuctionHelper} from './helpers'


export const getGemDetails = tokenId => dispatch => db
 .doc(`auctions/${tokenId}`)
 .get()
 .then(doc => dispatch({
     type:AUCTION_DETAILS_RECEIVED, 
     payload: doc.data()
    }))
 .catch(error => console.error('error', error))
    
 
 export const createAuction = (payload) => (dispatch, getState) => {

    //  eslint-disable-next-line
     const currentAccount = getState().auth.currentUserId
    //  eslint-disable-next-line
     const gemsContractInstance = getState().app.gemsContractInstance

     try {
        createAuctionHelper(
            payload.gemId,
            payload.duration,
            payload.startPrice,
            payload.endPrice,
            gemsContractInstance,
            currentAccount
          ).then(result => console.log('result', result))
        dispatch({
            type: NEW_AUCTION_CREATED, 
            payload
        })
     } catch (error) {
        console.log('error', error)
     }
}
    



// get Gem details from gem contract

// if (tokenId) {
//       // @notice get auction details from contract
//       const gemDetails = await getAuctionDetails(dutchContract, tokenId);
//       const [startTime, endTime, startPrice, endPrice] = await gemDetails;
//       // @notice set auction details to app state
//       this.setState(
//         {
//           tokenId,
//           auctionStartTime: Number(startTime),
//           auctionEndTime: Number(endTime),
//           auctionStartPrice: Number(startPrice),
//           auctionEndPrice: Number(endPrice)
//         },
//         () => {
//           // @notice get current price from contract
//           getPrice(tokenId, dutchContract).then(result =>
//             this.setState({
//               priceInWei: result,
//               currentPrice: nonExponential(result)
//             })
//           );
//           // @notice check if the token is on sale
//           isTokenForSale(dutchContract, tokenId).then(isTokenOnSale =>
//             this.setState({ isTokenOnSale })
//           );
//         }
//       );

//       // @notice updates the price every 10 seconds
//       this.priceInterval = setInterval(() => {
//         getPrice(tokenId, dutchContract).then(result =>
//           this.setState({
//             priceInWei: result,
//             currentPrice: nonExponential(result)
//           })
//         );
//       }, 10000);

//       // @notice get gem qualities from gem contract
//       getGemQualities(gemsContract, tokenId).then(result => {
//         const [color, level, gradeType, gradeValue] = result;

//         this.setState({
//           grade: gradeType,
//           level: Number(level),
//           color,
//           rate: Number(calcMiningRate(gradeType, gradeValue))
//         });

//         const image = getGemImage(color, gradeType, level);
//         const story = getGemStory(color, level);

//         Promise.all([image, story])
//           .then(([_image, _story]) =>
//             this.setState({ gemImage: _image, story: _story })
//           )
//           .catch(err => {
//             this.setState({ err });
//           });
//       });
//     }



