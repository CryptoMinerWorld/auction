import {addPendingTransaction, getUpdatedTransactionHistory} from "../transactions/txActions";
import {GEM_GIFTING} from "../items/itemConstants";
import {BigNumber} from "bignumber.js";
import {getUserBalance} from "../sale/saleActions";

export const submitKeys = (numberOfFounderKeys, numberOfChestKeys, chestId, reloadCallBack) => (dispatch, getState) => {
    const foundersKeyContract = getState().app.foundersKeyContract;
    const chestKeyContract = getState().app.chestKeyContract;
    const from = getState().auth.currentUserId;
    const to = process.env.REACT_APP_CHEST_FACTORY;
    let txHash;
    numberOfFounderKeys > 0 && foundersKeyContract.methods.safeTransferFrom(from, to, numberOfFounderKeys, abiPack(chestId))
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: from,
              type: `Submitting founder's keys`,
              description: `Submitting ${numberOfFounderKeys} founder's key(s)`,
          })(dispatch, getState)
      })
      .on('receipt', async (receipt) => {
          reloadCallBack();
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });

    numberOfChestKeys > 0 && chestKeyContract.methods.safeTransferFrom(from, to, numberOfChestKeys, abiPack(chestId))
      .send()
      .on('transactionHash', hash => {
          txHash = hash;
          addPendingTransaction({
              hash: hash,
              userId: from,
              type: 'Submitting chest keys',
              description: `Submitting ${numberOfChestKeys} chest key(s)`,
          })(dispatch, getState)
      })
      .on('receipt', async (receipt) => {
          reloadCallBack();
      })
      .on('error', (error) => {
          if (txHash) {
              getUpdatedTransactionHistory()(dispatch, getState);
          }
      });
};

// export const getKeysSubmitted = (chestId) => async (dispatch, getState) => {
//     const chestFactoryContract = getState().app.chestFactoryContract;
//     const participants = await chestFactoryContract.methods.getParticipants(chestId).call();
//     const userKeys = await Promise.all(participants.map(async userAddress => {
//         const [foundersKeys, chestKeys] = await chestFactoryContract.getKeyBalances(chestId, userAddress);
//         return {userAddress, foundersKeys};
//     }));
//     return userKeys;
// }

function abiPack(chestId) {
    // pack and return
    return toBytes(new BigNumber(chestId));
}

const toBytes = (uint256) => {
    let s = uint256.toString(16);
    const len = s.length;
    // 256 bits must occupy exactly 64 hex digits
    if (len > 64) {
        s = s.substr(0, 64);
    }
    for (let i = 0; i < 64 - len; i += 1) {
        s = `0${s}`;
    }
    return `0x${s}`;
};

/*
function getParticipants(uint256 chestId) public view returns(address[] memory) {
    // verify the input
    require(chestId != 0);

    // read corresponding chest participants array and return
    return chests[chestId - 1].participants;
  }
*/
  /**
   * @notice Gets number of keys submitted by the participant to open the chest
   * @param chestId ID of the chest to query
   * @param participant address to query
   */
/*
function getKeyBalances(uint256 chestId, address participant) public view returns(uint256 foundersKeys, uint256 chestKeys) {
    // verify the inputs
    require(chestId != 0 && participant != address(0));

    // read number of keys balance for corresponding participant and return
    return (chests[chestId - 1].foundersKeys[participant], chests[chestId - 1].chestKeys[participant]);
}
 */
