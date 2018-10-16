import {WEB3_ADDED, DUTCH_CONTRACT_ADDED, GEM_CONTRACT_ADDED, CURRENT_ACCOUNT_ADDED, PRESALE_CONTRACT_ADDED} from './reduxConstants'

export const sendContractsToRedux = (dutchAuctionContractInstance,
    gemsContractInstance,
    web3, presaleContract,
    currentAccount )=> (dispatch) => {
        dispatch({type: WEB3_ADDED, payload: web3})
        dispatch({type: DUTCH_CONTRACT_ADDED, payload: dutchAuctionContractInstance})
        dispatch({type: GEM_CONTRACT_ADDED, payload: gemsContractInstance})
        dispatch({type: CURRENT_ACCOUNT_ADDED, payload: currentAccount})
        dispatch({type: PRESALE_CONTRACT_ADDED, payload: presaleContract})
    }

    export const temp = () => console.log('temp')


    