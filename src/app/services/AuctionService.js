import {BigNumber} from "bignumber.js";
import store from "../store";
import {calculateGemName, calculateGemRestingEnergy, calculateMiningRate, unpackGemProperties} from "./GemService";
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
        }
        console.log(':::::',packedAuctions);

        const auctionUserGems = packedAuctions.map(async (packedGem, index, initialList) => {
            if (index % 3 === 0) {
                //console.log('PACKED GEM:', packedGem);
                let auctionGem = parseAuctionGem(packedGem);
                let auctionData = parseAuctionData(initialList[index+1], initialList[index+2]);

                console.log("Gems data:", auctionGem, auctionData);
                console.log('USER ADDRESS:', auctionData.owner);
                const userDetails = await getUserDetails(auctionData.owner);
                console.log('USER DETAILS:', userDetails);
                auctionGem.userName = userDetails.name;
                auctionGem.userImage = userDetails.imageURL;
                //result.push(auctionGem);
                return {...auctionGem, ...auctionData};
            }
            return null;
        });
            return (await Promise.all(auctionUserGems)).filter(gem => gem);
    };

    getTokenSaleStatus = async (tokenId) => {
        return await this.auctionContract.methods
            .getTokenSaleStatus(this.gemContract.options.address, tokenId)
            .call()

    };

    getItem = async (tokenId) => {
        return await (this.auctionContract.methods
            .items(this.gemContract.options.address, tokenId)
            .call()
        );
    };

    getPreviousOwner = async (tokenId) => {
        return (await this.auctionContract.methods
          .owners(this.gemContract.options.address, tokenId)
          .call())
    };

    getCurrentPrice = async (tokenId) => {
        return (await this.auctionContract.methods
          .getCurrentPrice(this.gemContract.options.address, tokenId)
          .call())
    };

    getGemAuctionData = async (tokenId) => {

        const tokenSaleStatusArray = await this.getTokenSaleStatus(tokenId);
        console.log('TOKEN SALE STATUS ARRAY:', tokenSaleStatusArray);
        const gemAuctionData = {};
        if (Number(tokenSaleStatusArray['t0']) === 0) {
            gemAuctionData.auctionIsLive = false;
        }
        else {
            gemAuctionData.owner = tokenSaleStatusArray['owner'];
            gemAuctionData.auctionIsLive = true;
            gemAuctionData.deadline = Number(tokenSaleStatusArray['t1']);
            gemAuctionData.maxPrice = weiToEth(Number(tokenSaleStatusArray['p0']));
            gemAuctionData.minPrice = weiToEth(Number(tokenSaleStatusArray['p1']));
            gemAuctionData.currentPrice = weiToEth(Number(tokenSaleStatusArray['p']));
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
    gem.deadline = firstPart256uint.dividedToIntegerBy(new BigNumber(2).pow(96*2)).modulo(new BigNumber(2).pow(32)).toNumber();
    gem.maxPrice = weiToEth(firstPart256uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(new BigNumber(2).pow(96)).toNumber());
    gem.minPrice = weiToEth(firstPart256uint.modulo(new BigNumber(2).pow(96)).toNumber());
    gem.currentPrice = weiToEth(secondPart256uint.dividedToIntegerBy(new BigNumber(2).pow(160)).toNumber());
    gem.owner = '0x'+secondPart256uint.modulo(new BigNumber(2).pow(160)).toString(16).padStart(40, '0');
    return gem;
};


// same packing as in gemERC732 getPackedCollection (see GemService.getOwnerGems());
export const parseAuctionGem = (auctionGem) => {
      const packed256uint = new BigNumber(auctionGem);
      const gemModifiedTime = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(224)).modulo(new BigNumber(2).pow(32)).toNumber();
      const gemAge = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(64)).modulo(new BigNumber(2).pow(32)).toNumber();
      const gradeType = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(184)).modulo(new BigNumber(2).pow(8)).toNumber();
      const gradeValue = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(160)).modulo(new BigNumber(2).pow(24)).toNumber();
      const level = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(152)).modulo(new BigNumber(2).pow(8)).toNumber();
      const color = packed256uint.dividedToIntegerBy(new BigNumber(2).pow(24)).modulo(new BigNumber(2).pow(8)).toNumber();
      const id = packed256uint.modulo(new BigNumber(2).pow(24)).toNumber();
      return {
          gradeType,
          gradeValue,
          level,
          color,
          id,
          age: gemAge,
          restingEnergy: gradeType >= 4 ? calculateGemRestingEnergy(gemAge, gemModifiedTime) : 0,
          state: packed256uint.dividedToIntegerBy(new BigNumber(2).pow(32)).modulo(new BigNumber(2).pow(32)).toNumber(),
          blocksMined: packed256uint.dividedToIntegerBy(new BigNumber(2).pow(96)).modulo(new BigNumber(2).pow(32)).toNumber(),
          plotsMined: packed256uint.dividedToIntegerBy(new BigNumber(2).pow(128)).modulo(new BigNumber(2).pow(24)).toNumber(),
          auctionIsLive: true,
          name: calculateGemName(color, id),
          rate: Math.floor(calculateMiningRate(gradeType, gradeValue)),
          //restingEnergyMinutes: calculateGemRestingEnergy(gemCreationTime)
      }
  };


