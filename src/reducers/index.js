import {combineReducers} from 'redux'
import market from '../pages/market/marketReducers'
import auction from '../pages/Auction/auctionReducer'
import auth from '../pages/authentication/authReducer'
import dashboard from '../pages/dashboard/dashboardReducer'

import {WEB3_ADDED, DUTCH_CONTRACT_ADDED, GEM_CONTRACT_ADDED}  from '../app/reduxConstants'



const appReducer = (state = { } , action) => {

    if (action.type === WEB3_ADDED){
        return {...state, web3: action.payload}
    }
    
    
    if (action.type === GEM_CONTRACT_ADDED){
        console.log('xxx', action.payload)
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