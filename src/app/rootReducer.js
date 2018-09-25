import {combineReducers} from 'redux'
import market from '../features/market/marketReducers'
import auction from '../features/auction/auctionReducer'
import auth from '../features/auth/authReducer'
import dashboard from '../features/dashboard/dashboardReducer'

import {WEB3_ADDED, DUTCH_CONTRACT_ADDED, GEM_CONTRACT_ADDED}  from './reduxConstants'



const appReducer = (state = { } , action) => {

    if (action.type === WEB3_ADDED){
        return {...state, web3: action.payload}
    }
    
    if (action.type === GEM_CONTRACT_ADDED){
        return {...state, gemsContractInstance: action.payload}
    }

    if (action.type === DUTCH_CONTRACT_ADDED){
        return {...state, dutchContractInstance: action.payload}
    }
   
    return state
    
}


export default combineReducers({
    market,
    auction,
    auth,
    dashboard,
    app: appReducer
})