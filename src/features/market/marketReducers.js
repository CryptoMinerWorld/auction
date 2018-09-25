import { NEW_AUCTIONS_RECEIVED, MARKETPLACE_WAS_FILTERED} from './marketConstants'
import {NEW_AUCTION_CREATED} from '../dashboard/dashboardConstants'

export default function marketReducer (state = [] , action) {
    
    if (action.type === NEW_AUCTIONS_RECEIVED){
        return action.payload
    }

    if (action.type === NEW_AUCTION_CREATED){
        return [...state, action.payload]
    }

    if (action.type === NEW_AUCTION_CREATED){
        return [...state, action.payload]
    }

    if (action.type === MARKETPLACE_WAS_FILTERED){
        return action.payload
    }

    return state
    
}