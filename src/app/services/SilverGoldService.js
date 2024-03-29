import store from "../store";
import {completedTx, ErrorTx, startTx} from "../../features/transactions/txActions";
import {utils} from "web3";
import {setError} from "../appActions";
import queryString from "query-string";
import Cookies from "universal-cookie";
import {BigNumber} from "bignumber.js";

export default class SilverGoldService {

    constructor(silverSaleContract, balanceContract, refPointsTrackerContract) {
        this.saleContract = silverSaleContract;
        // this.silverContract = silverContract;
        // this.goldContract = goldContract;
        this.balanceContract = balanceContract;
        this.refPointsTrackerContract = refPointsTrackerContract;
    }

    getUserBalance = async (userId) => {
        const tokensToFetchBalancesOf = [
            process.env.REACT_APP_SILVER_ERC721,
            process.env.REACT_APP_GOLD_ERC721,
            process.env.REACT_APP_REF_POINTS_TRACKER,
            process.env.REACT_APP_GEM_ERC721,
            process.env.REACT_APP_PLOT_ERC721,
            process.env.REACT_APP_ARTIFACT_ERC20,
            process.env.REACT_APP_FOUNDERS_KEY_ERC20,
            process.env.REACT_APP_CHEST_KEY_ERC20,
        ];
        //do not change .methods.balancesOf to just .balancesOf when switching to assist.js
        const balances = await this.balanceContract.methods.balancesOf(tokensToFetchBalancesOf, userId).call();
        console.log("BALANCES:", balances);
        return {
            silver: balances[0],
            gold: balances[1],
            points: balances[2],
            gems: balances[3],
            plots: balances[4],
            artifacts: balances[5],
            // foundersKeys: balances[5],
            // chestKeys: balances[5]
            foundersKeys: balances[6],
            chestKeys: balances[7],
        }
    };

    ifReferrerIsValid = async (referrer, referred) => {
        if (!(referrer && referred))  {
            return false;
        }
        return await this.refPointsTrackerContract.methods
          .isValid(referrer, referred)
          .call();
    };

    getBoxesAvailable = async () => {
        return await this.saleContract.methods
          .boxesAvailableArray()
          .call();
    };

    getSaleState = async () => {
        return await this.saleContract.methods.getState().call();
    };

    getBoxesPricesArray = async () => {
        return await Promise.all([0,1,2].map(async (boxTypeNumber) =>
          Number(utils.fromWei(await this.saleContract.methods
              .getBoxPrice(boxTypeNumber)
              .call(), 'ether'))
        ))
    };

    useCoupon = (couponCode) => {
        return this.saleContract.methods.useCoupon(couponCode)
          .send();
    };

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
    };

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

