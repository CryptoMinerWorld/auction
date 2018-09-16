import { BigNumber } from 'bignumber.js';
import settings from "../../../cmw_settings.json";

// export const handleApproveGemTransfer = (
//   _contract,
//   _approvedContract,
//   _tokenId
// ) =>
//   new Promise((resolve, reject) => {
//     _contract.approve(_approvedContract, _tokenId, (error, result) => {
//       if (!error) resolve(_tokenId, result);
//       else reject(error);
//     });
//   });

export const ethToWei = eth => Number((eth * 1000000000000000000).toFixed(20));


// @note do we need this anymore? tk
export const daysToMilliseconds = days => Number((days * 86400000).toFixed(20));

export const daysToSeconds = days => Number(days * 86400);

     // converts BigNumber representing Solidity uint256 into String representing Solidity bytes
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
    }

    // @notice creates an auction
export const createAuction = async (
    _tokenId,
    _duration, _startPriceInWei, _endPriceInWei, _contract, _currentAccount
) => {
  
    // construct auction parameters
    const token = Number(_tokenId)
    const tokenId = new BigNumber(token)
    const t0 = (Math.round(new Date().getTime() / 1000)) || 0;
    const t1 = t0 + _duration;
    const p0 = _startPriceInWei;
    const p1 = _endPriceInWei;
    const two = new BigNumber(2)

    const data = toBytes(two.pow(224).times(tokenId)
        .plus(two.pow(192).times(t0))
        .plus(two.pow(160).times(t1))
        .plus(two.pow(80).times(p0))
        .plus(p1))

    _contract.methods.safeTransferFrom(
        _currentAccount, settings.dutchAuction, token, data
    ).send()

};