import {BigNumber} from "bignumber.js";
import store from "../store";
import {calculateGemName, calculateMiningRate, unpackGemProperties} from "./GemService";
import {GWeiToEth, weiToEth} from "../../features/market/helpers";


export default class AuctionService {

    constructor(auctionContractInstance, auctionHelperContractInstance, gemContractInstance) {
        this.auctionContract = auctionContractInstance;
        this.auctionHelperContract = auctionHelperContractInstance;
        this.gemContract = gemContractInstance;
    }

    getAuctionOwnerGems = async (ownerId) => {

        const auctionUserGems = await this.auctionHelperContract.methods
          .getGemCollection(this.auctionContract._address, this.gemContract._address, ownerId).call();

        return auctionUserGems.map(auctionGem => {
            const packed240uint = new BigNumber(auctionGem);

            /*     gem id, 32 bits
            *      gem color, 8 bits
            *      gem level, 8 bits
            *      gem grade type, 8 bits
            *      gem grade value, 24 bits
            *      auction start time (unix timestamp), 32 bits
            *      auction end time (unix timestamp), 32 bits
            *      starting price (Gwei), 32 bits
            *      final price (Gwei), 32 bits
            *      current price (Gwei), 32 bits
            */

            const gem = {};
            gem.auctionIsLive = true;
            gem.owner = ownerId;
            gem.id = packed240uint.dividedToIntegerBy(new BigNumber(2).pow(8*3 + 24 + 32*5)).toNumber();
            gem.deadline = packed240uint.dividedToIntegerBy(new BigNumber(2).pow(32*3)).modulo(0x100000000).toNumber();
            gem.maxPrice = GWeiToEth(packed240uint.dividedToIntegerBy(new BigNumber(2).pow(32*2)).modulo(0x100000000).toNumber());
            gem.minPrice = GWeiToEth(packed240uint.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(0x100000000).toNumber());
            gem.currentPrice = GWeiToEth(packed240uint.modulo(0x100000000).toNumber());
            const gemPackedProperties = packed240uint.dividedToIntegerBy(new BigNumber(2).pow(32*5)).modulo(new BigNumber(2).pow(48));
            const gemProperties = unpackGemProperties(gemPackedProperties);

            return {
                ...gem,
                ...gemProperties,
                name: calculateGemName(gemProperties.color, gem.id),
                rate: calculateMiningRate(gemProperties.gradeType, gemProperties.gradeValue)
            }
        })
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

        //todo: get owner

        if (packed224uint.isZero()) {
            gemAuctionData.auctionIsLive = false;
        }
        else {
            gemAuctionData.auctionIsLive = true;
            gemAuctionData.deadline = packed224uint.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(0x100000000).toNumber();
            gemAuctionData.maxPrice = GWeiToEth(packed224uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(0x100000000).toNumber());
            gemAuctionData.minPrice = GWeiToEth(packed224uint.dividedToIntegerBy(new BigNumber(2).pow(64)).modulo(0x100000000).toNumber());
            gemAuctionData.currentPrice = GWeiToEth(packed224uint.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(0x100000000).toNumber());
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



