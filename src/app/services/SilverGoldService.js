import store from "../store";
import {completedTx, ErrorTx, startTx} from "../../features/transactions/txActions";
import {utils} from "web3";
import {setError} from "../appActions";
import queryString from "query-string";
import Cookies from "universal-cookie";
import {BigNumber} from "bignumber.js";

export default class SilverGoldService {

    constructor(silverSaleContractInstance, silverContractInstance, goldContractInstance, refPointsTrackerContractInstance, silverCouponsContractInstance) {
        this.saleContract = silverSaleContractInstance;
        this.silverContract = silverContractInstance;
        this.goldContract = goldContractInstance;
        this.refPointsTrackerContract = refPointsTrackerContractInstance;
        this.silverCouponsContract = silverCouponsContractInstance;
        console.log('SilverGoldService constructor called', silverCouponsContractInstance);
    }

    getUserBalance = async (userId) => {
        console.log('get user balance for:', userId);
        const balance = await this.saleContract.methods
          .balanceOf(userId)
          .call();
        console.log('>>>>>>>>>>>>> BALANCE:', balance);
        return balance;
    }

    ifReferrerIsValid = async (referrer, referred) => {
        if (!(referrer && referred))  {
            return false;
        }
        return await this.refPointsTrackerContract.methods
          .isValid(referrer, referred)
          .call();
    }

    getBoxesAvailable = async () => {
        return await this.saleContract.methods
          .boxesAvailableArray()
          .call();
    }

    getSaleState = async () => {
        return await this.saleContract.methods.getState().call();
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

    useCoupon = (couponCode) => {
        console.log('use coupon')
        return this.silverCouponsContract.methods.useCoupon(couponCode)
          .send();
    }

    buyGeode = (type, amount, priceInEth, priceInPoints, referrer) => {

        const geodeTypeNumber = {
            'Silver Geode' : 0,
            'Rotund Silver Geode' : 1,
            'Goldish Silver Geode' : 2
        }[type];


        if (priceInPoints > 0) {
            console.log('USE REF POINTS: ', type, amount, priceInEth, priceInPoints);
            return this.saleContract.methods
              .get(geodeTypeNumber, amount)
              .send();
        }
        else {
            const priceInWei = Number(utils.toWei(priceInEth, 'ether'));
            if (referrer && referrer.startsWith('0x')) {
                return this.saleContract.methods
                  .buyRef(geodeTypeNumber, amount, referrer)
                  .send({
                      value: priceInWei,
                  });
            }
            else {
                return this.saleContract.methods
                  .buy(geodeTypeNumber, amount)
                  .send({
                      value: priceInWei,
                  });
            }
        }
    }

    getReferralId = (locationSearch) => {
        let params = queryString.parse(locationSearch);
        console.log('PARAMS: ', params);
        const cookies = new Cookies();

        let referrer;
        if (params.refId) {
            cookies.set('refId', params.refId, {path: '/'});
            referrer = params.refId;
            console.log('Cookie set: ', cookies.get('refId'));
        } else {
            referrer = cookies.get('refId');
        }
        return referrer;
    };

    removeReferralCookie = () => {
        const cookies = new Cookies();
        cookies.remove('refId');
    }

}

