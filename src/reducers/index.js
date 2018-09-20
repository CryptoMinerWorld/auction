import {combineReducers} from 'redux'
import market from '../pages/market/marketReducers'
import auction from '../pages/Auction/auctionReducer'

export default combineReducers({
    market,
    auction
})