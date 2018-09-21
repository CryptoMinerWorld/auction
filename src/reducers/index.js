import {combineReducers} from 'redux'
import market from '../pages/market/marketReducers'
import auction from '../pages/Auction/auctionReducer'
import auth from '../pages/authentication/authReducer'
import dashboard from '../pages/dashboard/dashboardReducer'

export default combineReducers({
    market,
    auction,
    auth,
    dashboard
})