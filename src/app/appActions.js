import {WEB3_ADDED, DUTCH_CONTRACT_ADDED, GEM_CONTRACT_ADDED} from './reduxConstants'

export const sendContractsToRedux = (dutchAuctionContractInstance,
    gemsContractInstance,
    web3 )=> (dispatch) => {
        dispatch({type: WEB3_ADDED, payload: web3})
        dispatch({type: DUTCH_CONTRACT_ADDED, payload: dutchAuctionContractInstance})
        dispatch({type: GEM_CONTRACT_ADDED, payload: gemsContractInstance})
    }

    export const temp = () => console.log('temp')


    