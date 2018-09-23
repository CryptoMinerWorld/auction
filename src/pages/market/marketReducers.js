import { NEW_AUCTIONS_RECEIVED} from './marketConstants'
import {NEW_AUCTION_CREATED} from '../gems/gemConstants'

export default function marketReducer (state = [] , action) {
    
    if (action.type === NEW_AUCTIONS_RECEIVED){
        return action.payload
    }

    if (action.type === NEW_AUCTION_CREATED){
        return [...state, action.payload]
    }
    
    return state
    
}