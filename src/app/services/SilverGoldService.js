import store from "../store";
import {completedTx, ErrorTx, startTx} from "../../features/transactions/txActions";
import {utils} from "web3";
import {setError} from "../appActions";

export default class SilverGoldService {

    constructor(silverSaleContractInstance, silverContractInstance, goldContractInstance) {
        console.log('SilverGoldService constructor called', silverSaleContractInstance);
        this.saleContract = silverSaleContractInstance;
        this.silverContract = silverContractInstance;
        this.goldContract = goldContractInstance;
    }

    getBoxesAvailable = async () => {
        return await this.saleContract.methods
          .boxesAvailableArray()
          .call();
    }

    // getBoxesToSell = async () => {
    //     return await this.saleContract.methods
    //       .BOXES_TO_SELL(0)
    //       .call();
    // }

    getBoxesPricesArray = async () => {
        return await Promise.all([0,1,2].map(async (boxTypeNumber) =>
          Number(utils.fromWei(await this.saleContract.methods
              .getBoxPrice(boxTypeNumber)
              .call(), 'ether'))
        ))
    }


    getAvailableSilver = (userId) => {

        return this.silverContract.methods.balanceOf(userId)
            .call()
            .then(silver => silver)
            .catch(error => setError(error));
    }

    getAvailableGold = (userId) => {

        return this.goldContract.methods.balanceOf(userId)
            .call()
            .then(gold => gold)
            .catch(error => {
                setError(error)
            });
    }


    buyGeode = (type, amount, priceInEth) => {

        const geodeTypeNumber = {
            'Silver Geode' : 0,
            'Rotund Silver Geode' : 1,
            'Goldish Silver Geode' : 2
        }[type];

        const priceInWei = Number(utils.toWei(priceInEth, 'ether'));

        return this.saleContract.methods
          .buy(geodeTypeNumber, amount)
          .send({
              value: priceInWei,
          });
    }
}