import {WEB3_ADDED, DUTCH_CONTRACT_ADDED, GEM_CONTRACT_ADDED, CURRENT_ACCOUNT_ADDED} from './reduxConstants'

export const sendContractsToRedux = (dutchAuctionContractInstance,
    gemsContractInstance,
    web3, currentAccount ) => (dispatch) => {
        dispatch({type: DUTCH_CONTRACT_ADDED, payload: dutchAuctionContractInstance})
        dispatch({type: GEM_CONTRACT_ADDED, payload: gemsContractInstance})
        dispatch({type: WEB3_ADDED, payload: web3})
        dispatch({type: CURRENT_ACCOUNT_ADDED, payload: currentAccount})
    }

    export const temp = () => console.log('temp')


    