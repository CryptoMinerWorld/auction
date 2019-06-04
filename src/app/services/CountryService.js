import {BigNumber} from "bignumber.js";
import {unpackGemProperties} from "./GemService";

export default class CountryService {

    constructor(countryExtContractInstance, countryContractInstance) {
        this.countryExtContract = countryExtContractInstance;
        this.countryContract = countryContractInstance;
    }

    getTokenSoldMap = async () => {
        console.log('call token map >>>>>>>>>>>>>');
        const countriesSoldMap = await this.countryContract.methods.tokenMap()
          .call();
        console.log('token map return: <<<<<<<<<<<<<<<<<< ', new BigNumber(countriesSoldMap).toString(2).padStart(192, '0'), countriesSoldMap);
        return new BigNumber(countriesSoldMap).toString(2).padStart(192, '0');
    }

    getUserCountriesNumber = async userId => {
        const userIdToLowerCase = userId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join('');
        return await this.countryContract.methods.balanceOf(userIdToLowerCase).call();
    }

    getUserCountries = async userId => {
        const userIdToLowerCase = userId
          .split('')
          .map(item => (typeof item === 'string' ? item.toLowerCase() : item))
          .join('');

        const userPackedCountriesList = await this.countryContract.methods.getPackedCollection(userIdToLowerCase).call();
        return userPackedCountriesList.map((packedCountry) =>
            new BigNumber(packedCountry).dividedToIntegerBy(new BigNumber(2).pow(24)).modulo(0x100).toNumber()
        )
    }

    // getAllCountriesPacked = async () => {
    //
    //     const countriesContractData = await this.countryExtContract.methods.getAllCountriesPacked()
    //       .call();
    //
    //     countriesContractData.map(countryData => {
    //         const packed192uint = new BigNumber(countryData);
    //         const
    //         const gemId = packed80uint.dividedToIntegerBy(new BigNumber(2).pow(48)).toNumber();
    //         const gemPackedProperties = packed80uint.modulo(new BigNumber(2).pow(48));
    //         const gemProperties = unpackGemProperties(gemPackedProperties);
    //     })
    // 100011111111111111101111111111111111110101110011111001011111000101001100101000011000000000100010000100000000001000000000000000001000000010000000000001000000000000000000000000
    // 100011111111111111101111111111111111110101110011111001011111000001001100101000011000000000100010000100000000001000000000000000001000000010000000000001000000000000000000000000
    // 000000000000000000100011111111111111101111111111111111110101110011111001011111000101001100101000011000000000100010000100000000001000000000000000001000000010000000000001000000000000000000000000
    // 000000000000000000100011111111111111101111111111111111110101110011111001011111000101001100101000011000000000100010000100000000001000000000000000001000000010000000000001000000000010000000000000
    // }

}