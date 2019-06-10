import {BigNumber} from "bignumber.js";
import store from "../store";
import {calculateGemName, calculateMiningRate, unpackGemProperties} from "./GemService";
import {GWeiToEth, weiToEth} from "../../features/market/helpers";
import {getUserDetails} from "../../features/dashboard/dashboardActions";


export default class AuctionService {

    constructor(auctionContractInstance, auctionHelperContractInstance, gemContractInstance) {
        this.auctionContract = auctionContractInstance;
        this.auctionHelperContract = auctionHelperContractInstance;
        this.gemContract = gemContractInstance;
    }

    getAuctionOwnerGems = async (ownerId) => {
        console.log('AUCTION CONTRACT:::::',this.auctionContract);
        console.log('AUCTION CONTRACT:ADDR:',this.auctionContract.options.address);
        let packedAuctions;
        if (ownerId !== "0x0000000000000000000000000000000000000000") {
            packedAuctions = await this.auctionHelperContract.methods
              .getGemCollectionByOwner(this.auctionContract.options.address, this.gemContract.options.address, ownerId).call();
        }
        else {
            packedAuctions = await this.auctionHelperContract.methods
              .getAllGems(this.auctionContract.options.address, this.gemContract.options.address).call();
        };

        const auctionUserGems = packedAuctions.map(async (packedGem, index, initialList) => {
            if (index % 3 === 0) {
                //console.log('PACKED GEM:', packedGem);
                let auctionGem = parseAuctionGem(packedGem);
                let auctionData = parseAuctionData(initialList[index+1], initialList[index+2]);

                console.log('USER ADDRESS:', auctionGem.owner);
                const userDetails = await getUserDetails(auctionData.owner);
                console.log('USER DETAILS:', userDetails);
                auctionGem.userName = userDetails.name;
                auctionGem.userImage = userDetails.imageURL;
                //result.push(auctionGem);
                return auctionGem;
            }
            return null;
        });
            console.log('>>>>>>>>> AUCTION GEMS: ', auctionUserGems, ownerId);
            return (await Promise.all(auctionUserGems)).filter(gem => gem);
    }

    getTokenSaleStatus = async (tokenId) => {
        return await this.auctionContract.methods
            .getTokenSaleStatus(this.gemContract.options.address, tokenId)
            .call()

    }

    getItem = async (tokenId) => {
        return await (this.auctionContract.methods
            .items(this.gemContract.options.address, tokenId)
            .call()
        );
    }

    getPreviousOwner = async (tokenId) => {
        return (await this.auctionContract.methods
          .owners(this.gemContract.options.address, tokenId)
          .call())
    }

    getCurrentPrice = async (tokenId) => {
        return (await this.auctionContract.methods
          .getCurrentPrice(this.gemContract.options.address, tokenId)
          .call())
    }

    getGemAuctionData = async (tokenId) => {

        const tokenSaleStatusArray = await this.getTokenSaleStatus(tokenId);
        console.log('TOKEN SALE STATUS ARRAY:', tokenSaleStatusArray);
        const gemAuctionData = {};
        if (tokenSaleStatusArray['0'] === "0") {
            gemAuctionData.auctionIsLive = false;
        }
        else {
            gemAuctionData.owner = tokenSaleStatusArray['6']; //await this.getPreviousOwner(tokenId);
            gemAuctionData.auctionIsLive = true;
            gemAuctionData.deadline = Number(tokenSaleStatusArray['1']);
            gemAuctionData.maxPrice = weiToEth(Number(tokenSaleStatusArray['3']));
            gemAuctionData.minPrice = weiToEth(Number(tokenSaleStatusArray['4']));
            gemAuctionData.currentPrice = weiToEth(Number(tokenSaleStatusArray['5']));
        }
        return gemAuctionData;
    }
}

export const parseAuctionData = (firstPartPacked, secondPartPacked) => {
    // *  index 3i + 1 – 256 bits
    // *        auction start time, t0, 32 bits
    // *        auction end time, t1, 32 bits
    // *        starting price, p0, 96 bits
    // *        final price, p1, 96 bits
    // *  index 3i + 2
    // *        current price, p, 96 bits
    // *        token owner, 160 bits

    const firstPart256uint = new BigNumber(firstPartPacked);
    const secondPart256uint = new BigNumber(secondPartPacked);
    const gem = {};
    gem.deadline = firstPart256uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(new BigNumber(2).pow(96)).toNumber();
    gem.maxPrice = GWeiToEth(firstPart256uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(new BigNumber(2).pow(96)).toNumber());
    gem.minPrice = GWeiToEth(firstPart256uint.modulo(new BigNumber(2).pow(96)).toNumber());
    gem.currentPrice = GWeiToEth(secondPart256uint.dividedToIntegerBy(new BigNumber(2).pow(160)).toNumber());
    gem.owner = '0x'+secondPart256uint.modulo(new BigNumber(2).pow(160)).toString(16).padStart(40, '0');
    return gem;
}

export const
  parseAuctionGem = (auctionGem) => {
      const packed200uint = new BigNumber(auctionGem);

      // *  index 3i - 200 low bits
      // *        gem ID (24 bits)
      // *        gem color (8 bits)
      // *        gem level (8 bits)
      // *        gem grade (32 bits)
      // *        gem plots mined (24 bits)
      // *        gem blocks mined (32 bits)
      // *        gem energetic age (32 bits)
      // *        gem state (8 low bits)


      const gem = {};
      gem.auctionIsLive = true;
      gem.id = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(8 + 32 * 2 + 24 + 32 + 8*2)).toNumber();
      const gemPackedProperties = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(8 + 32 * 2 + 24 )).modulo(new BigNumber(2).pow(48));
      const gemProperties = unpackGemProperties(gemPackedProperties);
      gem.state = packed200uint.modulo(0x100);
      gem.energeticAge = packed200uint.dividedToIntegerBy(0x100).modulo(new BigNumber(2).pow(32)).toNumber();
      gem.blocksMined = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(8 + 32)).modulo(new BigNumber(2).pow(32));
      gem.plotsMined = packed200uint.dividedToIntegerBy(new BigNumber(2).pow(8 + 32 + 32)).modulo(new BigNumber(2).pow(24)).toNumber();

      return {
          ...gem,
          ...gemProperties,
          name: calculateGemName(gemProperties.color, gem.id),
          rate: calculateMiningRate(gemProperties.gradeType, gemProperties.gradeValue)
      }
  }

export const
  createAuctionHelper = async (
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



