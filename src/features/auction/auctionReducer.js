import { AUCTION_DETAILS_RECEIVED} from "./auctionConstants"

export default function auctionReducer (state = {} , action) {
    
    if (action.type === AUCTION_DETAILS_RECEIVED){
        return action.payload
    }
    
    return state
    
}