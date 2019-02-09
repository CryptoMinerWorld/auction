import {BigNumber} from "bignumber.js";
import store from "../store";


export default class AuctionService {

    constructor(auctionContractInstance, gemContractInstance) {
        this.auctionContract = auctionContractInstance;
        this.gemContract = gemContractInstance;
    }


    getTokenSaleStatus = async (tokenId) => {
        return new BigNumber(
          await (this.auctionContract.methods
            .getTokenSaleStatus(this.gemContract._address, tokenId)
            .call())
        );
    }

    getGemAuctionData = async (tokenId) => {

        const packed224uint = await this.getTokenSaleStatus(tokenId);

        const gemAuctionData = {};

        if (packed224uint.isZero()) {
            gemAuctionData.auctionIsLive = false;
        }
        else {
            gemAuctionData.auctionIsLive = true;
            gemAuctionData.deadline = packed224uint.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(0x100000).toNumber();
            gemAuctionData.maxPrice = packed224uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(0x100000).toNumber();
            gemAuctionData.minPrice = packed224uint.dividedToIntegerBy(new BigNumber(2).pow(64)).modulo(0x100000).toNumber();
            gemAuctionData.currentPrice = packed224uint.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(0x100000).toNumber();
        }
        return gemAuctionData;
    }
}

export const createAuctionHelper = async (
  _tokenId,
  _duration,
  _startPriceInWei,
  _endPriceInWei,
  _contract,
  _currentAccount,
) => {
    // construct auction parameters
    const token = Number(_tokenId);
    const tokenId = new BigNumber(token);
    const t0 = Math.round(new Date().getTime() / 1000) || 0;
    const t1 = t0 + _duration;
    const p0 = _startPriceInWei;
    const p1 = _endPriceInWei;
    const two = new BigNumber(2);

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
    };

    // convert auction parameters to bytecode for smart contract
    const data = toBytes(
      two
        .pow(224)
        .times(tokenId)
        .plus(two.pow(192).times(t0))
        .plus(two.pow(160).times(t1))
        .plus(two.pow(80).times(p0))
        .plus(p1),
    );

    // submit the auction
    await _contract.methods
      .safeTransferFrom(_currentAccount, process.env.REACT_APP_DUTCH_AUCTION, token, data)
      .send()
      .on('transactionHash', hash => store.dispatch(
        startTx({
            hash,
            currentUser: _currentAccount,
            method: 'gem',
            tokenId: token,
        }),
      ))
      .on('receipt', receipt => store.dispatch(completedTx(receipt)))
      .on('error', error => store.dispatch(ErrorTx(error)));

    const auctionDetails = {
        deadline: t1,
        maxPrice: _startPriceInWei,
        minPrice: _endPriceInWei,
    };

    return auctionDetails;
};



